import { useEffect, useState, useRef } from "react";
import { useDispatch, useSelector } from "react-redux";
import { useParams, useNavigate } from "react-router-dom";
import {
  setMessages,
  addMessage,
  setCurrentConversation,
} from "../store/slices/messageSlice";
import { wsClient } from "../utils/websocket";
import api from "../utils/api";
import NavigationSidebar from "../components/NavigationSidebar";
import ChatsList from "../components/ChatsList";

function Chat() {
  const { conversationId } = useParams();
  const dispatch = useDispatch();
  const navigate = useNavigate();
  const { user } = useSelector((state) => state.auth);
  const { conversations, messages } = useSelector((state) => state.message);
  const [messageText, setMessageText] = useState("");
  const [loading, setLoading] = useState(true);
  const messagesEndRef = useRef(null);
  const messagesContainerRef = useRef(null);

  const conversation = conversations.find((c) => c._id === conversationId);
  const conversationMessages = messages[conversationId] || [];

  useEffect(() => {
    if (conversationId) {
      loadMessages();
      dispatch(setCurrentConversation(conversation));
    }
  }, [conversationId]);

  useEffect(() => {
    scrollToBottom();
  }, [conversationMessages]);

  const loadMessages = async () => {
    try {
      setLoading(true);
      const response = await api.get(`/message/messages/${conversationId}`);
      dispatch(
        setMessages({
          conversationId,
          messages: response.data.data,
        })
      );
    } catch (error) {
      console.error("Error loading messages:", error);
    } finally {
      setLoading(false);
    }
  };

  const scrollToBottom = () => {
    messagesEndRef.current?.scrollIntoView({ behavior: "smooth" });
  };

  const handleSendMessage = async (e) => {
    e.preventDefault();
    if (!messageText.trim()) return;

    const otherParticipant = conversation?.participants?.find(
      (p) => p._id !== user._id
    );

    if (!otherParticipant) return;

    try {
      const response = await api.post("/message/send", {
        conversationId,
        to: otherParticipant._id,
        text: messageText,
        type: "Text",
      });

      // Message will be added via WebSocket, but we can also add it immediately
      dispatch(
        addMessage({
          conversationId,
          message: response.data.data,
        })
      );

      // Also send via WebSocket
      wsClient.send({
        type: "send_message",
        data: {
          conversationId,
          to: otherParticipant._id,
          text: messageText,
          type: "Text",
        },
      });

      setMessageText("");
    } catch (error) {
      console.error("Error sending message:", error);
    }
  };

  const getOtherParticipant = () => {
    if (!conversation?.participants) return null;
    return conversation.participants.find((p) => p._id !== user._id);
  };

  const otherParticipant = getOtherParticipant();

  if (!conversation) {
    return (
      <div className="flex h-screen bg-gray-100">
        <NavigationSidebar />
        <ChatsList />
        <div className="flex-1 flex items-center justify-center">
          <div className="text-center">
            <p className="text-gray-500 mb-4">Conversation not found</p>
            <button
              onClick={() => navigate("/dashboard")}
              className="btn btn-primary"
            >
              Back to Dashboard
            </button>
          </div>
        </div>
      </div>
    );
  }

  return (
    <div className="flex h-screen bg-gray-100">
      {/* Navigation Sidebar */}
      <NavigationSidebar />

      {/* Chats List */}
      <ChatsList />

      {/* Chat Content */}
      <div className="flex-1 flex flex-col bg-white">
        <div className="p-4 border-b border-gray-200 flex items-center justify-between">
          <div className="flex items-center space-x-3">
            <div className="w-10 h-10 rounded-full bg-primary-500 flex items-center justify-center text-white font-semibold">
              {otherParticipant?.firstName?.[0]}
              {otherParticipant?.lastName?.[0]}
            </div>
            <div>
              <p className="font-medium text-gray-800">
                {otherParticipant?.firstName} {otherParticipant?.lastName}
              </p>
              <p className="text-sm text-gray-500">
                {otherParticipant?.status || "Offline"}
              </p>
            </div>
          </div>
        </div>

        {/* Messages */}
        <div
          ref={messagesContainerRef}
          className="flex-1 overflow-y-auto p-4 space-y-4"
        >
          {loading ? (
            <div className="text-center text-gray-500">Loading messages...</div>
          ) : conversationMessages.length === 0 ? (
            <div className="text-center text-gray-500">
              No messages yet. Start the conversation!
            </div>
          ) : (
            conversationMessages.map((message) => {
              const isOwn = message.from._id === user._id;
              return (
                <div
                  key={message._id}
                  className={`flex ${isOwn ? "justify-end" : "justify-start"}`}
                >
                  <div
                    className={`max-w-xs lg:max-w-md px-4 py-2 rounded-lg ${
                      isOwn
                        ? "bg-primary-600 text-white"
                        : "bg-gray-200 text-gray-800"
                    }`}
                  >
                    <p className="text-sm">{message.text}</p>
                    <p
                      className={`text-xs mt-1 ${
                        isOwn ? "text-primary-100" : "text-gray-500"
                      }`}
                    >
                      {new Date(message.createdAt).toLocaleTimeString([], {
                        hour: "2-digit",
                        minute: "2-digit",
                      })}
                    </p>
                  </div>
                </div>
              );
            })
          )}
          <div ref={messagesEndRef} />
        </div>

        {/* Message Input */}
        <div className="p-4 border-t border-gray-200">
          <form onSubmit={handleSendMessage} className="flex space-x-2">
            <input
              type="text"
              value={messageText}
              onChange={(e) => setMessageText(e.target.value)}
              className="flex-1 input"
              placeholder="Type a message..."
            />
            <button
              type="submit"
              disabled={!messageText.trim()}
              className="btn btn-primary"
            >
              Send
            </button>
          </form>
        </div>
      </div>
    </div>
  );
}

export default Chat;
