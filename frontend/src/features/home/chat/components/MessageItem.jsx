import styles from "./MessageItem.module.scss";

export const MessageItem = ({ text, time, isSent }) => {
    const isImage = text?.startsWith("[image]");
    const isVideo = text?.startsWith("[video]");
    const isSticker = text?.startsWith("[sticker]");
    const imageUrl = isImage ? text.replace("[image]", "") : null;
    const videoUrl = isVideo ? text.replace("[video]", "") : null;
    const stickerUrl = isSticker ? text.replace("[sticker]", "") : null;
    return (
        <div className={styles.messageGroup}>
            <div className={`${styles.message} ${isSent ? styles.sent : styles.received}`}>
                {isImage ? (
                    <div>
                        <img
                            src={imageUrl}
                            alt="message image"
                            className={styles.messageImage}
                            loading="lazy"// khi cuộn gần tới tin nhắn có ảnh thì mới hiển thị ảnh
                        />
                        <div className={styles.messageTime}>{time}</div>
                    </div>
                ) : isVideo ? (
                    <div>
                        <video src={videoUrl} controls className={styles.messageVideo} />
                        <div className={styles.messageTime}>{time}</div>
                    </div>

                ) : isSticker ? (
                        <div>
                            <img
                                src={stickerUrl}
                                alt="sticker"
                                className={styles.messageSticker}
                            />
                            <div className={styles.messageTime}>{time}</div>
                        </div>
                    ):(

                    //chia tin nhắn thành các pahan dựa vào pattern
                    <div className={styles.messageBubble}>
                        <div className={styles.messageText}>
                            {text.split(/\[emoji\](https?:\/\/[^\s]+)/).map((part, index) => {
                                // if (part.startsWith("http")) {
                                if (part.match(/^https?:\/\/.*\.png|\.webp|\.gif$/)){
                                    return (
                                        <img
                                            key={index}
                                            src={part}
                                            alt="emoji"
                                            style={{ width: 30, height: 30, verticalAlign: "middle" }}
                                        />
                                    );
                                }
                                return <span key={index}>{part}</span>;
                            })}

                        </div>
                        <div className={styles.messageTime}>{time}</div>
                    </div>
                )}
            </div>
        </div>
    );
};
