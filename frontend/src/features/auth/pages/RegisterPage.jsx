import React from "react";
import { AuthForm } from "../components/AuthForm.jsx";
import styles from "./AuthPage.module.scss";
import { register } from "../services/authService.js";
import { toast } from "react-toastify";
import { useNavigate } from "react-router-dom";

export const RegisterPage = () => {
  const navigate = useNavigate();

  // Hàm xử lý đăng ký tài khoản
  const handleSubmit = (formData) => {
    const user = formData.user;
    const pass = formData.pass;
    register({ user, pass }, (res) => {
      // Đây là callback nhận message từ server
      if (res.status === "success") {
        toast.success("Đăng ký tài khoản thành công", {
          toastId: "register-success",
        });
        navigate("/login");
      } else {
        toast.error(res.mes, {
          toastId: "register-failed",
        });
      }
    });
  };

  return (
    <div className={styles.container}>
      <div className={styles.left}>
        <img src="/images/auth_background.png" alt="" />
      </div>
      <div className={styles.right}>
        <h1 className={styles.title}>ĐĂNG KÝ</h1>
        <AuthForm type="register" onSubmit={handleSubmit} />
      </div>
    </div>
  );
};
