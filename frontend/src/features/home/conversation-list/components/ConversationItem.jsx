import styles from "./ConversationItem.module.scss";
import { Users } from "lucide-react";

export const ConversationItem = ({
                                     name,
                                     lastMessage,
                                     time,
                                     avatarContent,
                                     isSelected = false,
                                     isGroup = false,
                                 }) => {
    return (
        <div className={`${styles.item} ${isSelected ? styles.selected : ""}`}>

            <div className={styles.avatar}>
                {isGroup ? (
                    <Users size={18} />
                ) : (
                    avatarContent
                )}
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
