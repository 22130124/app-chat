import { useState } from "react";
import styles from "./AuthForm.module.scss";
import {toast} from "react-toastify";
import {useNavigate} from "react-router-dom";

export const AuthForm = ({ type = "login", onSubmit }) => {
    const navigate = useNavigate();

    const [formData, setFormData] = useState({
        username: "",
        password: "",
        confirmPassword: ""
    });

    // Hàm xử lý khi người dùng nhập thông tin
    const handleChange = (e) => {
        const { name, value } = e.target;
        setFormData((prev) => (
            {
                ...prev,
                [name]: value
            }
            ));
    };

    // Hàm xử lý nhấn submit
    const handleSubmit = (e) => {
        e.preventDefault();

        // Nếu mật khẩu nhập lại không khớp thì hiển thị thông báo và không gửi form
        if (type === "register" && formData.password !== formData.confirmPassword) {
            toast.error('Mật khẩu xác nhận không khớp', { toastId: 'password-mismatch' })
            return;
        }

        onSubmit?.(formData);
    };

    const handleSwitchPage = () => {
        if (type === "register") {
            navigate("/login");
        } else if (type === "login") {
            navigate("/register");
        }
    }

    return (
        <form className={styles.form} onSubmit={handleSubmit}>
            <div className={styles.formGroup}>
                <label>Tên đăng nhập</label>
                <input
                    name="username"
                    value={formData.username}
                    onChange={handleChange}
                    required
                />
            </div>

            <div className={styles.formGroup}>
                <label>Mật khẩu</label>
                <input
                    type="password"
                    name="password"
                    value={formData.password}
                    onChange={handleChange}
                    required
                />
            </div>

            {type === "register" && (
                <div className={styles.formGroup}>
                    <label>Nhập lại mật khẩu</label>
                    <input
                        type="password"
                        name="confirmPassword"
                        value={formData.confirmPassword}
                        onChange={handleChange}
                        required
                    />
                </div>
            )}

            <button className={styles.submitBtn} type="submit">
                {type === "register" ? "Đăng ký" : "Đăng nhập"}
            </button>

            <button className={styles.switchPageBtn} onClick={handleSwitchPage}>
                {type === "register" ? "Quay về đăng nhập" : "Đăng ký tài khoản mới"}
            </button>
        </form>
    );
};