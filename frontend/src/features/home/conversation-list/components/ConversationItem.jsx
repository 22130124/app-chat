import React from "react";
import { formatMessageTime } from "../../../../utils/dateFormat";
import styles from "./ConversationItem.module.scss";
import { Users } from "lucide-react";

export const ConversationItem = ({
                                     name,
                                     lastMessage,
                                     time,
                                     avatarContent,
                                     isSelected = false,
                                     isGroup = false,
                                     isJoined = false,
                                     onClick,
                                 }) => {
    return (
        <div
            className={`${styles.item} ${isSelected ? styles.selected : ""}`}
            onClick={onClick}
            style={{ cursor: "pointer" }}
        >
            <div className={styles.avatar}>
                {isGroup ? (
                    <>
                        <Users size={18} />
                        <span
                            className={`${styles.groupStatus} ${
                                isJoined ? styles.joined : styles.notJoined
                            }`}
                        >
                            {isJoined ? "Đã tham gia" : "Chưa tham gia"}
                        </span>
                    </>
                ) : avatarContent ? (
                    <span>{avatarContent}</span>
                ) : (
                    <div className={styles.placeholder}></div>
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
