import styles from "./JoinGroupModal.module.scss";
import { useState } from "react";
import { joinGroupChat } from "../services/groupService";

export const JoinGroupModal = ({ groupName, onClose, onJoined }) => {
    const [loading, setLoading] = useState(false);

    const handleJoin = async () => {
        setLoading(true);
        try {
            await joinGroupChat(groupName);
            onJoined?.(groupName);
            onClose();
        } catch (e) {
            console.error("JOIN_GROUP FAILED", e);
        } finally {
            setLoading(false);
        }
    };

    return (
        <div className={styles.overlay}>
            <div className={styles.modal}>
                <h3>Tham gia nhóm</h3>
                <p>
                    Bạn có muốn tham gia nhóm <b>{groupName}</b> không?
                </p>

                <div className={styles.actions}>
                    <button onClick={onClose} disabled={loading}>
                        Hủy
                    </button>
                    <button
                        className={styles.confirm}
                        onClick={handleJoin}
                        disabled={loading}
                    >
                        {loading ? "Đang tham gia..." : "Tham gia"}
                    </button>
                </div>
            </div>
        </div>
    );
};
