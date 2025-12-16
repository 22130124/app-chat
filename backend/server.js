const mongoose = require("mongoose");
const dotenv = require("dotenv");
const http = require("http");
const WebSocket = require("ws");
const crypto = require("crypto");

//load biến mt
dotenv.config({ path: "./.env" });

const app = require("./app");
const User = require("./models/User");
const Conversation = require("./models/Conversation");
const Message = require("./models/Message");

// Create HTTP và WS server
const server = http.createServer(app);
const wss = new WebSocket.Server({ server, path: "/ws" });

// Connection tracking
const activeConnections = new Map();
const roomMembers = new Map();

//Dùng test
function log(...args) {
  console.log("[WS]", ...args);
}

function send(ws, payload) {
  if (ws.readyState === WebSocket.OPEN) {
    ws.send(JSON.stringify(payload));
  }
}

function sendToUsername(username, payload) {
  const ws = activeConnections.get(username?.toLowerCase());
  if (ws && ws.readyState === WebSocket.OPEN) {
    ws.send(JSON.stringify(payload));
  }
}

function addUserToRoom(username, roomName) {
  const key = roomName.toLowerCase();
  if (!roomMembers.has(key)) roomMembers.set(key, new Set());
  roomMembers.get(key).add(username.toLowerCase());
}

function getRoomMembers(roomName) {
  const key = roomName.toLowerCase();
  return roomMembers.get(key) || new Set();
}

function generateReLoginCode() {
  return "re_" + crypto.randomBytes(8).toString("hex");
}

async function getUserByUsername(username, opts = {}) {
  if (!username) return null;
  return User.findOne({ username: username.toLowerCase() }, opts);
}

wss.on("connection", (ws) => {
  ws.username = null;
  log("Client connected");

  ws.on("message", async (data) => {
    try {
      const msg = JSON.parse(data.toString());
      if (msg.action !== "onchat" || !msg.data) {
        send(ws, { status: "error", message: "Invalid action" });
        return;
      }
      const event = msg.data.event;
      const payload = msg.data.data || {};
      await handleEvent(ws, event, payload);
    } catch (err) {
      console.error("WS message error", err);
      send(ws, { status: "error", message: "Invalid message format" });
    }
  });

  ws.on("close", async () => {
    if (ws.username) {
      activeConnections.delete(ws.username);
      await User.findOneAndUpdate(
        { username: ws.username },
        { status: "Offline" }
      );
      log(`User ${ws.username} disconnected`);
    }
  });
});

async function handleEvent(ws, event, data) {
  switch (event) {
    case "REGISTER":
      return register(ws, data);
    case "LOGIN":
      return login(ws, data);
    case "RE_LOGIN":
      return reLogin(ws, data);
    case "LOGOUT":
      return logout(ws);
    case "CREATE_ROOM":
      return createRoom(ws, data);
    case "JOIN_ROOM":
      return joinRoom(ws, data);
    case "GET_ROOM_CHAT_MES":
      return getRoomMessages(ws, data);
    case "GET_PEOPLE_CHAT_MES":
      return getPeopleMessages(ws, data);
    case "SEND_CHAT":
      return sendChat(ws, data);
    case "CHECK_USER":
      return checkUser(ws, data);
    case "GET_USER_LIST":
      return getUserList(ws);
    default:
      return send(ws, { status: "error", message: `Unknown event ${event}` });
  }
}

async function register(ws, data) {
  const { user, pass } = data || {};
  if (!user || !pass) {
    return send(ws, {
      status: "error",
      event: "REGISTER",
      message: "user & pass required",
    });
  }
  const existing = await getUserByUsername(user);
  if (existing) {
    return send(ws, {
      status: "error",
      event: "REGISTER",
      message: "User already exists",
    });
  }
  const newUser = new User({
    username: user,
    password: pass,
    status: "Online",
  });
  await newUser.save();
  const code = generateReLoginCode();
  newUser.reLoginCode = code;
  await newUser.save();
  ws.username = newUser.username;
  activeConnections.set(newUser.username, ws);
  send(ws, {
    status: "success",
    event: "REGISTER",
    message: "Registered",
    data: { RE_LOGIN_CODE: code },
  });
}

