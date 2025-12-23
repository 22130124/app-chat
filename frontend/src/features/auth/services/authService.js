import {sendSocketMessage} from "../../../socket/socket.js";

let authCallback = null;

// Hàm xử lý gửi request đăng ký tài khoản
export const register = ({user, pass}, callback) => {
    authCallback = callback;

    sendSocketMessage({
        action: "onchat",
        data: {
            event: "REGISTER",
            data:
                {
                    user: user,
                    pass: pass
                }
        }
    });
};

export const login = ({user, pass}, callback) => {
    authCallback = callback;

    sendSocketMessage({
        action: "onchat",
        data: {
            event: "LOGIN",
            data:
                {
                    user: user,
                    pass: pass
                }
        }
    });
};

export const relogin = ({user, code}, callback) => {
    authCallback = callback;

    sendSocketMessage({
        action: "onchat",
        data: {
            event: "RE_LOGIN",
            data:
                {
                    user: user,
                    code: code
                }
        }
    });
};

export const logout = (callback) => {
    authCallback = callback;

    sendSocketMessage({
        action: "onchat",
        data: {
            event: "LOGOUT"
        }
    })
}

export const handleAuthResponse = (message) => {
    authCallback?.(message);
    authCallback = null;
};