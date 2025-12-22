import styles from "./ConversationItem.module.scss";

export const ConversationItem = ({
  name,
  lastMessage,
  time,
  avatarContent,
}) => {
  return (
    <div className={styles.item}>
      <div className={styles.avatar}>
        <div className={styles.avatarContent}>{avatarContent}</div>
      </div>
      <div className={styles.info}>
        <div className={styles.nameRow}>
          <div className={styles.name}>{name}</div>
          <div className={styles.time}>{time}</div>
        </div>
        <div className={styles.lastMessage}>{lastMessage}</div>
      </div>
    </div>
  );
};
