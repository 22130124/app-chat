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

