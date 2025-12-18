import { sendSocketMessage } from "../../../socket/socket.js";

let registerCallback = null;

// Hàm xử lý gửi request đăng ký tài khoản
export const register = ({ username, password }, callback) => {
    registerCallback = callback;

    sendSocketMessage({
        action: "onchat",
        data: {
            event: "REGISTER",
            data:
                {
                    user: username,
                    pass: password
                }
        }
    });
};

export const handleAuthResponse = (message) => {
    if (message.event === "REGISTER") {
        registerCallback?.(message);
        registerCallback = null;
    }
};