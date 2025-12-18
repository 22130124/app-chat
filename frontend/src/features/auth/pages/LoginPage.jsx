import {AuthForm} from "../components/AuthForm.jsx";
import styles from "./LoginPage.module.scss";

export const LoginPage = () => {
    // Hàm xử lý đăng nhập
    const handleSubmit = (formData) => {
        console.log(formData);
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