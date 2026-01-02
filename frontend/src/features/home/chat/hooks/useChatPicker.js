import {useState} from 'react';

export const useChatPicker = ()=>{
    const [showPicker, setShowPicker] = useState(false);//popup tổng
    const [tab, setTab] = useState("emoji"); //emoji/sticker

    const togglePicker = (value) => {
        if (typeof value === "boolean") {
            setShowPicker(value);
        } else {
            setShowPicker(prev => !prev);
        }
    };
    const switchTab = (tabName)=>(setTab (tabName));


    return {showPicker, togglePicker, tab, switchTab};

};