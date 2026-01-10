import { useSelector } from "react-redux";
import { sendGroupInvite } from "../services/peopleChatService";
import style from "./InviteUserModal.module.scss";
import React, { useState } from "react";
import { toast } from "react-toastify";

export const InviteUserModal = ({ roomName, onClose }) => {
    const conversations = useSelector(state => state.conversationList.conversations);
    const currentUser = useSelector(state => state.auth.user);

    // Lưu danh sách user đã mời để disable nút
    const [invitedUsers, setInvitedUsers] = useState([]);

    // Lấy danh sách user 1-1
    const users = conversations
        .filter(c => c.type === 0)
        .map(c => c.user)
        .filter(u => u !== currentUser);

    // Xử lý mời user
    const handleInvite = (u) => {
        sendGroupInvite({
            toUser: u,
            roomName,
            fromUser: currentUser,
        });

        // Lưu user đã mời
        setInvitedUsers(prev => [...prev, u]);

        // Hiển thị thông báo
        toast.success(`Đã gửi lời mời tới ${u}`);
    };

    return (
        <div className={style.overlay}>
            <div className={style.modal}>
                <h3>Mời vào nhóm <span>{roomName}</span></h3>

                <div className={style.list}>
                    {users.length === 0 && (
                        <p className={style.empty}>Không có người để mời</p>
                    )}

                    {users.map((u) => {
                        const invited = invitedUsers.includes(u);

                        return (
                            <div key={u} className={style.inviteRow}>
                                <div className={style.user}>
                                    <div className={style.avatar}>{u[0]}</div>
                                    <span>{u}</span>
                                </div>

                                <button
                                    className={`${style.inviteBtn} ${invited ? style.disabled : ""}`}
                                    disabled={invited}
                                    onClick={() => handleInvite(u)}
                                >
                                    {invited ? "Đã mời" : "Mời"}
                                </button>
                            </div>
                        );
                    })}
                </div>

                <button className={style.closeBtn} onClick={onClose}>
                    Đóng
                </button>
            </div>
        </div>
    );
};
