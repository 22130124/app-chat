import styles from "./MessageInput.module.scss";
import { Send } from "lucide-react";

export const MessageInput = ({ placeholder = "Nhập tin nhắn..." }) => {
  return (
    <footer className={styles.inputArea}>
      <div className={styles.inputWrapper}>
        <input type="text" placeholder={placeholder} className={styles.input} />
        <button className={styles.sendButton}>
          <Send size={20} />
        </button>
      </div>
    </footer>
  );
};
