import {AuthForm} from "../components/AuthForm.jsx";
import styles from "./LoginPage.module.scss";
import {login} from "../services/authService.js";
import {toast} from "react-toastify";
import {useNavigate} from "react-router-dom";
import {useDispatch} from "react-redux";
import {loginSuccess, logout} from "../slice/authSlice.js";
import {useEffect} from "react";

export const LoginPage = () => {
    const navigate = useNavigate();
    const dispatch = useDispatch();

    // Hàm xử lý đăng nhập
    const handleSubmit = (formData) => {
        const user = formData.user;
        const pass = formData.pass;
        login({ user, pass },
            (res) => {
                // Đây là callback nhận message từ server
                if (res.status === "success") {
                    // Lưu user và RE_LOGIN_CODE vào local storage
                    localStorage.setItem("code", res.data.RE_LOGIN_CODE);
                    localStorage.setItem("user", user);

                    // Lưu thông tin user đang đăng nhập vào store
                    dispatch(loginSuccess({user}));

                    // Điều hướng sang trang chủ
                    navigate("/home");
                } else {
                    toast.error(res.mes, {
                        toastId: "login-failed",
                    });
                }
            }
        )
    }

    return (
        <div className={styles.container}>
            <AuthForm
                type="login"
                onSubmit={handleSubmit}
            />
        </div>
    )
}