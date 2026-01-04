import {sendSocketMessage} from "../../../socket/socket.js";
import {loginSuccess, processLogout} from "../slice/authSlice.js";
import {clearChat} from "../../home/chat/slice/chatSlice.js";
import {clearConversations} from "../../home/conversation-list/slice/conversationListSlice.js";

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

// Hàm xử lý relogin
export const processReloginWhenAccess = async (dispatch) => {
    // Lấy thông tin user và re-login code từ local storage
    const user = localStorage.getItem("user");
    const code = localStorage.getItem("code");
    // Trường hợp có đủ thông tin cần thiết
    if (user && code) {
        return new Promise((resolve, reject) => {
            // Thực hiện relogin
            relogin({user, code}, (res) => {
                console.log("Re-login callback:", res);
                // Nếu relogin thành công
                if (res.status === "success") {
                    // Lưu lại code mới vào local storage
                    localStorage.setItem("code", res.data.RE_LOGIN_CODE);
                    // Lưu thông tin user đang đăng nhập vào store
                    dispatch(loginSuccess({user}));
                    resolve(res);
                } else {
                    // Trường hợp relogin thất bại
                    // Xóa hết mọi thông tin liên quan trong local storage
                    localStorage.removeItem("user");
                    localStorage.removeItem("code");

                    dispatch(processLogout());
                    dispatch(clearChat());
                    dispatch(clearConversations());
                    reject(res);
                }
            });
        });
    } else {
        dispatch(processLogout());
        dispatch(clearChat());
        dispatch(clearConversations());
    }
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