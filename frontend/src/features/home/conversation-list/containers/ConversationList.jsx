import React from "react";
import styles from "./ConversationList.module.scss";
import { Search } from "lucide-react";
import { ConversationItem } from "../components/ConversationItem.jsx";
import { useEffect, useState } from "react";
import { useDispatch, useSelector } from "react-redux";
import {
    addConversation,
    setConversations,
    setConversationLoading,
    setSearchQuery,
} from "../slice/conversationListSlice.js";
import { setCurrentChatUser } from "../../chat/slice/chatSlice.js";
import { checkUser, getPeopleChatMes, GROUP_INVITE_EVENT} from "../../chat/services/peopleChatService.js";
import { ClipLoader } from "react-spinners";
import { isSocketReady } from "../../../../socket/socket.js";
import { fetchInitialConversations } from "../services/conversationListService.js";

import { JoinGroupModal } from "../../chat/components/JoinGroupModal.jsx";
import { getJoinedGroups, saveJoinedGroup, getInvitedGroups, saveInvitedGroup } from "../../../../utils/joinGroupStorage";


export const ConversationList = ({ groups = [] }) => {
    const dispatch = useDispatch();
    const { conversations, searchQuery, loading } = useSelector(
        (state) => state.conversationList
    );
    const { currentChatUser } = useSelector((state) => state.chat);
    const currentUser = useSelector((state) => state.auth.user);
    const [localSearchQuery, setLocalSearchQuery] = useState("");


    const [joinGroupModal, setJoinGroupModal] = useState({
        visible: false,
        groupName: "",
    });

    //Load danh sách users khi có currentUser và socket sẵn sàng
    useEffect(() => {
        if (!currentUser || conversations.length > 0 || !isSocketReady()) return;
        dispatch(setConversationLoading(true));
        fetchInitialConversations(currentUser, (data) => {
            dispatch(setConversationLoading(false));

            // Lấy danh sách nhóm đã join
            const joinedGroups = getJoinedGroups(currentUser);

            // Lấy danh sách nhóm được mời nhưng chưa join
            const invitedGroups = getInvitedGroups(currentUser).filter(
                name => !joinedGroups.includes(name)
            );

            const invitedConversations = invitedGroups.map(name => ({
                name,
                type: 1,
                isJoined: false,
                lastMessage: "",
                time: "",
                conversationKey: `group:${name}`,
            }));

            // tạo các conversation object cho nhóm đã join
            const joinedConversations = joinedGroups.map(name => ({
                name,
                type: 1,
                isJoined: true,
                lastMessage: "",
                time: "",
                conversationKey: `group:${name}`,
            }));

            // Merge data từ server + joined + invited, loại bỏ trùng
            const allConversations = [
                ...data,
                ...joinedConversations.filter(j => !data.some(d => d.name === j.name)),
                ...invitedConversations.filter(i => !data.some(d => d.name === i.name))
            ];

            dispatch(setConversations(allConversations));
        });
    }, [currentUser]);



    // cập nhật trạng thái join hoạc chưa join nhóm. Do lấy từ localStorage nên nếu chạy app khác port
    // thì dư liệu nhóm đã join hoạc chưa sẽ thay đổi
    useEffect(() => {
        if (!currentUser || conversations.length === 0) return;

        const joinedGroups = getJoinedGroups(currentUser); // lấy danh sách nhóm đã tham gia

        let changed = false;

        const updated = conversations.map(conv => {
            if (conv.type === 1 && joinedGroups.includes(conv.name)) {
                if (!conv.isJoined) {
                    changed = true;
                    return { ...conv, isJoined: true };
                }
            }
            return conv;
        });

        if (changed) {
            dispatch(setConversations(updated));
        }
    }, [currentUser, conversations]);

    // xử lý mời tham gia nhóm
    useEffect(() => {
        const handler = (e) => {
            const { roomName, from } = e.detail;

            console.log("INVITED TO GROUP", roomName, "by", from);

            // Thêm nhóm vào conversations nếu chưa tồn tại
            const exists = conversations.find(conv => conv.name === roomName);
            if (!exists) {
                dispatch(addConversation({
                    name: roomName,
                    type: 1, // nhóm
                    isJoined: false, // chưa join
                    lastMessage: "",
                    time: "",
                    conversationKey: `group:${roomName}`
                }));
                saveInvitedGroup(currentUser, roomName);
            }

            // hiện modal mời join
            setJoinGroupModal({
                visible: true,
                groupName: roomName,
            });
        };

        window.addEventListener(GROUP_INVITE_EVENT, handler);

        return () => {
            window.removeEventListener(GROUP_INVITE_EVENT, handler);
        };
    }, [conversations]); // thêm conversations vào dependency



    // Filter conversations
    const filteredConversations = conversations.filter((conv) =>
        conv.name.toLowerCase().includes(searchQuery.toLowerCase())
    );

    const handleSearch = (e) => {
        const value = e.target.value;
        setLocalSearchQuery(value);
        dispatch(setSearchQuery(value));
    };

    const handleConversationClick = (conv) => {
        if (conv.type === 0) {
            if (currentChatUser === conv.user) return;
            dispatch(setCurrentChatUser(conv.user)); // dùng conv.user trực tiếp
        } else if (conv.type === 1) {
            if (conv.isJoined) {
                dispatch(setCurrentChatUser(`group:${conv.name}`));
            } else {
                setJoinGroupModal({ visible: true, groupName: conv.name });
            }
        }
    };

    const handleSearchSubmit = () => {
        if (!localSearchQuery.trim()) return;

        // Kiểm tra user có tồn tại không
        dispatch(setConversationLoading(true));
        checkUser({ user: localSearchQuery.trim() }, (response) => {
            dispatch(setConversationLoading(false));

            if (response.status === "success" && response.data) {
                const searchedUser = localSearchQuery.trim();

                const existingConv = conversations.find(
                    (conv) => conv.user === searchedUser
                );

                if (!existingConv && searchedUser !== currentUser) {
                    // Thêm conversation mới
                    dispatch(
                        addConversation({
                            user: searchedUser,
                            name: searchedUser,
                            type: 0, // people chat
                            lastMessage: "",
                            time: "",
                            avatarContent: searchedUser.charAt(0).toUpperCase(),
                            conversationKey: searchedUser, // thống nhất key
                        })
                    );

                    // Chọn conversation mới
                    dispatch(setCurrentChatUser(searchedUser));

                    // Clear search query
                    setLocalSearchQuery("");
                    dispatch(setSearchQuery(""));
                } else if (existingConv) {
                    // Chọn conversation đã tồn tại
                    dispatch(setCurrentChatUser(existingConv.conversationKey));

                    // Clear search query
                    setLocalSearchQuery("");
                    dispatch(setSearchQuery(""));
                }
            } else {
                // User không tồn tại hoặc là chính mình
                alert(
                    "Người dùng không tồn tại hoặc bạn không thể chat với chính mình"
                );
            }
        });
    };

    const handleSearchKeyPress = (e) => {
        if (e.key === "Enter") {
            handleSearchSubmit();
        }
    };

    return (
        <div className={styles.container}>
            <div className={styles.header}>
                <h2 className={styles.title}>Tin nhắn</h2>
            </div>

            <div className={styles.searchBox}>
                <Search className={styles.searchIcon} size={18} />
                <input
                    type="text"
                    placeholder="Tìm kiếm cuộc trò chuyện..."
                    className={styles.searchInput}
                    value={localSearchQuery}
                    onChange={handleSearch}
                    onKeyPress={handleSearchKeyPress}
                />
            </div>

            <div className={styles.list}>
                {/* PEOPLE CHAT */}
                {loading ? (
                    <div style={{ padding: 20, textAlign: "center" }}>
                        <ClipLoader size={30} color="#36d7b7" />
                    </div>
                ) : filteredConversations.length === 0 ? (
                    <div style={{ padding: 20, textAlign: "center", color: "#999" }}>
                        {searchQuery
                            ? "Không tìm thấy cuộc trò chuyện"
                            : "Chưa có cuộc trò chuyện nào"}
                    </div>
                ) : (
                    filteredConversations.map((conv) => {
                        const key =
                            conv.conversationKey ||
                            (conv.type === 1 ? `group:${conv.name}` : conv.user);

                        return (
                            <div
                                key={key}
                                onClick={() => handleConversationClick(conv)}
                                style={{ cursor: "pointer" }}
                            >
                                <ConversationItem
                                    name={conv.name}
                                    lastMessage={conv.lastMessage || "Chưa có tin nhắn"}
                                    time={conv.time}
                                    avatarContent={conv.type === 1 ? undefined : conv.avatarContent}
                                    isGroup={conv.type === 1}
                                    isJoined={conv.isJoined}
                                    isSelected={currentChatUser === key}
                                />
                            </div>
                        );
                    })

                )}
            </div>

            {/* JOIN GROUP MODAL */}
            {joinGroupModal.visible && (
                <JoinGroupModal
                    groupName={joinGroupModal.groupName}
                    onClose={() =>
                        setJoinGroupModal({ visible: false, groupName: "" })
                    }
                    onJoined={(groupName) => {
                        saveJoinedGroup(currentUser, groupName);

                        const updated = conversations.map((c) =>
                            c.name === groupName
                                ? { ...c, isJoined: true }
                                : c
                        );

                        dispatch(setConversations(updated));
                        dispatch(setCurrentChatUser(`group:${groupName}`));
                        setJoinGroupModal({ visible: false, groupName: "" });
                    }}
                />
            )}
        </div>
    );
};