async function login(ws, data) {
  const { user, pass } = data || {};
  if (!user || !pass) {
    return send(ws, {
      status: "error",
      event: "LOGIN",
      message: "user & pass required",
    });
  }
  const found = await User.findOne({ username: user.toLowerCase() }).select(
    "+password"
  );
  if (!found || !(await found.correctPassword(pass, found.password))) {
    return send(ws, {
      status: "error",
      event: "LOGIN",
      message: "Invalid credentials",
    });
  }
  const code = generateReLoginCode();
  found.reLoginCode = code;
  found.status = "Online";
  await found.save();
  ws.username = found.username;
  activeConnections.set(found.username, ws);
  send(ws, {
    status: "success",
    event: "RE_LOGIN",
    data: { RE_LOGIN_CODE: code },
  });
}

async function reLogin(ws, data) {
  const { user, code } = data || {};
  if (!user || !code) {
    return send(ws, {
      status: "error",
      event: "RE_LOGIN",
      message: "user & code required",
    });
  }
  const found = await getUserByUsername(user);
  if (!found || found.reLoginCode !== code) {
    return send(ws, {
      status: "error",
      event: "RE_LOGIN",
      message: "Invalid code",
    });
  }
  ws.username = found.username;
  activeConnections.set(found.username, ws);
  await User.findByIdAndUpdate(found._id, { status: "Online" });
  send(ws, { status: "success", event: "RE_LOGIN_OK" });
}

async function logout(ws) {
  if (ws.username) {
    await User.findOneAndUpdate(
      { username: ws.username },
      { status: "Offline" }
    );
    activeConnections.delete(ws.username);
  }
  send(ws, { status: "success", event: "LOGOUT" });
}

async function createRoom(ws, data) {
  if (!ws.username)
    return send(ws, {
      status: "error",
      event: "CREATE_ROOM",
      message: "Not logged in",
    });
  const { name } = data || {};
  if (!name)
    return send(ws, {
      status: "error",
      event: "CREATE_ROOM",
      message: "name required",
    });
  let room = await Conversation.findOne({ roomName: name.toLowerCase() });
  if (!room) {
    room = await Conversation.create({ roomName: name.toLowerCase() });
  }
  addUserToRoom(ws.username, name);
  send(ws, { status: "success", event: "CREATE_ROOM", data: { name } });
}

async function joinRoom(ws, data) {
  if (!ws.username)
    return send(ws, {
      status: "error",
      event: "JOIN_ROOM",
      message: "Not logged in",
    });
  const { name } = data || {};
  if (!name)
    return send(ws, {
      status: "error",
      event: "JOIN_ROOM",
      message: "name required",
    });
  let room = await Conversation.findOne({ roomName: name.toLowerCase() });
  if (!room) {
    room = await Conversation.create({ roomName: name.toLowerCase() });
  }
  addUserToRoom(ws.username, name);
  send(ws, { status: "success", event: "JOIN_ROOM", data: { name } });
}

async function getRoomMessages(ws, data) {
  if (!ws.username)
    return send(ws, {
      status: "error",
      event: "GET_ROOM_CHAT_MES",
      message: "Not logged in",
    });
  const { name, page = 1 } = data || {};
  if (!name)
    return send(ws, {
      status: "error",
      event: "GET_ROOM_CHAT_MES",
      message: "name required",
    });
  const room = await Conversation.findOne({ roomName: name.toLowerCase() });
  if (!room)
    return send(ws, {
      status: "success",
      event: "GET_ROOM_CHAT_MES",
      data: { messages: [] },
    });
  const limit = 20;
  const skip = (Number(page) - 1) * limit;
  const messages = await Message.find({ conversation_id: room._id })
    .sort({ createdAt: -1 })
    .skip(skip)
    .limit(limit);
  send(ws, {
    status: "success",
    event: "GET_ROOM_CHAT_MES",
    data: { messages: messages.reverse() },
  });
}

