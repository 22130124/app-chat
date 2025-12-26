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

  console.log("Gửi request GET_PEOPLE_CHAT_MES:", { name, page });
  // sendSocketMessage sẽ tự động reconnect nếu socket chưa sẵn sàng
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

//hàm xử ly response từ server cho các event liên quan
export const handlePeopleChatResponse = (message) => {
  const { event, status, data } = message;

  //xử lý res GET_PEOPLE_CHAT_MES
  if (event === "GET_PEOPLE_CHAT_MES") {
    const keys = Object.keys(peopleChatCallback).filter((key) =>
      key.startsWith("GET_PEOPLE_CHAT_MES_")
    );
    keys.forEach((key) => {
      const callback = peopleChatCallback[key];
      if (callback) {
        callback({ status, data, event });
        delete peopleChatCallback[key];
      }
    });
  }

  // xử lý res SEND_CHAT (type people)
  if (event === "SEND_CHAT" && data?.type === "people") {
    const keys = Object.keys(peopleChatCallback).filter((key) =>
      key.startsWith("SEND_CHAT_PEOPLE_")
    );
    keys.forEach((key) => {
      const callback = peopleChatCallback[key];
      if (callback) {
        callback({ status, data, event });
        delete peopleChatCallback[key];
      }
    });
  }

  //xử lý res CHECK_USER
  if (event === "CHECK_USER") {
    const keys = Object.keys(peopleChatCallback).filter((key) =>
      key.startsWith("CHECK_USER_")
    );
    keys.forEach((key) => {
      const callback = peopleChatCallback[key];
      if (callback) {
        callback({ status, data, event });
        delete peopleChatCallback[key];
      }
    });
  }

  // Xử lý GET_USER_LIST response
  if (event === "GET_USER_LIST") {
    const callback = peopleChatCallback["GET_USER_LIST"];
    if (callback) {
      callback({ status, data, event });
      delete peopleChatCallback["GET_USER_LIST"];
    }
  }
};

export const handlePeopleChatMessage = (message, dispatch) => {
  const { event, status, data } = message;
  const currentUser = localStorage.getItem("user");

  // Xử lý tin nhắn mới nhận được (SEND_CHAT res)
  if (
    event === "SEND_CHAT" &&
    status === "success" &&
    data?.type === "people"
  ) {
    const messageData = data;
    if (messageData) {
      // Cập nhật last mes trong conv list
      dispatch(
        updateConversationLastMessage({
          user: messageData.to,
          lastMessage: messageData.mes,
          time: formatMessageTime(messageData.time || new Date()),
        })
      );
    }
  }

  // Xử lý tin nhắn nhận được từ người khác (có thể là event khác từ server)
  // Nếu server gửi tin nhắn mới qua event khác
  if (
    event === "NEW_MESSAGE" ||
    (event === "SEND_CHAT" && data?.from && data?.from !== currentUser)
  ) {
    const messageData = data;
    if (messageData && messageData.type === "people") {
      dispatch(
        addNewMessage({
          from: messageData.from,
          to: messageData.to,
          mes: messageData.mes,
          time: formatMessageTime(messageData.time || new Date()),
          isSent: false,
        })
      );

      dispatch(
        updateConversationLastMessage({
          user: messageData.from,
          lastMessage: messageData.mes,
          time: formatMessageTime(messageData.time || new Date()),
        })
      );
    }
  }
};
