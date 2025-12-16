import { useEffect, useState } from "react";
import { useDispatch, useSelector } from "react-redux";
import { useNavigate, useSearchParams } from "react-router-dom";
import {
  setUsers,
  setFriends,
  setFriendRequests,
} from "../store/slices/userSlice";
import {
  setConversations,
  setCurrentConversation,
} from "../store/slices/messageSlice";
import { logout } from "../store/slices/authSlice";
import { wsClient } from "../utils/websocket";
import api from "../utils/api";

function ChatsList() {
  const dispatch = useDispatch();
  const navigate = useNavigate();
  const [searchParams] = useSearchParams();
  const activeTab = searchParams.get("tab") || "chats";

  const { token, user } = useSelector((state) => state.auth);
  const { users, friends, friendRequests } = useSelector((state) => state.user);
  const { conversations } = useSelector((state) => state.message);
  const [loading, setLoading] = useState(true);
  const [searchQuery, setSearchQuery] = useState("");
  const [chatFilter, setChatFilter] = useState("all"); // "all" or "unread"

  useEffect(() => {
    if (!token) {
      navigate("/login");
      return;
    }

    // Connect WebSocket
    wsClient.connect(token);

    // Load initial data
    loadData();
  }, [token]);

  const loadData = async () => {
    try {
      setLoading(true);
      const [conversationsRes, friendsRes, requestsRes, usersRes] =
        await Promise.all([
          api.get("/message/conversations"),
          api.get("/user/get-friends"),
          api.get("/user/get-requests"),
          api.get("/user/get-users"),
        ]);

      dispatch(setConversations(conversationsRes.data.data));
      dispatch(setFriends(friendsRes.data.data));
      dispatch(setFriendRequests(requestsRes.data.data));
      dispatch(setUsers(usersRes.data.data));
    } catch (error) {
      console.error("Error loading data:", error);
    } finally {
      setLoading(false);
    }
  };

  const handleLogout = () => {
    dispatch(logout());
    wsClient.disconnect();
    navigate("/login");
  };

  const handleStartChat = async (userId) => {
    try {
      const response = await api.post("/message/conversation", { userId });
      const conversation = response.data.data;
      dispatch(setCurrentConversation(conversation));
      navigate(`/chat/${conversation._id}`);
    } catch (error) {
      console.error("Error starting chat:", error);
    }
  };

  const getOtherParticipant = (conversation) => {
    if (!conversation.participants) return null;
    return conversation.participants.find((p) => p._id !== user._id);
  };

  const filteredConversations = conversations.filter((conv) => {
    // Filter by search query
    if (searchQuery) {
      const other = getOtherParticipant(conv);
      if (!other) return false;
      const name = `${other.firstName} ${other.lastName}`.toLowerCase();
      if (!name.includes(searchQuery.toLowerCase())) return false;
    }

    // Filter by unread if needed
    if (chatFilter === "unread") {
      // Check if conversation has unread messages
      // You can add unread count logic here based on your data structure
      // For now, we'll assume conversations with lastMessage are "read"
      // You might need to add an unreadCount field to your conversation model
      return true; // Placeholder - implement based on your unread logic
    }

    return true;
  });

  const filteredFriends = friends.filter((friend) => {
    if (!searchQuery) return true;
    const name = `${friend.firstName} ${friend.lastName}`.toLowerCase();
    return name.includes(searchQuery.toLowerCase());
  });

  const filteredUsers = users.filter((userItem) => {
    if (!searchQuery) return true;
    const name = `${userItem.firstName} ${userItem.lastName}`.toLowerCase();
    return name.includes(searchQuery.toLowerCase());
  });

  return (
    <div className="w-80 bg-white border-r border-gray-200 flex flex-col">
      {/* Header */}
      <div className="p-4 border-b border-gray-200">
        <div className="flex items-center justify-between mb-4">
          <h1 className="text-2xl font-bold text-gray-900">Chats</h1>
          <div className="flex items-center space-x-2">
            {/* New Chat Icon */}
            <button className="w-10 h-10 rounded-full border-2 border-dashed border-gray-300 flex items-center justify-center text-gray-400 hover:border-blue-500 hover:text-blue-500 transition-colors">
              <svg
                xmlns="http://www.w3.org/2000/svg"
                className="h-5 w-5"
                fill="none"
                viewBox="0 0 24 24"
                stroke="currentColor"
              >
                <path
                  strokeLinecap="round"
                  strokeLinejoin="round"
                  strokeWidth={2}
                  d="M12 4v16m8-8H4"
                />
              </svg>
            </button>
            {/* Profile/More Icon */}
            <button
              onClick={handleLogout}
              className="w-10 h-10 rounded-full bg-gradient-to-br from-orange-400 to-blue-500 flex items-center justify-center text-white font-semibold text-sm"
            >
              {user?.firstName?.[0]}
              {user?.lastName?.[0]}
            </button>
          </div>
        </div>

        {/* Search Bar */}
        <div className="relative">
          <div className="absolute inset-y-0 left-0 pl-3 flex items-center pointer-events-none">
            <svg
              className="h-5 w-5 text-gray-400"
              fill="none"
              viewBox="0 0 24 24"
              stroke="currentColor"
            >
              <path
                strokeLinecap="round"
                strokeLinejoin="round"
                strokeWidth={2}
                d="M21 21l-6-6m2-5a7 7 0 11-14 0 7 7 0 0114 0z"
              />
            </svg>
          </div>
          <input
            type="text"
            value={searchQuery}
            onChange={(e) => setSearchQuery(e.target.value)}
            className="w-full pl-10 pr-10 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-transparent"
            placeholder="Search"
          />
          <button className="absolute inset-y-0 right-0 pr-3 flex items-center">
            <svg
              className="h-5 w-5 text-gray-400 hover:text-gray-600"
              fill="none"
              viewBox="0 0 24 24"
              stroke="currentColor"
            >
              <path
                strokeLinecap="round"
                strokeLinejoin="round"
                strokeWidth={2}
                d="M12 6V4m0 2a2 2 0 100 4m0-4a2 2 0 110 4m-6 8a2 2 0 100-4m0 4a2 2 0 110-4m0 4v2m0-6V4m6 6v10m6-2a2 2 0 100-4m0 4a2 2 0 110-4m0 4v2m0-6V4"
              />
            </svg>
          </button>
        </div>

        {/* Filter Tabs */}
        {activeTab === "chats" && (
          <div className="mt-3 flex space-x-4 border-b border-gray-200">
            <button
              onClick={() => setChatFilter("all")}
              className={`pb-2 text-sm font-medium transition-colors ${
                chatFilter === "all"
                  ? "text-blue-600 border-b-2 border-blue-600"
                  : "text-gray-500 hover:text-gray-700"
              }`}
            >
              Tất cả
            </button>
            <button
              onClick={() => setChatFilter("unread")}
              className={`pb-2 text-sm font-medium transition-colors ${
                chatFilter === "unread"
                  ? "text-blue-600 border-b-2 border-blue-600"
                  : "text-gray-500 hover:text-gray-700"
              }`}
            >
              Chưa đọc
            </button>
          </div>
        )}
      </div>

      {/* Content */}
      <div className="flex-1 overflow-y-auto">
        {loading ? (
          <div className="p-4 text-center text-gray-500">Loading...</div>
        ) : (
          <>
            {activeTab === "chats" && (
              <div>
                {filteredConversations.length === 0 ? (
                  <div className="p-4 text-center text-gray-500">
                    {searchQuery
                      ? "No conversations found"
                      : "No conversations yet"}
                  </div>
                ) : (
                  filteredConversations.map((conv) => {
                    const other = getOtherParticipant(conv);
                    if (!other) return null;
                    return (
                      <button
                        key={conv._id}
                        onClick={() => navigate(`/chat/${conv._id}`)}
                        className="w-full p-4 hover:bg-gray-50 border-b border-gray-100 text-left transition-colors"
                      >
                        <div className="flex items-center space-x-3">
                          <div className="w-12 h-12 rounded-full bg-gradient-to-br from-blue-400 to-purple-500 flex items-center justify-center text-white font-semibold flex-shrink-0">
                            {other.firstName?.[0]}
                            {other.lastName?.[0]}
                          </div>
                          <div className="flex-1 min-w-0">
                            <div className="flex items-center justify-between mb-1">
                              <p className="font-medium text-gray-800 truncate">
                                {other.firstName} {other.lastName}
                              </p>
                              {conv.lastMessage && (
                                <span className="text-xs text-gray-500 ml-2">
                                  {new Date(
                                    conv.lastMessage.createdAt ||
                                      conv.lastMessageAt
                                  ).toLocaleTimeString([], {
                                    hour: "2-digit",
                                    minute: "2-digit",
                                  })}
                                </span>
                              )}
                            </div>
                            <p className="text-sm text-gray-500 truncate">
                              {conv.lastMessage?.text || "No messages yet"}
                            </p>
                          </div>
                        </div>
                      </button>
                    );
                  })
                )}
              </div>
            )}

            {activeTab === "friends" && (
              <div>
                {filteredFriends.length === 0 ? (
                  <div className="p-4 text-center text-gray-500">
                    {searchQuery ? "No friends found" : "No friends yet"}
                  </div>
                ) : (
                  filteredFriends.map((friend) => (
                    <button
                      key={friend._id}
                      onClick={() => handleStartChat(friend._id)}
                      className="w-full p-4 hover:bg-gray-50 border-b border-gray-100 text-left transition-colors"
                    >
                      <div className="flex items-center space-x-3">
                        <div className="w-12 h-12 rounded-full bg-gradient-to-br from-blue-400 to-purple-500 flex items-center justify-center text-white font-semibold flex-shrink-0">
                          {friend.firstName?.[0]}
                          {friend.lastName?.[0]}
                        </div>
                        <div className="flex-1">
                          <p className="font-medium text-gray-800">
                            {friend.firstName} {friend.lastName}
                          </p>
                          <p className="text-sm text-gray-500">
                            {friend.status || "Offline"}
                          </p>
                        </div>
                      </div>
                    </button>
                  ))
                )}
              </div>
            )}

            {activeTab === "users" && (
              <div>
                {filteredUsers.length === 0 ? (
                  <div className="p-4 text-center text-gray-500">
                    {searchQuery ? "No users found" : "No users found"}
                  </div>
                ) : (
                  filteredUsers.map((userItem) => (
                    <div
                      key={userItem._id}
                      className="p-4 hover:bg-gray-50 border-b border-gray-100 transition-colors"
                    >
                      <div className="flex items-center justify-between">
                        <div className="flex items-center space-x-3">
                          <div className="w-12 h-12 rounded-full bg-gradient-to-br from-blue-400 to-purple-500 flex items-center justify-center text-white font-semibold flex-shrink-0">
                            {userItem.firstName?.[0]}
                            {userItem.lastName?.[0]}
                          </div>
                          <div>
                            <p className="font-medium text-gray-800">
                              {userItem.firstName} {userItem.lastName}
                            </p>
                            <p className="text-sm text-gray-500">
                              {userItem.email}
                            </p>
                          </div>
                        </div>
                        <button
                          onClick={() => handleStartChat(userItem._id)}
                          className="px-4 py-2 bg-blue-600 text-white rounded-lg hover:bg-blue-700 text-sm transition-colors"
                        >
                          Chat
                        </button>
                      </div>
                    </div>
                  ))
                )}
              </div>
            )}
          </>
        )}
      </div>
    </div>
  );
}

export default ChatsList;
