import React from 'react';
import {Routes, Route, Navigate} from 'react-router-dom';
import {LoginPage} from "../features/auth/pages/LoginPage.jsx";
import {RegisterPage} from "../features/auth/pages/RegisterPage.jsx";
import {HomePage} from "../features/home/pages/HomePage.jsx";
import {useSelector} from "react-redux";
import {ProtectedRoute} from "./ProtectedRoute.jsx";

export const AppRoutes = () => {
    const isLoggedIn = useSelector(state => state.auth.isLoggedIn);
    // Dựa vào trạng thái isLoggedIn để quyết định vào trang home hay trang login
    const defaultRedirect = <Navigate to={isLoggedIn ? "/home" : "/login"} replace />

    return (
        <Routes>
            {/* Routes công khai */}
            <Route path="/login" element={isLoggedIn ? <Navigate to="/home" replace /> : <LoginPage />} />
            <Route path="/register" element={isLoggedIn ? <Navigate to="/home" replace /> : <RegisterPage />} />

            {/* Routes yêu cầu đăng nhập */}
            <Route path="/home" element={<ProtectedRoute><HomePage /></ProtectedRoute>} />
            
            {/* Mọi route khác hoặc "/" đều redirect theo isLoggedIn */}
            <Route path="*" element={defaultRedirect} />
        </Routes>
    );
};