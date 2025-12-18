import {AuthForm} from "../components/AuthForm.jsx";
import styles from "./RegisterPage.module.scss"

export const RegisterPage = () => {
    // Hàm xử lý đăng ký tài khoản
    const handleSubmit = (formData) => {
        console.log(formData);
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