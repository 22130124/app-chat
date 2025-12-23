import { useNavigate } from "react-router-dom";
import { AppRoutes } from "./routes/AppRoutes.jsx";
import { toast, ToastContainer } from "react-toastify";
import { connectSocket } from "./socket/socket.js";
import { useEffect, useState } from "react";
import {
  handleAuthResponse,
  relogin,
} from "./features/auth/services/authService.js";
import { handlePeopleChatResponse } from "./features/home/chat/services/peopleChatService.js";
import { useDispatch } from "react-redux";
import { loginSuccess, logout } from "./features/auth/slice/authSlice.js";
import { ClipLoader } from "react-spinners";
import {
  updateConversationLastMessage,
  clearConversations,
} from "./features/home/conversation-list/slice/conversationListSlice.js";
import {
  addNewMessage,
  clearChat,
} from "./features/home/chat/slice/chatSlice.js";

function App() {
  const navigate = useNavigate();
  const dispatch = useDispatch();
  const [checkingRelogin, setCheckingRelogin] = useState(true);

  // Hàm xử lý relogin
  const processRelogin = async () => {
    // Lấy thông tin user và re-login code từ local storage
    const user = localStorage.getItem("user");
    const code = localStorage.getItem("code");
    // Trường hợp có đủ thông tin cần thiết
    if (user && code) {
      return new Promise((resolve, reject) => {
        // Thực hiện relogin
        relogin({ user, code }, (res) => {
          console.log("Re-login callback:", res);
          // Nếu relogin thành công
          if (res.status === "success") {
            // Lưu lại code mới vào local storage
            localStorage.setItem("code", res.data.RE_LOGIN_CODE);
            // Lưu thông tin user đang đăng nhập vào store
            dispatch(loginSuccess({ user }));
            resolve(res);
          } else {
            // Trường hợp relogin thất bại
            // Xóa hết mọi thông tin liên quan trong local storage
            localStorage.removeItem("user");
            localStorage.removeItem("code");

            dispatch(logout());
            dispatch(clearChat());
            dispatch(clearConversations());
            reject(res);
          }
        });
      });
    } else {
      dispatch(logout());
      dispatch(clearChat());
      dispatch(clearConversations());
    }
  };

  useEffect(() => {
    // Thực hiện các hành động khi khởi động hệ thống
    const initApp = async () => {
      try {
        // Hàm callback để gọi khi socket reconnect thành công
        const handleReconnect = async () => {
          console.log("Socket đã reconnect, đang thực hiện relogin...");
          try {
            await processRelogin();
          } catch (error) {
            console.error("Lỗi khi relogin sau reconnect:", error);
          }
        };

        // Kết nối socket với callback relogin khi reconnect
        await connectSocket(
          (data) => {
            handleAuthResponse(data);
            handlePeopleChatResponse(data); //xử lý res chat 1-1
            //xử lý tin nhắn mới nhận được (SEND_CHAT res)
            if (
              data.event === "SEND_CHAT" &&
              data.status === "success" &&
              data.data?.type === "people"
            ) {
              const messageData = data.data;
              if (messageData) {
                //thêm mes vào store
                dispatch(
                  addNewMessage({
                    from: messageData.from || localStorage.getItem("user"),
                    to: messageData.to,
                    mes: messageData.mes,
                    time:
                      messageData.time ||
                      new Date().toLocaleTimeString("vi-VN", {
                        hour: "2-digit",
                        minute: "2-digit",
                      }),
                    isSent: true,
                  })
                );

                //cập nhật last mes trong conv list
                dispatch(
                  updateConversationLastMessage({
                    user: messageData.to,
                    lastMessage: messageData.mes,
                    time:
                      messageData.time ||
                      new Date().toLocaleTimeString("vi-VN", {
                        hour: "2-digit",
                        minute: "2-digit",
                      }),
                  })
                );
              }
            }

            // Xử lý tin nhắn nhận được từ người khác (có thể là event khác từ server)
            // Nếu server gửi tin nhắn mới qua event khác
            if (
              data.event === "NEW_MESSAGE" ||
              (data.event === "SEND_CHAT" &&
                data.data?.from &&
                data.data?.from !== localStorage.getItem("user"))
            ) {
              const messageData = data.data;
              if (messageData && messageData.type === "people") {
                dispatch(
                  addNewMessage({
                    from: messageData.from,
                    to: messageData.to,
                    mes: messageData.mes,
                    time:
                      messageData.time ||
                      new Date().toLocaleTimeString("vi-VN", {
                        hour: "2-digit",
                        minute: "2-digit",
                      }),
                    isSent: false,
                  })
                );

                dispatch(
                  updateConversationLastMessage({
                    user: messageData.from,
                    lastMessage: messageData.mes,
                    time:
                      messageData.time ||
                      new Date().toLocaleTimeString("vi-VN", {
                        hour: "2-digit",
                        minute: "2-digit",
                      }),
                  })
                );
              }
            }
          },
          handleReconnect // Callback để gọi relogin khi reconnect
        );
        // Xử lý re-login lần đầu
        await processRelogin();
        setCheckingRelogin(false);
      } catch (error) {
        console.error("Lỗi kết nối WebSocket:", error);
        navigate("/login");
      }
    };
    initApp();
  }, []);

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
        <ClipLoader size={60} color="#36d7b7" />
      </div>
    );
  }

  return (
    <div className="App">
      <AppRoutes />
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
