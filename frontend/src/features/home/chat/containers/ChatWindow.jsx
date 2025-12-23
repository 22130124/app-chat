import styles from "./ChatWindow.module.scss";
import { MoreVertical, Phone, Video } from "lucide-react";
import { MessageItem } from "../components/MessageItem.jsx";
import { MessageInput } from "../components/MessageInput.jsx";
import { useDispatch, useSelector } from "react-redux";
import { useEffect, useRef } from "react";
import { setError, setLoading, setMessages } from "../slice/chatSlice.js";
import { getPeopleChatMes } from "../services/peopleChatService.js";
import { ClipLoader } from "react-spinners";
import { updateConversationLastMessage } from "../../conversation-list/slice/conversationListSlice.js";

export const ChatWindow = () => {
  const dispatch = useDispatch();
  const { currentChatUser, messages, loading, error } = useSelector(
    (state) => state.chat
  );
  const currentUser = useSelector((state) => state.auth.user);
  const messagesRef = useRef(null);

  //load mes khi chọn conversation
  useEffect(() => {
    if (currentChatUser) {
      dispatch(setLoading(true));
      dispatch(setError(null));

      console.log("Đang load messages cho user:", currentChatUser);

      getPeopleChatMes({ name: currentChatUser, page: 1 }, (response) => {
        dispatch(setLoading(false));
        console.log("Response từ getPeopleChatMes:", response);

        if (response && response.status === "success") {
          // Xử lý cả trường hợp data là mảng rỗng (không có tin nhắn)
          const messageData = Array.isArray(response.data)
            ? response.data
            : response.data?.messages || [];

          console.log("Message data từ server:", messageData);
          console.log("Số lượng messages:", messageData.length);

          if (messageData.length > 0) {
            // Có tin nhắn, format và hiển thị
            const orderedMessages = [...messageData].reverse();
            const formatMes = orderedMessages.map((msg) => {
              const fromUser = msg.from || msg.sender || msg.name;
              const toUser = msg.to || msg.receiver;

              return {
                text: msg.mes || msg.message || msg.text,
                time:
                  msg.time ||
                  msg.createdAt ||
                  msg.createAt ||
                  new Date().toLocaleTimeString("vi-VN", {
                    hour: "2-digit",
                    minute: "2-digit",
                  }),
                isSent: fromUser === currentUser,
                from: fromUser,
                to: toUser,
              };
            });
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
            response.mes || response.message || "Không thể tải tin nhắn";
          dispatch(setError(errorMessage));
          dispatch(setMessages([]));
        }
      });
    } else {
      dispatch(setMessages([]));
      dispatch(setLoading(false));
    }
  }, [currentChatUser, currentUser, dispatch]);

  // Luôn kéo xuống cuối danh sách khi có tin nhắn mới
  useEffect(() => {
    if (messagesRef.current) {
      // Dùng requestAnimationFrame để chắc DOM đã render xong
      requestAnimationFrame(() => {
        messagesRef.current.scrollTop = messagesRef.current.scrollHeight;
      });
    }
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
            </div>
          </div>
          <div className={styles.headerInfo}>
            <div className={styles.headerName}>{currentChatUser}</div>
            <div className={styles.headerStatus}>Đang hoạt động</div>
          </div>
        </div>
        <div className={styles.headerActions}>
          <button className={styles.actionButton}>
            <Phone size={20} />
          </button>
          <button className={styles.actionButton}>
            <Video size={20} />
          </button>
          <button className={styles.actionButton}>
            <MoreVertical size={20} />
          </button>
        </div>
      </header>

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
              time={message.time}
              isSent={message.isSent}
            />
          ))
        )}
      </section>

      <MessageInput />
    </div>
  );
};
