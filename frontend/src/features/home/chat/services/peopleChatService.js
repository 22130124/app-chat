import { isSocketReady, sendSocketMessage } from "../../../../socket/socket.js";

// Callbacks để xử lý responses từ server
let peopleChatCallback = {};

//hàm lấy ds tin nhắn 1-1
export const getPeopleChatMes = ({ name, page = 1 }, callback) => {
  // Kiểm tra socket đã sẵn sàng chưa
  if (!isSocketReady()) {
    if (callback) {
      callback({
        status: "error",
        mes: "Socket chưa được kết nối.",
      });
    }
    return;
  }

  const eventKey = `GET_PEOPLE_CHAT_MES_${name}_${page}`;
  peopleChatCallback[eventKey] = callback;

  console.log("Gửi request GET_PEOPLE_CHAT_MES:", { name, page });
  sendSocketMessage({
    action: "onchat",
    data: {
      event: "GET_PEOPLE_CHAT_MES",
      data: {
        name,
        page,
      },
    },
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
  if (!isSocketReady()) {
    if (callback) {
      callback({
        status: "error",
        mes: "Socket chưa được kết nối.",
      });
    }
    return;
  }

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
  });
};

//hàm check user có tồn tại ko
export const checkUser = ({ user }, callback) => {
  if (!isSocketReady()) {
    if (callback) {
      callback({
        status: "error",
        mes: "Socket chưa được kết nối. Vui lòng thử lại sau.",
      });
    }
    return;
  }

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
  });
};

//hàm lấy ra ds user
export const getUserList = (callback) => {
  if (!isSocketReady()) {
    if (callback) {
      callback({
        status: "error",
        mes: "Socket chưa được kết nối.",
      });
    }
    return;
  }

  const eventKey = "GET_USER_LIST";
  peopleChatCallback[eventKey] = callback;

  console.log("Gửi request GET_USER_LIST");
  sendSocketMessage({
    action: "onchat",
    data: {
      event: "GET_USER_LIST",
    },
  });
};

//hàm xử ly response từ server cho các event liên quan
export const handlePeopleChatResponse = (message) => {
  const { event, status, data } = message;

  //xử lý res GET_PEOPLE_CHAT_MES
  if (event === "GET_PEOPLE_CHAT_MES") {
    console.log("Nhận được response GET_PEOPLE_CHAT_MES:", {
      status,
      data,
      event,
    });
    const keys = Object.keys(peopleChatCallback).filter((key) =>
      key.startsWith("GET_PEOPLE_CHAT_MES_")
    );
    keys.forEach((key) => {
      const callback = peopleChatCallback[key];
      if (callback) {
        console.log("Gọi callback GET_PEOPLE_CHAT_MES cho key:", key);
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
    console.log("Nhận được response GET_USER_LIST:", { status, data, event });
    const callback = peopleChatCallback["GET_USER_LIST"];
    if (callback) {
      console.log("Gọi callback GET_USER_LIST");
      callback({ status, data, event });
      delete peopleChatCallback["GET_USER_LIST"];
    } else {
      console.warn("Không tìm thấy callback cho GET_USER_LIST");
    }
  }
};
