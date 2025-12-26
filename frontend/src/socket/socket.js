// Biến socket dùng để lưu instance WebSocket hiện tại
// Đặt ngoài scope để dùng chung cho nhiều hàm
let socket = null;
/**
 * messageHandler là hàm xử lý callback
 * Lý do: đôi khi gửi message, kết nối socket đã bị ngắt và cần kết nối lại trước khi gửi message này
 * Trong hàm sendSocketMessage, sẽ có cơ chế re-connect socket trước khi gửi message nếu đã bị đóng kết nối
 * Do đó, cần đặt biến messageHandler này để khi re-connect socket thì hàm xử lý callback trước đó sẽ không bị ghi đè (logic xử lý ở App.js)
 * Nếu không có biến này, sau khi re-connect socket sẽ không thể biết được callback sẽ xử lý ở đâu, xử lý như thế nào
 */
let messageHandler = null;

// URL WebSocket server
const SOCKET_URL = "wss://chat.longapp.site/chat/chat";

// Hàm kiểm tra socket đã sẵn sàng chưa
const isSocketReady = () => {
  return socket && socket.readyState === WebSocket.OPEN;
};

// Hàm kết nối WebSocket
// onMessageCallback: hàm callback để xử lý dữ liệu server gửi về
export const connectSocket = (onMessageCallback) => {
  // Nếu có truyền vào hàm onMessageCallback thì gán hàm này vào messageHandler
  if (onMessageCallback) {
    messageHandler = onMessageCallback;
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
      resolve(socket);
    };

    // Khi nhận được message từ server
    socket.onmessage = (event) => {
      try {
        // Parse về JSON
        const data = JSON.parse(event.data);
        // Nếu có callback thì gọi callback
        messageHandler?.(data);
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
    socket.onclose = () => {
      console.log("Đã ngắt kết nối WebSocket");
      socket = null;
    };
  });
};

// Hàm gửi message lên server
// payload: object dữ liệu muốn gửi
export const sendSocketMessage = async (payload) => {
  try {
    // Kiểm tra socket đã tồn tại và đang mở chưa
    // Nếu chưa thì kết nối
    if (!isSocketReady()) {
      await connectSocket();
    }

    // Kiểm tra lại socket sau khi connect (có thể vẫn chưa sẵn sàng)
    if (!isSocketReady()) {
      throw new Error("Socket chưa sẵn sàng để gửi message");
    }

    // Convert object sang JSON string
    socket.send(JSON.stringify(payload));
  } catch (error) {
    console.log("Lỗi khi gửi message: " + error);
    throw error; 
  }
};

// Hàm ngắt kết nối WebSocket
export const disconnectSocket = () => {
  if (socket) {
    socket.close();
    socket = null;
  }
};

export { isSocketReady };
