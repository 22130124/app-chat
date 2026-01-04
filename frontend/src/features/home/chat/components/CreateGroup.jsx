import React from 'react';
import { useState } from "react";
import { toast } from "react-toastify";
import styles from "./CreateGrooup.module.scss";
import { createGroupChat } from "../services/groupService.js";
import { useDispatch, useSelector } from "react-redux";
import { setCurrentChatUser } from "../slice/chatSlice.js";
import { saveJoinedGroup } from "../../../../utils/joinGroupStorage";

export const CreateGroup = ({ onClose, addGroup }) => {
    const [groupName, setGroupName] = useState("");
    const [loading, setLoading] = useState(false);
    const dispatch = useDispatch();
    const currentUser = useSelector(state => state.auth.user);


    // Lấy danh sách nhóm hiện tại từ Redux
    const groupsInRedux = useSelector(state =>
        state.conversationList.conversations.filter(c => c.type === 1)
    );
    const handleSubmit = async () => {
        const trimmedName = groupName.trim();
        if (!trimmedName) {
            toast.error("Vui lòng nhập tên nhóm");
            return;
        }
        // Kiểm tra trùng tên dựa trên Redux
        const groupExists = groupsInRedux.some(
            (g) => String(g.name).toLowerCase() === trimmedName.toLowerCase()
        );
        if (groupExists) {
            toast.error(`Nhóm "${trimmedName}" đã tồn tại`);
            return;
        }
        setLoading(true);


        try {
            //Tạo nhóm trên server
            await createGroupChat(trimmedName); // gửi socket

         // đánh dấu ngay trên client
            const newGroupConv = {
                id: `group_${trimmedName}`,
                type: 1,
                user: trimmedName,
                name: trimmedName,
                lastMessage: "",
                time: "",
                avatarContent: null,
                isGroup: true,
                isJoined: true,
            };
            addGroup(newGroupConv);
            saveJoinedGroup(currentUser, trimmedName);
            dispatch(setCurrentChatUser(`group:${trimmedName}`));
            toast.success(`Nhóm ${trimmedName} đã được tạo!`);
            onClose();
        } catch (e) {
            console.error("Tạo nhóm thất bại", e);
            toast.error("Có lỗi xảy ra khi tạo nhóm");
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
