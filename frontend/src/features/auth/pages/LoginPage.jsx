import {AuthForm} from "../components/AuthForm.jsx";
import styles from "./LoginPage.module.scss";
import {login} from "../services/authService.js";
import {toast} from "react-toastify";
import {useNavigate} from "react-router-dom";

export const LoginPage = () => {
    const navigate = useNavigate();
    // Hàm xử lý đăng nhập
    const handleSubmit = (formData) => {
        const user = formData.user;
        const pass = formData.pass;
        login({ user, pass },
            (res) => {
                // Đây là callback nhận message từ server
                if (res.status === "success") {
                    toast.success("Đăng nhập thành công" , {
                        toastId: "login-success",
                    });
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