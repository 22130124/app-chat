import {sendSocketMessage} from "../../../../socket/socket.js";


// người tạo nhóm sẽ tự động vào nhóm khi nhóm được tạo
export const createGroupChat = async (name) => {
    console.log("[CREATE_GROUP] start, name =", name);

    try {
        await sendSocketMessage({
            action: "onchat",
            data: {
                event: "CREATE_ROOM",
                data: {name},
            },
        });

        await sendSocketMessage({
            action: "onchat",
            data: {
                event: "JOIN_ROOM",
                data: { name },
            },
        });
        console.log("CREATE_GROUP SENT TO SERVER:", name);
        console.log("JOIN_ROOM SENT TO SERVER", name)
    } catch (e) {
        console.error("CREATE_GROUP + JOIN_ROOM FAILED:", e);
    }
};

// khi người dùng không phải người tạo nhóm thì api sẽ được gọi để tham gia nhóm
export const joinGroupChat = async (name) => {
    console.log("[JOIN_GROUP] start:", name);
try {
    await sendSocketMessage({
        action: "onchat",
        data: {
            event: "JOIN_ROOM",
            data: {name},
        },
    });

    console.log("[JOIN_GROUP] sent to server:", name);
}catch(e){
    console.error("JOIN_ROOM FAILED:", e);
}
};

// lấy tin nhắn nhóm chat
export const getMessageGroup = ({name, page})=>{
    console.log("Đang lấy tin nhắn nhóm: ", name);
    sendSocketMessage({
        action: "onchat",
        data:{
            event: "GET_ROOM_CHAT_MES",
            data: {
                name, page
            },
        }
    });
};

// gửi tin nhắn nhóm
export const sendChatGroup = ({name, message})=>{
    console.log("Gửi tin nhắn nhóm");
    sendSocketMessage({
        action: "onchat",
        data: {
            event: "SEND_CHAT",
            data: {
                type: "room",
                to:name,
                mes: message,
            },
        }
    });

};

