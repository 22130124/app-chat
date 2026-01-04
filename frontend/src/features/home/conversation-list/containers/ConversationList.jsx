import React from "react";
import styles from "./ConversationList.module.scss";
import {Search} from "lucide-react";
import {ConversationItem} from "../components/ConversationItem.jsx";
import {useEffect, useState} from "react";
import {useDispatch, useSelector} from "react-redux";
import {
    addConversation,
    setConversations,
    setConversationLoading,
    setSearchQuery,
    setUsers,
} from "../slice/conversationListSlice.js";
import {setCurrentChatUser} from "../../chat/slice/chatSlice.js";
import {
    checkUser,
    getUserList,
} from "../../chat/services/peopleChatService.js";
import {ClipLoader} from "react-spinners";
import {isSocketReady} from "../../../../socket/socket.js";
import {fetchInitialConversations} from "../services/conversationListService.js";

export const ConversationList = ({groups = []}) => {
    const dispatch = useDispatch();
    const {conversations, users, searchQuery, loading} = useSelector(
        (state) => state.conversationList
    );
    const {currentChatUser} = useSelector((state) => state.chat);
    const currentUser = useSelector((state) => state.auth.user);
    const [localSearchQuery, setLocalSearchQuery] = useState("");

    // Load danh sách users khi có currentUser và socket sẵn sàng
    useEffect(() => {
        if (!currentUser || conversations.length > 0 || !isSocketReady()) return;

        dispatch(setConversationLoading(true));

        fetchInitialConversations(currentUser, (data) => {
            dispatch(setConversationLoading(false));
            dispatch(setConversations(data));
        });
    }, [currentUser]);

    // Filter và sắp xếp conversations
    const filteredConversations = conversations.filter((conv) =>
        conv.name.toLowerCase().includes(searchQuery.toLowerCase())
    );

    const handleSearch = (e) => {
        const value = e.target.value;
        setLocalSearchQuery(value);
        dispatch(setSearchQuery(value));
    };

    const handleConversationClick = (user) => {
        if (currentChatUser === user) return;
        dispatch(setCurrentChatUser(user));
    };

    const handleSearchSubmit = () => {
        if (!localSearchQuery.trim()) {
            return;
        }

        // Kiểm tra user có tồn tại không
        dispatch(setConversationLoading(true));
        checkUser({user: localSearchQuery.trim()}, (response) => {
            dispatch(setConversationLoading(true));
            if (response.status === "success" && response.data) {
                const searchedUser = localSearchQuery.trim();
                // Kiểm tra xem conversation đã tồn tại chưa
                const existingConv = conversations.find(
                    (conv) => conv.user === searchedUser
                );

                if (!existingConv && searchedUser !== currentUser) {
                    // Thêm conversation mới
                    dispatch(
                        addConversation({
                            user: searchedUser,
                            name: searchedUser,
                            lastMessage: "",
                            time: "",
                            avatarContent: searchedUser.charAt(0).toUpperCase(),
                        })
                    );
                    // Chọn conversation mới
                    dispatch(setCurrentChatUser(searchedUser));
                    // Clear search query
                    setLocalSearchQuery("");
                    dispatch(setSearchQuery(""));
                } else if (existingConv) {
                    // Chọn conversation đã tồn tại
                    dispatch(setCurrentChatUser(searchedUser));
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
                {currentUser && (<span className={styles.currentUser}>Hello {currentUser}</span>)}
            </div>

            <div className={styles.searchBox}>
                <Search className={styles.searchIcon} size={18}/>
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
                    <div
                        style={{
                            display: "flex",
                            justifyContent: "center",
                            alignItems: "center",
                            padding: "20px",
                        }}
                    >
                        <ClipLoader size={30} color="#36d7b7"/>
                    </div>
                ) : filteredConversations.length === 0 ? (
                    <div
                        style={{
                            display: "flex",
                            justifyContent: "center",
                            alignItems: "center",
                            padding: "20px",
                            color: "#999",
                            fontSize: "14px",
                        }}
                    >
                        {searchQuery
                            ? "Không tìm thấy cuộc trò chuyện"
                            : "Chưa có cuộc trò chuyện nào"}
                    </div>
                ) : (
                    filteredConversations.map((conv) => (
                        <div
                            key={conv.user}
                            onClick={() => handleConversationClick(conv.user)}
                            style={{cursor: "pointer"}}
                        >
                            <ConversationItem
                                name={conv.name}
                                lastMessage={conv.lastMessage}
                                time={conv.time}
                                avatarContent={conv.avatarContent}
                                isSelected={currentChatUser === conv.user}
                            />
                        </div>
                    ))
                )}

                {/* GROUP CHAT */}
                {groups.length > 0 &&
                    groups.map((group) => (
                        <ConversationItem
                            key={`group-${group.id}`}
                            name={group.name}
                            lastMessage={group.lastMessage || "Chưa có tin nhắn"}
                            time={group.time || "Vừa xong"}
                            avatarContent={group.avatarContent}
                            isGroup
                        />
                    ))}
            </div>
        </div>
    );
};
