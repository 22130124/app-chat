import { useState } from "react";
import { toast } from "react-toastify";
import styles from "./CreateGrooup.module.scss";
import {createGroupChat} from "../services/groupService.js";


export const CreateGroup = ({ onClose, addGroup, existingGroups }) => {
    const [groupName, setGroupName] = useState("");
    const [loading, setLoading] = useState(false);

    const handleSubmit = () => {
        const trimmedName = groupName.trim();
        if (!trimmedName) {
            toast.error("Vui lòng nhập tên nhóm");
            return;
        }
        // Kiểm tra trùng tên
        if (existingGroups.some((g) => g.name === trimmedName)) {
            toast.error(`Nhóm "${trimmedName}" đã tồn tại`);
            return;
        }
        setLoading(true);
        // gọi api tạo nhóm
        createGroupChat(groupName);
        addGroup(trimmedName);
        toast.success(`Nhóm ${trimmedName} đã được tạo!`);
        setLoading(false);
        onClose();
    };


        return (
            <div className={styles.overlay}>
                <div className={styles.modal}>
                    <h3>Tạo nhóm chat</h3>
                    <input
                        type="text"
                        placeholder="Nhập tên nhóm"
                        value={groupName}
                        onChange={(e) => setGroupName(e.target.value)}
                        onKeyDown={(e) => e.key === "Enter" && handleSubmit()}
                        disabled={loading}
                    />
                    <div className={styles.actions}>
                        <button onClick={onClose} disabled={loading}>
                            Hủy
                        </button>
                        <button onClick={handleSubmit} disabled={loading}>
                            {loading ? "Đang tạo..." : "Tạo nhóm"}
                        </button>
                    </div>
                </div>
            </div>
        );

};
