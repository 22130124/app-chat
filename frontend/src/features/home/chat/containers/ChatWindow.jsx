import styles from "./ChatWindow.module.scss";
import { MoreVertical, Phone, Video } from "lucide-react";
import { MessageItem } from "../components/MessageItem.jsx";
import { MessageInput } from "../components/MessageInput.jsx";

export const ChatWindow = () => {
  return (
    <div className={styles.container}>
      <header className={styles.header}>
        <div className={styles.headerLeft}>
          <div className={styles.headerAvatar}>
            <div className={styles.avatarContent}>A</div>
          </div>
          <div className={styles.headerInfo}>
            <div className={styles.headerName}>Cuộc trò chuyện</div>
            <div className={styles.headerStatus}>Đang hoạt động</div>
          </div>
        </div>
        <div className={styles.headerActions}>
          <button className={styles.actionButton}>
            <Phone size={20} />
          </button>
          <button className={styles.actionButton}>
            <Video size={20} />
          </button>
          <button className={styles.actionButton}>
            <MoreVertical size={20} />
          </button>
        </div>
      </header>

      <section className={styles.messages}>
        <MessageItem text="Hello" time="10:30" isSent={false} />
        <MessageItem text="Chào bạn nha" time="10:32" isSent={true} />
      </section>

      <MessageInput />
    </div>
  );
};
