import {useNavigate} from "react-router-dom";
import {AppRoutes} from "./routes/AppRoutes.jsx";
import {toast, ToastContainer} from "react-toastify";
import {connectSocket} from "./socket/socket.js";
import {useEffect} from "react";
import {handleAuthResponse, relogin} from "./features/auth/services/authService.js";
import {useDispatch} from "react-redux";
import {loginSuccess, logout} from "./features/auth/slice/authSlice.js";

function App() {
    const navigate = useNavigate();
    const dispatch = useDispatch();

    // Hàm xử lý relogin
    const processRelogin = async () => {
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
                        // Thông báo
                        toast.success("Chào mừng bạn đến với App Chat" , {
                            toastId: "login-success",
                        });
                        // Điều hướng về trang chủ
                        navigate("/home");
                        resolve(res);
                    } else { // Trường hợp relogin thất bại
                        // Xóa hết mọi thông tin liên quan trong local storage
                        localStorage.removeItem("user");
                        localStorage.removeItem("code");
                        // Cập nhật store
                        dispatch(logout());
                        // Điều hướng về trang login
                        navigate("/login");
                        reject(res);
                    }
                })
            })
        } else {
            navigate("/login");
            return Promise.reject("Không có đủ thông tin user và re-login code")
        }
    }

    useEffect(() => {
        // Thực hiện các hành động khi khởi động hệ thống
        const initApp = async () => {
            try {
                // Kết nối socket
                await connectSocket((data) => {
                    handleAuthResponse(data);
                });
                // Xử lý re-login
                await processRelogin();
            } catch (error) {
                console.error("Lỗi kết nối WebSocket:", error);
                navigate("/login");
            }
        }
        initApp();
    }, []);

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