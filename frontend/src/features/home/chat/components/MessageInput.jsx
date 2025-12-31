import { useRef, useState } from "react";
import styles from "./MessageInput.module.scss";
import { Send } from "lucide-react";
import { MdAddAPhoto, MdVideoLibrary } from "react-icons/md";
import { useSendMessage } from "../hooks/useSendMessage.js";
import { useSendImage } from "../hooks/useSendImage.js";
import { useSelector } from "react-redux";
import { toast } from "react-toastify";
import { useSendVideo } from "../hooks/useSendVideo.js";

export const MessageInput = ({ placeholder = "Nhập tin nhắn..." }) => {
  const [message, setMessage] = useState("");
  const fileInputRef = useRef(null);
  const { currentChatUser } = useSelector((state) => state.chat);
  const { sendMessage } = useSendMessage();
  const { sendImage } = useSendImage();
  const videoInputRef = useRef(null);
  const { sendVideo } = useSendVideo();

  const handleSend = () => {
    if (!message.trim()) return;
    if (!currentChatUser) {
      toast.error("Vui lòng chọn 1 cuộc trò chuyện");
      return;
    }

    sendMessage(message.trim());
    setMessage("");
  };

  const handleUploadAndSendImage = () => {
    fileInputRef.current.click();
  };

  const handleUploadAndSendVideo = () => {
    videoInputRef.current.click();
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
        <button
          className={styles.uploadImageButton}
          onClick={handleUploadAndSendVideo}
        >
          <MdVideoLibrary size={20} />
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
          <Send size={20} />
        </button>

        <input
          type="file"
          accept="image/*"
          ref={fileInputRef}
          style={{ display: "none" }}
          onChange={sendImage}
        />
        <input
          type="file"
          accept="video/*"
          ref={videoInputRef}
          style={{ display: "none" }}
          onChange={sendVideo}
        />
      </div>
    </footer>
  );
};
