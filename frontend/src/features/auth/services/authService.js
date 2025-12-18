import { sendSocketMessage } from "../../../socket/socket.js";

let authCallback = null;

// Hàm xử lý gửi request đăng ký tài khoản
export const register = ({ username, password }, callback) => {
    authCallback = callback;

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

export const login = ({ username, password }, callback) => {
    authCallback = callback;

    sendSocketMessage({
        action: "onchat",
        data: {
            event: "LOGIN",
            data:
                {
                    user: username,
                    pass: password
                }
        }
    });
};

export const handleAuthResponse = (message) => {
    if (message.event === "REGISTER" || message.event === "LOGIN") {
        authCallback?.(message);
        authCallback = null;
    }
};