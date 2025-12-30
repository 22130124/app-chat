import { useState } from "react";
import { toast } from "react-toastify";
import styles from "./CreateGrooup.module.scss";
import {createGroupChat} from "../services/groupService.js";
import {useDispatch, useSelector} from "react-redux";



export const CreateGroup = ({ onClose}) => {
    const [groupName, setGroupName] = useState("");
    const [loading, setLoading] = useState(false);
    const dispatch = useDispatch();
            const conversations = useSelector(
                (state) => state.conversationList.conversations
            );
        const handleSubmit = async () => {
            const trimmedName = groupName.trim();
            if (!trimmedName) {
                toast.error("Vui lòng nhập tên nhóm");
                return;
            }
            // Kiểm tra trùng tên
            if (
                conversations.some(
                (conv) =>
                    conv.name.toLowerCase() === trimmedName.toLowerCase()
            )
        ) {
            toast.error(`Nhóm "${trimmedName}" đã tồn tại`);
            return;
        }

        try {
            setLoading(true);
            // gọi api tạo nhóm
            await createGroupChat({name: trimmedName});
            console.log("[CREATE_GROUP UI] after sendSocketMessage");

            toast.success(`Nhóm ${trimmedName} đã được tạo!`);
            onClose();
        } catch (e) {
            console.log("Tao nhóm thất bại");
        } finally {
            setLoading(false);
        }
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
