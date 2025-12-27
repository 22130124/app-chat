import { useNavigate } from "react-router-dom";
import { AppRoutes } from "./routes/AppRoutes.jsx";
import { toast, ToastContainer } from "react-toastify";
import { connectSocket } from "./socket/socket.js";
import { useEffect, useState } from "react";
import {
  handleAuthResponse,
  relogin,
} from "./features/auth/services/authService.js";
import {
  handlePeopleChatMessage,
  handlePeopleChatResponse,
} from "./features/home/chat/services/peopleChatService.js";
import { useDispatch } from "react-redux";
import {
  loginSuccess,
  processLogout,
} from "./features/auth/slice/authSlice.js";
import { ClipLoader } from "react-spinners";
import { clearConversations } from "./features/home/conversation-list/slice/conversationListSlice.js";
import { clearChat } from "./features/home/chat/slice/chatSlice.js";



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

  useEffect(() => {
    // Thực hiện các hành động khi khởi động hệ thống
    const initApp = async () => {
      try {
        // Kết nối socket
        await connectSocket((data) => {
          if (
            data.event === "REGISTER" ||
            data.event === "LOGIN" ||
            data.event === "RE_LOGIN" ||
            data.event === "LOGOUT"
          ) {
            handleAuthResponse(data);
          }
          handlePeopleChatResponse(data); //xử lý res chat 1-1
          handlePeopleChatMessage(data, dispatch); //xử lý messages (tin nhắn mới, cập nhật conversation)

        });
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
