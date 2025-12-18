import {AuthForm} from "../components/AuthForm.jsx";
import styles from "./RegisterPage.module.scss"
import {register} from "../services/authService.js";
import {toast} from "react-toastify";
import {useNavigate} from "react-router-dom";

export const RegisterPage = () => {
    const navigate = useNavigate();
    // Hàm xử lý đăng ký tài khoản
    const handleSubmit = (formData) => {
        register({ username: formData.username, password: formData.password },
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