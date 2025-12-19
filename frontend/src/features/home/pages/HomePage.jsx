import styles from "./HomePage.module.scss";
import {ConversationList} from "../conversation-list/containers/ConversationList.jsx";
import {ChatWindow} from "../chat/containers/ChatWindow.jsx";
import {useEffect} from "react";
import {toast} from "react-toastify";

export const HomePage = () => {
    // Xử lý khi người truy cập trang
    useEffect(() => {
        // Thông báo hiển thị lời chào
        toast.success("Chào mừng bạn đến với App Chat" , {
            toastId: "login-success",
        });
    })

    return (
        <div className={styles.container}>
            {/* Bên trái: Lịch sử trò chuyện */}
            <div className={styles.sidebar}>
                <ConversationList />
            </div>

            {/* Bên phải: Giao diện nhắn tin */}
            <div className={styles.chatWindow}>
                <ChatWindow />
            </div>
        </div>
    );
};
