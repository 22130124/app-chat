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
    setUsers,
} from "../slice/conversationListSlice.js";
import { setCurrentChatUser } from "../../chat/slice/chatSlice.js";
import { checkUser, getUserList } from "../../chat/services/peopleChatService.js";
import { ClipLoader } from "react-spinners";
import { isSocketReady } from "../../../../socket/socket.js";

export const ConversationList = ({ groups = [], addGroup }) => {
    const dispatch = useDispatch();
    const { conversations, users, searchQuery, loading } = useSelector(
        (state) => state.conversationList
    );
    const { currentChatUser } = useSelector((state) => state.chat);
    const currentUser = useSelector((state) => state.auth.user);
    const [localSearchQuery, setLocalSearchQuery] = useState("");

    // Load danh sách users khi có currentUser và socket sẵn sàng
    useEffect(() => {
        // Chỉ load nếu:
        // 1. Đã có currentUser (đã login/relogin xong)
        // 2. Socket đã sẵn sàng
        // 3. Chưa có conversations hoặc conversations rỗng
        if (!currentUser) return; // Chưa có user, chờ relogin xong
        if (!isSocketReady()) return;
        if (conversations.length > 0) return; // Đã có data, không cần load lại

        console.log("Đang load danh sách users...", {
            currentUser,
            socketReady: isSocketReady(),
        });

        dispatch(setConversationLoading(true));

        getUserList((response) => {
            dispatch(setConversationLoading(false));

            if (response.status === "success" && response.data) {
                // Giả sử response.data là mảng users hoặc có cấu trúc khác
                const usersData = Array.isArray(response.data)
                    ? response.data
                    : response.data.users || response.data.list || [];

                // Lọc bỏ user hiện tại và chỉ lấy type 0 (people chat, không phải group)
                const filteredUsers = usersData.filter((user) => {
                    const userName =
                        typeof user === "string"
                            ? user
                            : user.user || user.name || user.displayName || user;
                    return userName && String(userName) !== String(currentUser);
                });

                dispatch(setUsers(filteredUsers));

                // Tạo conversations từ danh sách users
                const initialConversations = filteredUsers.map((user) => {
                    const userName =
                        typeof user === "string" ? user : user.user || user.name;
                    const userType = typeof user === "object" ? 0 : 0; // default type 0
                    const isGroup = userType === 1;

                    return {
                        id: isGroup ? `group_${userName}` : `user_${userName}`,
                        type: isGroup ? "group" : "user",
                        user: userName,
                        name: userName,
                        lastMessage: "",
                        time: "",
                        avatarContent: userName.charAt(0).toUpperCase(),
                    };
                });

                dispatch(setConversations(initialConversations));
                console.log("Đã load danh sách users:", initialConversations.length);
            } else {
                console.error("Lỗi khi load danh sách users:", response);
                dispatch(setUsers([]));
                dispatch(setConversations([]));
            }
        });
    }, [currentUser, conversations.length, dispatch]);

    // Filter và sắp xếp conversations
    // 1. Filter dựa trên search query
    // 2. Sắp xếp: conversations đã nhắn tin (có lastMessage) ở trên, chưa nhắn tin ở dưới
    const filteredConversations = conversations
        .filter((conv) =>
            conv.name.toLowerCase().includes(searchQuery.toLowerCase())
        )
        .sort((a, b) => {
            const aHasMessage =
                a.lastMessage && a.lastMessage.trim() !== "" && a.lastMessage !== "Chưa có tin nhắn";
            const bHasMessage =
                b.lastMessage && b.lastMessage.trim() !== "" && b.lastMessage !== "Chưa có tin nhắn";

            // Ưu tiên: đã nhắn tin lên trên, chưa nhắn tin xuống dưới
            if (aHasMessage && !bHasMessage) return -1;
            if (!aHasMessage && bHasMessage) return 1;

            // Nếu cả hai đều có message: sắp xếp theo time (mới nhất lên trên)
            if (aHasMessage && bHasMessage && a.time && b.time) {
                const parseTime = (timeStr) => {
                    const match = timeStr.match(/(\d{2})\/(\d{2})\/(\d{4})/);
                    if (match) {
                        return new Date(
                            parseInt(match[3]),
                            parseInt(match[2]) - 1,
                            parseInt(match[1])
                        ).getTime();
                    }
                    return 0;
                };
                const timeA = parseTime(a.time);
                const timeB = parseTime(b.time);
                if (timeA !== timeB) return timeB - timeA; // mới nhất lên trên
            }

            // Nếu cả hai đều không có message: sắp xếp theo tên alphabetically
            if (!aHasMessage && !bHasMessage) {
                return a.name.localeCompare(b.name, "vi");
            }

            return 0;
        });

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
        if (!localSearchQuery.trim()) return;

        // Kiểm tra user có tồn tại không
        dispatch(setConversationLoading(true));
        checkUser({ user: localSearchQuery.trim() }, (response) => {
            dispatch(setConversationLoading(true));

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
                    setLocalSearchQuery("");
                    dispatch(setSearchQuery(""));
                }
            } else {
                // User không tồn tại hoặc là chính mình
                alert("Người dùng không tồn tại hoặc bạn không thể chat với chính mình");
            }
        });
    };

    const handleSearchKeyPress = (e) => {
        if (e.key === "Enter") handleSearchSubmit();
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
                            style={{ cursor: "pointer" }}
                        >
                            <ConversationItem
                                name={conv.name}
                                lastMessage={conv.lastMessage || "Chưa có tin nhắn"}
                                time={conv.time}
                                avatarContent={conv.avatarContent}
                                isGroup={true}
                                isSelected={currentChatUser === conv.user}
                            />
                        </div>
                    ))
                )}

                {/* GROUP CHAT */}
                {groups.map((group) => (
                    <div
                        key={group.user}
                        onClick={() => handleConversationClick(group.user)}
                    >
                        <ConversationItem
                            name={group.name}
                            lastMessage={group.lastMessage || "Chưa có tin nhắn"}
                            time={group.time}
                            avatarContent={group.avatarContent}
                            isSelected={currentChatUser === group.user}
                        />
                    </div>
                ))}
            </div>
        </div>
    );
};
