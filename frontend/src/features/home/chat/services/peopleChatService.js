import { sendSocketMessage } from "../../../../socket/socket.js";
import { formatMessageTime } from "../../../../utils/dateFormat.js";
import { updateConversationLastMessage } from "../../conversation-list/slice/conversationListSlice.js";
import { addNewMessage } from "../slice/chatSlice.js";

// Callbacks để xử lý responses từ server
let peopleChatCallback = {};

//hàm lấy ds tin nhắn 1-1
export const getPeopleChatMes = ({ name, page = 1 }, callback) => {
  const eventKey = `GET_PEOPLE_CHAT_MES_${name}_${page}`;
  peopleChatCallback[eventKey] = callback;

  sendSocketMessage({
    action: "onchat",
    data: {
      event: "GET_PEOPLE_CHAT_MES",
      data: {
        name,
        page,
      },
    },
  }).catch((error) => {
    // Nếu reconnect thất bại, gọi callback với error
    if (callback && peopleChatCallback[eventKey] === callback) {
      callback({
        status: "error",
        mes: error.message || "Socket chưa được kết nối.",
      });
      delete peopleChatCallback[eventKey];
    }
  });

  // Timeout sau 20 giây nếu không có response
  setTimeout(() => {
    if (peopleChatCallback[eventKey] === callback) {
      console.warn("Timeout: Không nhận được response từ GET_PEOPLE_CHAT_MES");
      callback({
        status: "error",
        mes: "Timeout: Không nhận được response từ server",
      });
      delete peopleChatCallback[eventKey];
    }
  }, 20000);
};

//hàm gửi tin nhắn đến người dùng (1-1)
export const sendPeopleChat = ({ to, mes }, callback) => {
  const eventKey = `SEND_CHAT_PEOPLE_${to}_${Date.now()}`;
  if (callback) {
    peopleChatCallback[eventKey] = callback;
  }

  sendSocketMessage({
    action: "onchat",
    data: {
      event: "SEND_CHAT",
      data: {
        type: "people",
        to: to,
        mes: mes,
      },
    },
  }).catch((error) => {
    // Nếu reconnect thất bại, gọi callback với error
    if (callback && peopleChatCallback[eventKey] === callback) {
      callback({
        status: "error",
        mes: error.message || "Socket chưa được kết nối.",
      });
      delete peopleChatCallback[eventKey];
    }
  });
};

//hàm check user có tồn tại ko
export const checkUser = ({ user }, callback) => {
  const eventKey = `CHECK_USER_${user}`;
  peopleChatCallback[eventKey] = callback;

  sendSocketMessage({
    action: "onchat",
    data: {
      event: "CHECK_USER",
      data: {
        user: user,
      },
    },
  }).catch((error) => {
    // Nếu reconnect thất bại, gọi callback với error
    if (callback && peopleChatCallback[eventKey] === callback) {
      callback({
        status: "error",
        mes: error.message || "Socket chưa được kết nối.",
      });
      delete peopleChatCallback[eventKey];
    }
  });
};

//hàm lấy ra ds user
export const getUserList = (callback) => {
  const eventKey = "GET_USER_LIST";
  peopleChatCallback[eventKey] = callback;

  sendSocketMessage({
    action: "onchat",
    data: {
      event: "GET_USER_LIST",
    },
  }).catch((error) => {
    // Nếu reconnect thất bại, gọi callback với error
    if (callback && peopleChatCallback[eventKey] === callback) {
      callback({
        status: "error",
        mes: error.message || "Socket chưa được kết nối.",
      });
      delete peopleChatCallback[eventKey];
    }
  });
};

// PEOPLE CHAT - xử lý response riêng lẻ vì có các callback key khác nhau
export const handleGetPeopleChatMesResponse = (message) => {
  const { status, data, event } = message;

  const keys = Object.keys(peopleChatCallback).filter((key) =>
    key.startsWith("GET_PEOPLE_CHAT_MES_")
  );

  keys.forEach((key) => {
    const callback = peopleChatCallback[key];
    callback?.({ status, data, event });
    delete peopleChatCallback[key];
  });
};

export const handleSendChatResponse = (message) => {
  const { status, data, event } = message;

  const keys = Object.keys(peopleChatCallback).filter((key) =>
    key.startsWith("SEND_CHAT_PEOPLE_")
  );

  keys.forEach((key) => {
    const callback = peopleChatCallback[key];
    callback?.({ status, data, event });
    delete peopleChatCallback[key];
  });
};

export const handleCheckUserResponse = (message) => {
  const { status, data, event } = message;

  const keys = Object.keys(peopleChatCallback).filter((key) =>
    key.startsWith("CHECK_USER_")
  );

  keys.forEach((key) => {
    const callback = peopleChatCallback[key];
    callback?.({ status, data, event });
    delete peopleChatCallback[key];
  });
};

export const handleGetUserListResponse = (message) => {
  const { status, data, event } = message;

  const callback = peopleChatCallback["GET_USER_LIST"];
  callback?.({ status, data, event });
  delete peopleChatCallback["GET_USER_LIST"];
};

//push message realtime
export const handlePeopleChatMessage = (message, dispatch) => {
  const { status, data } = message;
  const currentUser = localStorage.getItem("user");

  if (status !== "success" || !data || data.type === undefined) {
    return;
  }

  //0:people, 1:room
  if (data.type === 0) {
    const isSent = data.name === currentUser;
    const otherUser = isSent ? data.to : data.from;

    // Thêm tin nhắn vào mảng messages[]
    dispatch(
      addNewMessage({
        from: data.name,
        to: data.to,
        mes: data.mes,
        time: formatMessageTime(data.time || new Date()),
        isSent,
      })
    );

    // Cập nhật last message cho conversation list
    dispatch(
      updateConversationLastMessage({
        user: otherUser,
        lastMessage: data.mes,
        time: formatMessageTime(data.time || new Date()),
      })
    );
  }

  if (data.type === 1) {
    // Ngân làm vào đây nha
  }
};
