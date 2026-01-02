import {useState} from "react";
import {useSendMessage} from "./useSendMessage.js";



export const useSendEmoji =() => {
    const {sendMessage} = useSendMessage();
    const[selectedEmoji, setSelectedEmoji] = useState("");

    // chuyển emoji Unicode thành URL Twemoji
    const unicodeToTwemojiUrl = (emojiChar)=>{
        const codePoints = Array.from(emojiChar)
        .map((c)=>c.codePointAt(0).toString(16)).join("-");

        return `https://twemoji.maxcdn.com/v/latest/72x72/${codePoints}.png`;
    };

    const handleSelectEmoji = (emoji, setMessage) =>{
        if(!emoji || !emoji.native) return;
        const emojiChar = emoji.native;
        const emojiUrl = unicodeToTwemojiUrl(emojiChar);

        setSelectedEmoji(emojiChar);
        sendMessage(`[emoji]${emojiUrl}`);
    };
    const resetEmoji = ()=>setSelectedEmoji("");
    return {selectedEmoji, handleSelectEmoji, resetEmoji};


}