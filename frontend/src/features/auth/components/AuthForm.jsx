import {useEffect, useState} from "react";
import styles from "./AuthForm.module.scss";
import {toast} from "react-toastify";
import {useNavigate} from "react-router-dom";
import {useDispatch, useSelector} from "react-redux";
import {logout} from "../services/authService.js";
import {processLogout} from "../slice/authSlice.js";

export const AuthForm = ({ type = "login", onSubmit }) => {
    const navigate = useNavigate();

    const dispatch = useDispatch();
    const authState = useSelector(state => state.auth);
    const isLoggedIn = authState.isLoggedIn;

    // Xử lý khi người dùng truy cập vào trang đăng nhập/đăng ký
    useEffect(() => {
        // Nếu người dùng đã đăng nhập thì đăng xuất tài khoản khi truy cập vào trang này
        if (isLoggedIn) {
            logout((res) => {
                if (res.status === "success") {
                    toast.dismiss()
                    toast("Đã đăng xuất tài khoản")
                    dispatch(processLogout())
                }
            })
        }
    }, [])

    const [formData, setFormData] = useState({
        user: "",
        pass: "",
        confirmPass: ""
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
        if (type === "register" && formData.pass !== formData.confirmPass) {
            toast.error('Mật khẩu xác nhận không khớp', { toastId: 'pass-mismatch' })
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
                    name="user"
                    value={formData.user}
                    onChange={handleChange}
                    required
                />
            </div>

            <div className={styles.formGroup}>
                <label>Mật khẩu</label>
                <input
                    type="password"
                    name="pass"
                    value={formData.pass}
                    onChange={handleChange}
                    required
                />
            </div>

            {type === "register" && (
                <div className={styles.formGroup}>
                    <label>Nhập lại mật khẩu</label>
                    <input
                        type="password"
                        name="confirmPass"
                        value={formData.confirmPass}
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