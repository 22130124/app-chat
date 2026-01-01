import { useDispatch, useSelector } from "react-redux";
import { addNewMessage } from "../slice/chatSlice";
import { updateConversationLastMessage } from "../../conversation-list/slice/conversationListSlice";
import { sendPeopleChat } from "../services/peopleChatService";
import { formatMessageTime } from "../../../../utils/dateFormat";
import { toast } from "react-toastify";

export const useSendMessage = () => {
  const dispatch = useDispatch();
  const { currentChatUser } = useSelector((state) => state.chat);
  const currentUser = useSelector((state) => state.auth.user);

  const sendMessage = (text) => {
    if (!currentChatUser || !text.trim()) return;

    const time = new Date().toISOString();

    // optimistic UI
    dispatch(
      addNewMessage({
        from: currentUser,
        to: currentChatUser,
        mes: text,
        time,
        isSent: true,
      })
    );

    dispatch(
      updateConversationLastMessage({
        user: currentChatUser,
        lastMessage: text,
        time,
      })
    );

    // Gửi tin nhắn qua socket
    sendPeopleChat({ to: currentChatUser, mes: text }, (res) => {
      if (res.status !== "success") {
        toast.error("Không thể gửi tin nhắn");
      }
    });
  };

  return { sendMessage };
};
