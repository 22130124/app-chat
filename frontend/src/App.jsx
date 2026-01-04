import React from "react";
import {useNavigate} from "react-router-dom";
import {AppRoutes} from "./routes/AppRoutes.jsx";
import {ToastContainer} from "react-toastify";
import {connectSocket} from "./socket/socket.js";
import {useEffect, useState} from "react";
import {handleAuthResponse, processReloginWhenAccess} from "./features/auth/services/authService.js";
import {
    handleCheckUserResponse,
    handleGetPeopleChatMesResponse,
    handleGetUserListResponse,
    handlePeopleChatMessage,
    handleSendChatResponse,
} from "./features/home/chat/services/peopleChatService.js";
import {useDispatch, useSelector} from "react-redux";
import {ClipLoader} from "react-spinners";

function App() {
    const navigate = useNavigate();
    const dispatch = useDispatch();
    const [checkingRelogin, setCheckingRelogin] = useState(true);
    const theme = useSelector(state => state.theme.mode);

    // Xử lý khi mới khởi động App
    useEffect(() => {
        // Thực hiện các hành động khi khởi động hệ thống
        const initApp = async () => {
            try {
                // Kết nối socket
                await connectSocket((data) => {
                    const event = data.event;

                    //Auth event
                    if (
                        event === "REGISTER" ||
                        event === "LOGIN" ||
                        event === "RE_LOGIN" ||
                        event === "LOGOUT"
                    ) {
                        handleAuthResponse(data);
                        return;
                    }

                    // PEOPLE CHAT - RESPONSES
                    if (event === "GET_PEOPLE_CHAT_MES") {
                        handleGetPeopleChatMesResponse(data);
                        return;
                    }

                    if (event === "CHECK_USER") {
                        handleCheckUserResponse(data);
                        return;
                    }

                    if (event === "GET_USER_LIST") {
                        handleGetUserListResponse(data);
                        return;
                    }

                    // PEOPLE CHAT - SEND CHAT
                    if (event === "SEND_CHAT") {
                        handleSendChatResponse(data); // response cho request
                        handlePeopleChatMessage(data, dispatch); // realtime push
                    }
                });
                // Xử lý re-login lần đầu
                await processReloginWhenAccess(dispatch);
                setCheckingRelogin(false);
            } catch (error) {
                console.error("Lỗi kết nối WebSocket:", error);
                navigate("/login");
            }
        };
        initApp();
    }, []);

    // Xử lý khi theme thay đổi
    useEffect(() => {
        document.documentElement.setAttribute("data-theme", theme);
    }, [theme]);

    // Hiển thị biểu tượng loading khi đang relogin
    if (checkingRelogin) {
        return (
            <div
                style={{
                    display: "flex",
                    justifyContent: "center",
                    alignItems: "center",
                    height: "100vh",
                }}
            >
                <ClipLoader size={60} color="#a073a4"/>
            </div>
        );
    }

    return (
        <div className="App">
            <AppRoutes/>
            <ToastContainer
                position="top-right"
                autoClose={5000}
                hideProgressBar={false}
                newestOnTop={false}
                closeOnClick
                pauseOnHover
            />
        </div>
    );
}

export default App;
