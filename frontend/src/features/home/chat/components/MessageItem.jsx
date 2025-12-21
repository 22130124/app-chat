import styles from "./MessageItem.module.scss";

export const MessageItem = ({ text, time, isSent }) => {
  return (
    <div className={styles.messageGroup}>
      <div
        className={`${styles.message} ${isSent ? styles.sent : styles.received}`}
      >
        <div className={styles.messageBubble}>
          <div className={styles.messageText}>{text}</div>
          <div className={styles.messageTime}>{time}</div>
        </div>
      </div>
    </div>
  );
};

