const mongoose = require("mongoose");
const dotenv = require("dotenv");
const http = require("http");
const WebSocket = require("ws");
const crypto = require("crypto");

//load biến mt
dotenv.config({ path: "./.env" });

const app = require("./app");
const User = require("./models/User");

// Create HTTP và WS server
const server = http.createServer(app);
const wss = new WebSocket.Server({ server, path: "/ws" });

// Connection tracking
const activeConnections = new Map(); // username -> ws

//Dùng test
function log(...args) {
  console.log("[WS]", ...args);
}

function send(ws, payload) {
  if (ws.readyState === WebSocket.OPEN) {
    ws.send(JSON.stringify(payload));
  }
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
