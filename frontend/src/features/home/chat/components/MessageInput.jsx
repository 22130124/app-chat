import React from "react";
import { useRef, useState, useEffect } from "react";
import styles from "./MessageInput.module.scss";
import { Send } from "lucide-react";
import { MdAddAPhoto, MdVideoLibrary, MdEmojiEmotions } from "react-icons/md";
import { useSendMessage } from "../hooks/useSendMessage.js";
import { useSendImage } from "../hooks/useSendImage.js";
import { useSelector } from "react-redux";
import { toast } from "react-toastify";
import { useSendVideo } from "../hooks/useSendVideo.js";
import Picker from "@emoji-mart/react";
import data from "@emoji-mart/data";
import { useChatPicker } from "../hooks/useChatPicker.js";
import { useSendEmoji } from "../hooks/useSendEmoji.js";
import { useSendSticker } from "../hooks/useSendSticker.js";

const GIPHY_API_KEY = import.meta.env.VITE_GIPHY_API_KEY;

export const MessageInput = ({ placeholder = "Nhập tin nhắn..." }) => {
  const [message, setMessage] = useState("");
  const fileInputRef = useRef(null);
  const { currentChatUser } = useSelector((state) => state.chat);
  const { sendMessage } = useSendMessage();
  const { sendImage } = useSendImage();
  const videoInputRef = useRef(null);

  const { sendVideo } = useSendVideo();
  const { showPicker, togglePicker, tab, switchTab } = useChatPicker();

  const popupRef = useRef(null);
  const buttonRef = useRef(null);
  const textareaRef = useRef(null);
  const [popupPosition, setPopupPosition] = useState({ top: 0, left: 0 });
  const { handleSelectEmoji } = useSendEmoji();
  const { stickers, fetchStickers } = useSendSticker(GIPHY_API_KEY);

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

  const handleSelectSticker = (stickerUrl) => {
    // Gửi sticker dưới dạng text với prefix [sticker]
    sendMessage(`[sticker]${stickerUrl}`);
  };

  const handleKeyDown = (e) => {
    if (e.key === "Enter" && !e.shiftKey) {
      e.preventDefault();
      handleSend();
    }
  };

  // Auto-resize textarea khi message thay đổi
  useEffect(() => {
    const ta = textareaRef.current;
    if (!ta) return;

    ta.style.height = "auto";
    const maxHeight = 120; // px
    const newHeight = Math.min(ta.scrollHeight, maxHeight);
    ta.style.height = `${newHeight}px`;
    ta.style.overflowY = ta.scrollHeight > maxHeight ? "auto" : "hidden";
  }, [message]);

  useEffect(() => {
    if (tab === "sticker")
      fetchStickers(["funny", "cute", "love", "sad", "lovely", "hello"]); //load sticker khi mở tab
  }, [tab]);

  // Tính vị trí popup khi mở
  useEffect(() => {
    if (showPicker && buttonRef.current) {
      const button = buttonRef.current;
      const rect = buttonRef.current.getBoundingClientRect();
      setPopupPosition({
        top: button.offsetTop - 380, // 250px popup + 10px margin
        left: button.offsetLeft - 30,
      });
    }
  }, [showPicker]);

  // Click ngoài popup thì ẩn popup đi
  useEffect(() => {
    const handleClickOutside = (event) => {
      if (
        showPicker &&
        popupRef.current &&
        !popupRef.current.contains(event.target) &&
        buttonRef.current &&
        !buttonRef.current.contains(event.target)
      ) {
        togglePicker(false); // ẩn popup
      }
    };
    document.addEventListener("mousedown", handleClickOutside);
    return () => document.removeEventListener("mousedown", handleClickOutside);
  }, [showPicker, togglePicker]);

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

        {/* Nút Emoji/Sticker */}
        <button
          className={styles.chatPickerButton}
          onClick={togglePicker}
          ref={buttonRef}
        >
          <MdEmojiEmotions size={20} />
        </button>

        {/* Popup Emoji/Sticker */}
        {showPicker && (
          <div
            className={styles.chatPickerPopup}
            ref={popupRef}
            style={{
              position: "absolute",
              top: popupPosition.top,
              left: popupPosition.left,
            }}
          >
            <div className={styles.tabButtons}>
              <button
                className={tab === "emoji" ? styles.activeTab : ""}
                onClick={() => switchTab("emoji")}
              >
                Emoji
              </button>
              <button
                className={tab === "sticker" ? styles.activeTab : ""}
                onClick={() => switchTab("sticker")}
              >
                Sticker
              </button>
            </div>

            <div className={styles.tabContent}>
              {tab === "emoji" && (
                <Picker
                  data={data}
                  onEmojiSelect={(emoji) =>
                    handleSelectEmoji(emoji, setMessage)
                  }
                  theme="light"
                  style={{ width: "100%", height: "250px" }}
                />
              )}
              {tab === "sticker" && (
                <div className={styles.stickerGrid}>
                  {stickers.map((sticker) => (
                    <img
                      key={sticker.uid}
                      src={sticker.url}
                      alt="sticker"
                      onClick={() => handleSelectSticker(sticker.url)}
                    />
                  ))}
                </div>
              )}
            </div>
          </div>
        )}

        <textarea
          placeholder={
            currentChatUser ? placeholder : "Chọn một cuộc trò chuyện..."
          }
          className={`${styles.input} ${styles.textarea}`}
          value={message}
          onChange={(e) => setMessage(e.target.value)}
          onKeyDown={handleKeyDown}
          rows={1}
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
