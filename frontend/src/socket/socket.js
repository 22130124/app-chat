// Biến socket dùng để lưu instance WebSocket hiện tại
// Đặt ngoài scope để dùng chung cho nhiều hàm
let socket = null;

// Lưu callback để có thể set lại khi reconnect
let messageCallback = null;
// Lưu callback để gọi khi reconnect thành công (ví dụ: relogin)
let onReconnectCallback = null;
// Flag để kiểm tra có đang reconnect không
let isReconnecting = false;
// Số lần reconnect (để tránh reconnect vô hạn)
let reconnectAttempts = 0;
const MAX_RECONNECT_ATTEMPTS = 5;

// URL WebSocket server
const SOCKET_URL = "wss://chat.longapp.site/chat/chat";

// Hàm kiểm tra socket đã sẵn sàng chưa
const isSocketReady = () => {
  return socket && socket.readyState === WebSocket.OPEN;
};

// Hàm reconnect tự động
const reconnect = () => {
  if (isReconnecting || reconnectAttempts >= MAX_RECONNECT_ATTEMPTS) {
    return;
  }

  isReconnecting = true;
  reconnectAttempts++;

  console.log(`Đang thử kết nối lại WebSocket (lần ${reconnectAttempts})...`);

  setTimeout(() => {
    if (messageCallback) {
      connectSocket(messageCallback)
        .then(() => {
          isReconnecting = false;
          reconnectAttempts = 0; // Reset khi reconnect thành công
          console.log("Đã kết nối lại WebSocket thành công");

          // Gọi callback relogin nếu có (để server biết user vẫn online)
          if (onReconnectCallback) {
            onReconnectCallback();
          }
        })
        .catch(() => {
          isReconnecting = false;
          // Sẽ tự động reconnect lại nếu chưa đạt max attempts
          if (reconnectAttempts < MAX_RECONNECT_ATTEMPTS) {
            reconnect();
          } else {
            console.error("Đã đạt số lần reconnect tối đa");
          }
        });
    } else {
      isReconnecting = false;
    }
  }, 2000); // Đợi 2 giây trước khi reconnect
};

// Hàm kết nối WebSocket
// onMessageCallback: hàm callback để xử lý dữ liệu server gửi về
// onReconnect: hàm callback để gọi khi reconnect thành công (ví dụ: relogin)
export const connectSocket = (onMessageCallback, onReconnect = null) => {
  // Lưu callback để dùng khi reconnect
  if (onMessageCallback) {
    messageCallback = onMessageCallback;
  }
  // Lưu callback relogin
  if (onReconnect) {
    onReconnectCallback = onReconnect;
  }
  // Nếu socket đã tồn tại và đang ở trạng thái OPEN thì không tạo kết nối mới nữa
  if (isSocketReady()) {
    return Promise.resolve(socket);
  }

  return new Promise((resolve, reject) => {
    // Tạo kết nối WebSocket mới
    socket = new WebSocket(SOCKET_URL);

    // Khi kết nối thành công
    socket.onopen = () => {
      console.log("Đã kết nối WebSocket");
      reconnectAttempts = 0; // Reset khi kết nối thành công
      isReconnecting = false;
      resolve(socket);
    };

    // Khi nhận được message từ server
    socket.onmessage = (event) => {
      try {
        // Parse về JSON
        const data = JSON.parse(event.data);
        // Nếu có callback thì gọi callback
        messageCallback && messageCallback(data);
      } catch (err) {
        // Trường hợp data không phải JSON hợp lệ
        console.error("Socket message không hợp lệ", err);
      }
    };

    // Khi xảy ra lỗi trong quá trình kết nối
    socket.onerror = (error) => {
      console.error("Lỗi khi kết nối WebSocket", error);
      reject(error);
    };

    // Khi socket bị đóng (server đóng hoặc client đóng)
    socket.onclose = (event) => {
      console.log("Đã ngắt kết nối WebSocket");
      socket = null;

      // Chỉ reconnect nếu không phải do client đóng (code 1000) và chưa đạt max attempts
      if (event.code !== 1000 && reconnectAttempts < MAX_RECONNECT_ATTEMPTS) {
        reconnect();
      }
    };
  });
};

// Hàm gửi message lên server
// payload: object dữ liệu muốn gửi
export const sendSocketMessage = (payload) => {
  // Kiểm tra socket đã tồn tại và đang mở chưa
  if (!isSocketReady()) {
    console.error("Socket chưa được kết nối");
    return;
  }

  // Convert object sang JSON string
  socket.send(JSON.stringify(payload));
};

// Hàm ngắt kết nối WebSocket
export const disconnectSocket = () => {
  // Reset các biến khi disconnect
  reconnectAttempts = MAX_RECONNECT_ATTEMPTS; // Ngăn không cho reconnect
  isReconnecting = false;
  messageCallback = null;
  onReconnectCallback = null;

  if (socket) {
    // Đóng với code 1000 (normal closure) để không trigger reconnect
    socket.close(1000, "Client disconnect");
    socket = null;
  }
};

export { isSocketReady };
