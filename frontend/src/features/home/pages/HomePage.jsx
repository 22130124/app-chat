import styles from "./HomePage.module.scss";
import {ConversationList} from "../conversation-list/containers/ConversationList.jsx";
import {ChatWindow} from "../chat/containers/ChatWindow.jsx";

export const HomePage = () => {
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
