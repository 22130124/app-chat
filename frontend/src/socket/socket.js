// Biến socket dùng để lưu instance WebSocket hiện tại
// Đặt ngoài scope để dùng chung cho nhiều hàm
let socket = null;

// URL WebSocket server
const SOCKET_URL = "wss://chat.longapp.site/chat/chat";

// Hàm kết nối WebSocket
// onMessageCallback: hàm callback để xử lý dữ liệu server gửi về
export const connectSocket = (onMessageCallback) => {
    // Nếu socket đã tồn tại và đang ở trạng thái OPEN thì không tạo kết nối mới nữa
    if (socket && socket.readyState === WebSocket.OPEN) {
        return socket;
    }

    // Tạo kết nối WebSocket mới
    socket = new WebSocket(SOCKET_URL);

    // Khi kết nối thành công
    socket.onopen = () => {
        console.log("Đã kết nối WebSocket");
    };

    // Khi nhận được message từ server
    socket.onmessage = (event) => {
        try {
            // Parse về JSON
            const data = JSON.parse(event.data);
            // Nếu có callback thì gọi callback
            onMessageCallback && onMessageCallback(data);
        } catch (err) {
            // Trường hợp data không phải JSON hợp lệ
            console.error("Socket message không hợp lệ", err);
        }
    };

    // Khi xảy ra lỗi trong quá trình kết nối
    socket.onerror = (error) => {
        console.error("Lỗi khi kết nối WebSocket", error);
    };

    // Khi socket bị đóng (server đóng hoặc client đóng)
    socket.onclose = () => {
        console.log("Đã ngắt kết nối WebSocket");
        socket = null;
    };

    return socket;
};

// Hàm gửi message lên server
// payload: object dữ liệu muốn gửi
export const sendSocketMessage = (payload) => {
    // Kiểm tra socket đã tồn tại và đang mở chưa
    if (!socket || socket.readyState !== WebSocket.OPEN) {
        console.error("Socket chưa được kết nối");
        return;
    }

    // Convert object sang JSON string
    socket.send(JSON.stringify(payload));
};

// Hàm ngắt kết nối WebSocket
export const disconnectSocket = () => {
    if (socket) {
        socket.close();
        socket = null;
    }
};
