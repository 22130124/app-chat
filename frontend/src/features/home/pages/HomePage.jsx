import styles from "./HomePage.module.scss";
import { IconSidebar } from "../icon-sidebar/components/IconSidebar.jsx";
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
           {/* Cột 1: Icon sidebar */}
           <div className={styles.iconSidebar}>
                <IconSidebar/>
           </div>

            {/* Cột 2: Lịch sử trò chuyện */}
            <div className={styles.conversation_list}>
                <ConversationList />
            </div>

            {/* Cột 3: Giao diện nhắn tin */}
            <div className={styles.chatWindow}>
                <ChatWindow />
            </div>
        </div>
    );
};