async function getPeopleMessages(ws, data) {
  if (!ws.username)
    return send(ws, {
      status: "error",
      event: "GET_PEOPLE_CHAT_MES",
      message: "Not logged in",
    });
  const { name, page = 1 } = data || {};
  if (!name)
    return send(ws, {
      status: "error",
      event: "GET_PEOPLE_CHAT_MES",
      message: "name required",
    });
  const me = await getUserByUsername(ws.username);
  const other = await getUserByUsername(name);
  if (!me || !other)
    return send(ws, {
      status: "error",
      event: "GET_PEOPLE_CHAT_MES",
      message: "User not found",
    });
  let conversation = await Conversation.findOne({
    participants: { $all: [me._id, other._id], $size: 2 },
  });
  if (!conversation) {
    conversation = await Conversation.create({
      participants: [me._id, other._id],
    });
  }
  const limit = 20;
  const skip = (Number(page) - 1) * limit;
  const messages = await Message.find({ conversation_id: conversation._id })
    .sort({ createdAt: -1 })
    .skip(skip)
    .limit(limit);
  send(ws, {
    status: "success",
    event: "GET_PEOPLE_CHAT_MES",
    data: { messages: messages.reverse() },
  });
}

async function sendChat(ws, data) {
  if (!ws.username)
    return send(ws, {
      status: "error",
      event: "SEND_CHAT",
      message: "Not logged in",
    });
  const { type, to, mes } = data || {};
  if (!type || !to || typeof mes !== "string") {
    return send(ws, {
      status: "error",
      event: "SEND_CHAT",
      message: "type, to, mes required",
    });
  }
  const fromUser = await getUserByUsername(ws.username);
  if (!fromUser)
    return send(ws, {
      status: "error",
      event: "SEND_CHAT",
      message: "User not found",
    });

  if (type === "room") {
    let room = await Conversation.findOne({ roomName: to.toLowerCase() });
    if (!room) room = await Conversation.create({ roomName: to.toLowerCase() });
    addUserToRoom(ws.username, to);
    const message = await Message.create({
      conversation_id: room._id,
      from: fromUser._id,
      to: fromUser._id,
      text: mes,
      type: "Text",
    });
    await Conversation.findByIdAndUpdate(room._id, {
      lastMessage: message._id,
      lastMessageAt: Date.now(),
    });
    const payload = {
      status: "success",
      event: "SEND_CHAT",
      data: { type, to, mes, from: ws.username },
    };
    for (const member of getRoomMembers(to)) {
      sendToUsername(member, payload);
    }
    return;
  }

  if (type === "people") {
    const target = await getUserByUsername(to);
    if (!target)
      return send(ws, {
        status: "error",
        event: "SEND_CHAT",
        message: "Target not found",
      });
    let conversation = await Conversation.findOne({
      participants: { $all: [fromUser._id, target._id], $size: 2 },
    });
    if (!conversation) {
      conversation = await Conversation.create({
        participants: [fromUser._id, target._id],
      });
    }
    const message = await Message.create({
      conversation_id: conversation._id,
      from: fromUser._id,
      to: target._id,
      text: mes,
      type: "Text",
    });
    await Conversation.findByIdAndUpdate(conversation._id, {
      lastMessage: message._id,
      lastMessageAt: Date.now(),
    });
    const payload = {
      status: "success",
      event: "SEND_CHAT",
      data: { type, to, mes, from: ws.username },
    };
    sendToUsername(ws.username, payload);
    sendToUsername(target.username, payload);
    return;
  }

  send(ws, { status: "error", event: "SEND_CHAT", message: "Invalid type" });
}

async function checkUser(ws, data) {
  const { user } = data || {};
  const found = await getUserByUsername(user);
  send(ws, {
    status: "success",
    event: "CHECK_USER",
    data: { exists: !!found },
  });
}

async function getUserList(ws) {
  const users = await User.find({}, "username status");
  send(ws, { status: "success", event: "GET_USER_LIST", data: { users } });
}

// Mongo connect & start server
const DB = process.env.DATABASE_URL;
if (!DB) {
  console.error("DATABASE_URL is not defined");
  process.exit(1);
}

mongoose
  .connect(DB)
  .then(() => console.log("DB Connection successful"))
  .catch((err) => {
    console.error("DB Connection error:", err);
  });

const port = process.env.PORT || 8000;
server.listen(port, () => {
  console.log(`App running on port ${port}...`);
  console.log(`WebSocket server running on ws://localhost:${port}/ws`);
});

process.on("unhandledRejection", (err) => {
  console.log("UNHANDLED REJECTION! Shutting down...");
  console.log(err.name, err.message);
  server.close(() => {
    process.exit(1);
  });
});

process.on("uncaughtException", (err) => {
  console.log("UNCAUGHT EXCEPTION! Shutting down...");
  console.log(err.name, err.message);
  process.exit(1);
});
