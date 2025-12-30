import styles from "./HomePage.module.scss";
import { IconSidebar } from "../icon-sidebar/components/IconSidebar.jsx";
import {ConversationList} from "../conversation-list/containers/ConversationList.jsx";
import {ChatWindow} from "../chat/containers/ChatWindow.jsx";
import {useEffect} from "react";
import {useState} from "react";
import {toast} from "react-toastify";
import { CreateGroup } from "../chat/components/CreateGroup.jsx";
import { useDispatch } from "react-redux";
import { addConversation } from "../conversation-list/slice/conversationListSlice.js";

export const HomePage = () => {

    const [showCreateGroup, setShowCreateGroup] =useState(false);
    const [groups, setGroups] = useState([]);
    const dispatch = useDispatch();

        // Xử lý khi người truy cập trang
        useEffect(() => {
            // Thông báo hiển thị lời chào
            toast.success("Chào mừng bạn đến với App Chat", {
                toastId: "login-success",
            });
        }, [])

    // thêm nhóm vừa tạo lên giao diện
    // const addGroup = (groupName) => {
    //     if (groups.some(g => g.name === groupName)) return;
    //
    //     setGroups(prev => [
    //         ...prev,
    //         {
    //             name: groupName,
    //             type: "group",
    //             lastMessage: "",
    //             time: "",
    //         },
    //     ]);
    // };

    const addGroup = (groupName) => {
        dispatch(
            addConversation({
                id: `group_${groupName}`,
                user: groupName,
                name: groupName,
                type: "group",
                joined: true,
                lastMessage: "",
                time: "",
            })
        );
    };

    return (
            <div className={styles.container}>
                {/* Cột 1: Icon sidebar */}
                <div className={styles.iconSidebar}>
                    <IconSidebar onCreateGroup={() => setShowCreateGroup(true)}/>
                </div>


                {/* Cột 2: Lịch sử trò chuyện */}
                <div className={styles.conversation_list}>
                    <ConversationList groups={groups}/>
                </div>

                {/* Cột 3: Giao diện nhắn tin */}
                <div className={styles.chatWindow}>
                    <ChatWindow/>
                </div>
                {/* Modal tạo nhóm */}
                {showCreateGroup && (
                    <CreateGroup onClose={() => setShowCreateGroup(false)}
                                 addGroup={addGroup}
                                />
                )}
            </div>
        );
    }