import styles from "./MessageItem.module.scss";

export const MessageItem = ({ text, time, isSent }) => {
  const isImage = text?.startsWith("[image]");
  const isVideo = text?.startsWith("[video]");
  const imageUrl = isImage ? text.replace("[image]", "") : null;
  const videoUrl = isVideo ? text.replace("[video]", "") : null;

  return (
    <div className={styles.messageGroup}>
      <div
        className={`${styles.message} ${
          isSent ? styles.sent : styles.received
        }`}
      >
        {isImage ? (
          <div>
            <img
              src={imageUrl}
              alt="message image"
              className={styles.messageImage}
              loading="lazy" // khi cuộn gần tới tin nhắn có ảnh thì mới hiển thị ảnh
            />
            <div className={styles.messageTime}>{time}</div>
          </div>
        ) : isVideo ? (
          <div>
            <video src={videoUrl} controls className={styles.messageVideo} />
            <div className={styles.messageTime}>{time}</div>
          </div>
        ) : (
          <div className={styles.messageBubble}>
            <div className={styles.messageText}>{text}</div>
            <div className={styles.messageTime}>{time}</div>
          </div>
        )}
      </div>
    </div>
  );
};
