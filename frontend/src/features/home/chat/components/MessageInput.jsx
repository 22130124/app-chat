import { useDispatch, useSelector } from "react-redux";
import { useState } from "react";
import styles from "./MessageInput.module.scss";
import { Send } from "lucide-react";
import { toast } from "react-toastify";
import { addNewMessage } from "../slice/chatSlice";
import { updateConversationLastMessage } from "../../conversation-list/slice/conversationListSlice.js";
import { sendPeopleChat } from "../services/peopleChatService.js";

export const MessageInput = ({ placeholder = "Nhập tin nhắn..." }) => {
  const [message, setMessage] = useState("");
  const dispatch = useDispatch();
  const { currentChatUser } = useSelector((state) => state.chat);
  const currentUser = useSelector((state) => state.auth.user);

  const handleSend = () => {
    if (!message.trim()) {
      return;
    }
    if (!currentChatUser) {
      toast.error("Vui lòng chọn 1 cuộc trò chuyện");
      return;
    }

    const messageText = message.trim();
    setMessage("");

    const time = new Date().toLocaleTimeString("vi-VN", {
      hour: "2-digit",
      minute: "2-digit",
    });

    dispatch(
      addNewMessage({
        from: currentUser,
        to: currentChatUser,
        mes: messageText,
        time,
        isSent: true,
      })
    );

    dispatch(
      updateConversationLastMessage({
        user: currentChatUser,
        lastMessage: messageText,
        time,
      })
    );

    // Gửi tin nhắn qua socket
    sendPeopleChat({ to: currentChatUser, mes: messageText }, (response) => {
      if (response.status !== "success") {
        toast.error("Ko thể gửi tin nhắn");
      }
    });
  };

  const handleKeyDown = (e) => {
    if (e.key === "Enter" && !e.shiftKey) {
      e.preventDefault();
      handleSend();
    }
  };

  return (
    <footer className={styles.inputArea}>
      <div className={styles.inputWrapper}>
        <input
          type="text"
          placeholder={
            currentChatUser ? placeholder : "Chọn một cuộc trò chuyện..."
          }
          className={styles.input}
          value={message}
          onChange={(e) => setMessage(e.target.value)}
          onKeyDown={handleKeyDown}
          disabled={!currentChatUser}
        />
        <button
          className={styles.sendButton}
          onClick={handleSend}
          disabled={!message.trim() || !currentChatUser}
        >
          <Send size={20} />
        </button>
      </div>
    </footer>
  );
};
