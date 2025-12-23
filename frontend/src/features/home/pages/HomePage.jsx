import styles from "./HomePage.module.scss";
import { IconSidebar } from "../icon-sidebar/components/IconSidebar.jsx";
import {ConversationList} from "../conversation-list/containers/ConversationList.jsx";
import {ChatWindow} from "../chat/containers/ChatWindow.jsx";
import {useEffect} from "react";
import {useState} from "react";
import {toast} from "react-toastify";
import { CreateGroup } from "../group/components/CreateGroup.jsx";

export const HomePage = () => {

    const [showCreateGroup, setShowCreateGroup] =useState(false);
    const [groups, setGroups] = useState([]);


    // Xử lý khi người truy cập trang
    useEffect(() => {
        // Thông báo hiển thị lời chào
        toast.success("Chào mừng bạn đến với App Chat" , {
            toastId: "login-success",
        });
    })

    // nhận group từ modal
    const handleCreateGroup =(groupName)=>{
        const newGroup = {
            id: groupName,
            name: groupName,
            lastMessage: "Nhóm vừa được tạo",
            avatarContent: groupName.charAt(0).toUpperCase(),
        };
        setGroups((prev) => [newGroup, ...prev]);
        setShowCreateGroup(false);
    };
    return (
        <div className={styles.container}>
            {/* Cột 1: Icon sidebar */}
            <div className={styles.iconSidebar}>
                <IconSidebar onCreateGroup={() => setShowCreateGroup(true)} />
            </div>


            {/* Cột 2: Lịch sử trò chuyện */}
            <div className={styles.conversation_list}>
                <ConversationList groups={groups} />
            </div>

            {/* Cột 3: Giao diện nhắn tin */}
            <div className={styles.chatWindow}>
                <ChatWindow />
            </div>

            {/* Modal tạo nhóm */}
            {showCreateGroup && (
                <CreateGroup onClose={() => setShowCreateGroup(false)}
                onCreate ={handleCreateGroup}/>
            )}
        </div>
    );
};