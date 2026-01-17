import React from "react";
import styles from "./ChatWindow.module.scss";
import { MoreVertical, Phone, Video } from "lucide-react";
import { MessageItem } from "../components/MessageItem.jsx";
import { MessageInput } from "../components/MessageInput.jsx";
import { useDispatch, useSelector } from "react-redux";
import { useEffect, useRef, useState } from "react";
import { setError, setLoading, setMessages } from "../slice/chatSlice.js";
import { getPeopleChatMes } from "../services/peopleChatService.js";
import { ClipLoader } from "react-spinners";
import { updateConversationLastMessage } from "../../conversation-list/slice/conversationListSlice.js";
import { formatMessage } from "../../../../utils/messageFormat.js";
import { formatMessageTime } from "../../../../utils/dateFormat.js";
import { InviteUserModal } from "../components/InviteUserModal";

export const ChatWindow = () => {
    const dispatch = useDispatch();

    const { currentChatUser, messages, loading, error } = useSelector(
        (state) => state.chat
    );
    const currentUser = useSelector((state) => state.auth.user);
    const conversations = useSelector(
        (state) => state.conversationList.conversations
    );

    const messagesRef = useRef(null);

    // State để mở / đóng Invite modal
    const [showInvite, setShowInvite] = useState(false);

    // Kiểm tra xem conversation hiện tại có phải là group hay không
    const isGroupChat = conversations.some(
        (c) => c.type === 1 && c.conversationKey === currentChatUser
    );

    //load mes khi chọn conversation
    useEffect(() => {
        if (currentChatUser) {
            dispatch(setLoading(true));
            dispatch(setError(null));

            getPeopleChatMes({ name: currentChatUser, page: 1 }, (response) => {
                dispatch(setLoading(false));

                if (response && response.status === "success") {
                    // Xử lý cả trường hợp data là mảng rỗng (không có tin nhắn)
                    const messageData = Array.isArray(response.data)
                        ? response.data
                        : response.data?.messages || [];

                    if (messageData.length > 0) {
                        const formatMes = formatMessage(
                            messageData,
                            currentUser
                        );

                        dispatch(setMessages(formatMes));
                        dispatch(setError(null));

                        // Cập nhật last message vào conversation list
                        const last = formatMes[formatMes.length - 1];
                        if (last) {
                            dispatch(
                                updateConversationLastMessage({
                                    user: currentChatUser,
                                    lastMessage: last.text,
                                    time: last.time,
                                })
                            );
                        }
                    } else {
                        console.log("Không có tin nhắn nào");
                        dispatch(setMessages([]));
                        dispatch(setError(null)); // Clear error nếu có
                    }
                } else {
                    // Xử lý cả trường hợp error từ socket
                    const errorMessage =
                        response.mes ||
                        response.message ||
                        "Không thể tải tin nhắn";
                    dispatch(setError(errorMessage));
                    dispatch(setMessages([]));
                }
            });
        } else {
            dispatch(setMessages([]));
            dispatch(setLoading(false));
        }
    }, [currentChatUser, dispatch, currentUser]);

    // Luôn kéo xuống cuối danh sách khi có tin nhắn mới
    useEffect(() => {
        if (!messagesRef.current) return;

        requestAnimationFrame(() => {
            messagesRef.current.scrollTop =
                messagesRef.current.scrollHeight;
        });
    }, [messages]);

    // Hiển thị placeholder nếu chưa chọn conversation
    if (!currentChatUser) {
        return (
            <div className={styles.container}>
                <div
                    style={{
                        display: "flex",
                        justifyContent: "center",
                        alignItems: "center",
                        height: "100%",
                        color: "#999",
                        fontSize: "16px",
                    }}
                >
                    Chọn một cuộc trò chuyện để bắt đầu
                </div>
            </div>
        );
    }

    // Lấy chữ cái đầu của tên user để hiển thị avatar
    const getAvatarContent = (name) => {
        if (!name) return "?";
        return name.charAt(0).toUpperCase();
    };

    return (
        <div className={styles.container}>
            <header className={styles.header}>
                <div className={styles.headerLeft}>
                    <div className={styles.headerAvatar}>
                        <div className={styles.avatarContent}>
                            {getAvatarContent(currentChatUser)}
                            {/*{getAvatarContent(currentConversation?.name)}*/}
                        </div>
                    </div>

                    <div className={styles.headerInfo}>
                        <div className={styles.headerName}>
                            {currentChatUser}

                            {/* Tag nhóm */}
                            {isGroupChat && (
                                <span className={styles.groupTag}>
                                    Nhóm
                                </span>
                            )}
                        </div>
                        <div className={styles.headerStatus}>
                            Đang hoạt động
                        </div>
                    </div>
                </div>

                <div className={styles.headerActions}>
                    <button className={styles.actionButton}>
                        <Phone size={20} />
                    </button>
                    <button className={styles.actionButton}>
                        <Video size={20} />
                    </button>

                    {/*
                        Nút 3 chấm:
                        - nếu là group -> mở InviteUserModal
                        - nếu là chat 1-1 -> không làm gì
                    */}
                    <button
                        className={styles.actionButton}
                        onClick={() => {
                            if (isGroupChat) {
                                setShowInvite(true);
                            }
                        }}
                    >
                        <MoreVertical size={20} />
                    </button>
                </div>
            </header>

            {/* Invite Modal (chỉ hiện khi là group) */}
            {showInvite && isGroupChat && (
                <InviteUserModal
                    roomName={currentChatUser}
                    onClose={() => setShowInvite(false)}
                />
            )}

            <section className={styles.messages} ref={messagesRef}>
                {loading ? (
                    <div
                        style={{
                            display: "flex",
                            justifyContent: "center",
                            alignItems: "center",
                            padding: "20px",
                        }}
                    >
                        <ClipLoader size={30} color="#36d7b7" />
                    </div>
                ) : error ? (
                    <div
                        style={{
                            display: "flex",
                            justifyContent: "center",
                            alignItems: "center",
                            padding: "20px",
                            color: "#ff4444",
                        }}
                    >
                        {error}
                    </div>
                ) : messages.length === 0 ? (
                    <div
                        style={{
                            display: "flex",
                            justifyContent: "center",
                            alignItems: "center",
                            padding: "20px",
                            color: "#999",
                        }}
                    >
                        Chưa có tin nhắn nào
                    </div>
                ) : (
                    messages.map((message, index) => (
                        <MessageItem
                            key={index}
                            text={message.text || message.mes}
                            time={formatMessageTime(message.time)}
                            isSent={message.isSent}
                        />
                    ))
                )}
            </section>

            <MessageInput />
        </div>
    );
};
