import {useDispatch, useSelector} from "react-redux";
import {useRef, useState} from "react";
import styles from "./MessageInput.module.scss";
import {Send} from "lucide-react";
import {toast} from "react-toastify";
import {addNewMessage} from "../slice/chatSlice";
import {updateConversationLastMessage} from "../../conversation-list/slice/conversationListSlice.js";
import {sendPeopleChat} from "../services/peopleChatService.js";
import {formatMessageTime} from "../../../../utils/dateFormat.js";
import {MdAddAPhoto} from "react-icons/md";

export const MessageInput = ({placeholder = "Nhập tin nhắn..."}) => {
    const [message, setMessage] = useState("");
    const dispatch = useDispatch();
    const {currentChatUser} = useSelector((state) => state.chat);
    const currentUser = useSelector((state) => state.auth.user);
    const fileInputRef = useRef(null);

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

        const time = formatMessageTime(new Date());

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
        sendPeopleChat({to: currentChatUser, mes: messageText}, (response) => {
            if (response.status !== "success") {
                toast.error("Ko thể gửi tin nhắn");
            }
        });
    };

    const handleUploadAndSendImage = () => {
        fileInputRef.current.click();
    }

    const handleChooseImage = (e) => {
        const file = e.target.files[0];
        if (!file) return;

        if (!file.type.startsWith("image/")) {
            toast.error("Chỉ được chọn ảnh");
            return;
        }

        console.log(file);

        // Reset để chọn lại cùng ảnh
        // Nếu không có dòng này thì lần sau chọn lại cùng ảnh sẽ không chạy được onChange nữa
        e.target.value = null;
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
                <button
                    className={styles.uploadImageButton}
                    onClick={handleUploadAndSendImage}
                >
                    <MdAddAPhoto size={20} />
                </button>
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
                    <Send size={20}/>
                </button>

                <input
                    type="file"
                    accept="image/*"
                    ref={fileInputRef}
                    style={{ display: "none" }}
                    onChange={handleChooseImage}
                />
            </div>
        </footer>
    );
};
