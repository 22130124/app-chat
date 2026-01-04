
import { useState } from "react";
import { fetchGiphyStickers } from "../services/uploadStickerService.js";

export const useSendSticker = (apiKey) => {
    const [stickers, setStickers] = useState([]);

    const fetchStickers = async (queries) => {
        try {
            const result = await fetchGiphyStickers(apiKey, queries);
            setStickers(result);
        } catch (err) {
            console.error("Fetch GIPHY stickers error:", err);
        }
    };

    return {
        stickers,
        fetchStickers,
    };
};