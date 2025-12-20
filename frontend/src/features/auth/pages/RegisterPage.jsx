import {AuthForm} from "../components/AuthForm.jsx";
import styles from "./RegisterPage.module.scss"
import {logout, register} from "../services/authService.js";
import {toast} from "react-toastify";
import {useNavigate} from "react-router-dom";
import {useEffect} from "react";
import {processLogout} from "../slice/authSlice.js";
import {useDispatch, useSelector} from "react-redux";

export const RegisterPage = () => {
    const navigate = useNavigate();

    // Hàm xử lý đăng ký tài khoản
    const handleSubmit = (formData) => {
        const user = formData.user;
        const pass = formData.pass;
        register({ user, pass },
            (res) => {
                // Đây là callback nhận message từ server
                if (res.status === "success") {
                    toast.success("Đăng ký tài khoản thành công" , {
                        toastId: "register-success",
                    });
                    navigate("/login");
                } else {
                    toast.error(res.mes, {
                        toastId: "register-failed",
                    });
                }
            }
        )
    }

    return (
        <div className={styles.container}>
            <AuthForm
                type="register"
                onSubmit={handleSubmit}
            />
        </div>
    )
}