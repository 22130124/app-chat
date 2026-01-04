import React from "react";
import styles from "./HomePage.module.scss";
import { IconSidebar } from "../icon-sidebar/components/IconSidebar.jsx";
import {ConversationList} from "../conversation-list/containers/ConversationList.jsx";
import {ChatWindow} from "../chat/containers/ChatWindow.jsx";
import {useEffect} from "react";
import {useState} from "react";
import {toast} from "react-toastify";
import { CreateGroup } from "../chat/components/CreateGroup.jsx";
import { addConversation } from "../conversation-list/slice/conversationListSlice.js";
import {useDispatch, useSelector} from "react-redux";


export const HomePage = () => {

    const [showCreateGroup, setShowCreateGroup] =useState(false);
    const dispatch = useDispatch();
    const conversations = useSelector(state => state.conversationList.conversations);

        // Xử lý khi người truy cập trang
        useEffect(() => {
            // Thông báo hiển thị lời chào
            toast.success("Chào mừng bạn đến với App Chat", {
                toastId: "login-success",
            });
        }, [])

    // thêm nhóm vừa tạo lên giao diện
    const addGroup = (groupName) => {
        const nameStr = String(groupName);
        const newGroupConv = {
            id: `group_${groupName}`,
            type: 1, // nhóm
            user: nameStr,
            name: nameStr,
            lastMessage: "",
            time: "",
            avatarContent: null, // icon nhóm
            isGroup: true,
        };
        dispatch(addConversation(newGroupConv));
    };


    return (
            <div className={styles.container}>
                {/* Cột 1: Icon sidebar */}
                <div className={styles.iconSidebar}>
                    <IconSidebar onCreateGroup={() => setShowCreateGroup(true)}/>
                </div>


                {/* Cột 2: Lịch sử trò chuyện */}
                <div className={styles.conversation_list}>
                    <ConversationList />
                </div>

                {/* Cột 3: Giao diện nhắn tin */}
                <div className={styles.chatWindow}>
                    <ChatWindow/>
                </div>
                {/* Modal tạo nhóm */}
                {showCreateGroup && (
                    <CreateGroup onClose={() => setShowCreateGroup(false)}
                                 addGroup={addGroup}
                                 groups={conversations.filter(c => c.type === 1)}

                                />
                )}
            </div>
        );
    }
