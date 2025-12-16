import { useEffect, useState } from "react";
import { useDispatch, useSelector } from "react-redux";
import { useNavigate } from "react-router-dom";
import { logout } from "../store/slices/authSlice";
import {
  setUsers,
  setFriends,
  setFriendRequests,
} from "../store/slices/userSlice";
import {
  setConversations,
  setCurrentConversation,
} from "../store/slices/messageSlice";
import { wsClient } from "../utils/websocket";
import api from "../utils/api";

function Sidebar() {
  const dispatch = useDispatch();
  const navigate = useNavigate();
  const { token, user } = useSelector((state) => state.auth);
  const { users, friends, friendRequests } = useSelector((state) => state.user);
  const { conversations } = useSelector((state) => state.message);
  const [activeTab, setActiveTab] = useState("chats");
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    if (!token) {
      navigate("/login");
      return;
    }

    // Connect WebSocket
    wsClient.connect(token);

    // Load initial data
    loadData();

    return () => {
      // Don't disconnect WebSocket here as it might be used by other components
    };
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

  return (
    <div className="w-80 bg-white border-r border-gray-200 flex flex-col">
      {/* Header */}
      <div className="p-4 border-b border-gray-200">
        <div className="flex items-center justify-between mb-4">
          <h1 className="text-xl font-bold text-gray-800">Chat App</h1>
          <button
            onClick={handleLogout}
            className="text-sm text-red-600 hover:text-red-700"
          >
            Logout
          </button>
        </div>
        <div className="flex items-center space-x-3">
          <div className="w-10 h-10 rounded-full bg-primary-500 flex items-center justify-center text-white font-semibold">
            {user?.firstName?.[0]}
            {user?.lastName?.[0]}
          </div>
          <div>
            <p className="font-medium text-gray-800">
              {user?.firstName} {user?.lastName}
            </p>
            <p className="text-sm text-gray-500">{user?.email}</p>
          </div>
        </div>
      </div>

      {/* Tabs */}
      <div className="flex border-b border-gray-200">
        <button
          onClick={() => setActiveTab("chats")}
          className={`flex-1 py-3 text-center font-medium ${
            activeTab === "chats"
              ? "text-primary-600 border-b-2 border-primary-600"
              : "text-gray-600 hover:text-gray-800"
          }`}
        >
          Chats
        </button>
        <button
          onClick={() => setActiveTab("friends")}
          className={`flex-1 py-3 text-center font-medium ${
            activeTab === "friends"
              ? "text-primary-600 border-b-2 border-primary-600"
              : "text-gray-600 hover:text-gray-800"
          }`}
        >
          Friends
        </button>
        <button
          onClick={() => setActiveTab("users")}
          className={`flex-1 py-3 text-center font-medium ${
            activeTab === "users"
              ? "text-primary-600 border-b-2 border-primary-600"
              : "text-gray-600 hover:text-gray-800"
          }`}
        >
          Users
        </button>
      </div>

      {/* Content */}
      <div className="flex-1 overflow-y-auto">
        {loading ? (
          <div className="p-4 text-center text-gray-500">Loading...</div>
        ) : (
          <>
            {activeTab === "chats" && (
              <div>
                {conversations.length === 0 ? (
                  <div className="p-4 text-center text-gray-500">
                    No conversations yet
                  </div>
                ) : (
                  conversations.map((conv) => {
                    const other = getOtherParticipant(conv);
                    if (!other) return null;
                    return (
                      <button
                        key={conv._id}
                        onClick={() => navigate(`/chat/${conv._id}`)}
                        className="w-full p-4 hover:bg-gray-50 border-b border-gray-100 text-left"
                      >
                        <div className="flex items-center space-x-3">
                          <div className="w-12 h-12 rounded-full bg-primary-500 flex items-center justify-center text-white font-semibold">
                            {other.firstName?.[0]}
                            {other.lastName?.[0]}
                          </div>
                          <div className="flex-1 min-w-0">
                            <p className="font-medium text-gray-800 truncate">
                              {other.firstName} {other.lastName}
                            </p>
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
                {friends.length === 0 ? (
                  <div className="p-4 text-center text-gray-500">
                    No friends yet
                  </div>
                ) : (
                  friends.map((friend) => (
                    <button
                      key={friend._id}
                      onClick={() => handleStartChat(friend._id)}
                      className="w-full p-4 hover:bg-gray-50 border-b border-gray-100 text-left"
                    >
                      <div className="flex items-center space-x-3">
                        <div className="w-12 h-12 rounded-full bg-primary-500 flex items-center justify-center text-white font-semibold">
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
                {users.length === 0 ? (
                  <div className="p-4 text-center text-gray-500">
                    No users found
                  </div>
                ) : (
                  users.map((userItem) => (
                    <div
                      key={userItem._id}
                      className="p-4 hover:bg-gray-50 border-b border-gray-100"
                    >
                      <div className="flex items-center justify-between">
                        <div className="flex items-center space-x-3">
                          <div className="w-12 h-12 rounded-full bg-primary-500 flex items-center justify-center text-white font-semibold">
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
                          className="btn btn-primary text-sm"
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

export default Sidebar;
