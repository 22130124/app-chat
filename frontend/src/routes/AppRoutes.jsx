import React from 'react';
import {Routes, Route} from 'react-router-dom';
import {LoginPage} from "../features/auth/pages/LoginPage.jsx";
import {RegisterPage} from "../features/auth/pages/RegisterPage.jsx";
import {HomePage} from "../features/home/pages/HomePage.jsx";
import ChatPage from "../features/chat/pages/ChatPage.jsx";

export const AppRoutes = () => {
    return (
        <Routes>
            {/* Routes công khai */}
            <Route path="/login" element={<LoginPage/>}/>
            <Route path="/register" element={<RegisterPage/>}/>
            <Route path="/home" element={<HomePage/>}/>
            <Route path="/chat" element={<ChatPage/>} />

        </Routes>
    );
};