// useSendEmoji.js
import { useState } from "react";
import { useSendMessage } from "./useSendMessage.js";
import { unicodeToTwemojiUrl } from "../services/uploadEmojiService.js";

export const useSendEmoji = () => {
    const { sendMessage } = useSendMessage();
    const [selectedEmoji, setSelectedEmoji] = useState("");

    const handleSelectEmoji = (emoji) => {
        if (!emoji || !emoji.native) return;

        const emojiChar = emoji.native;
        const emojiUrl = unicodeToTwemojiUrl(emojiChar);

        setSelectedEmoji(emojiChar);
        sendMessage(`[emoji]${emojiUrl}`);
    };

    const resetEmoji = () => setSelectedEmoji("");

    return {
        selectedEmoji,
        handleSelectEmoji,
        resetEmoji,
    };
};
