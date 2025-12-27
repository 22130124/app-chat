import {sendSocketMessage} from "../../../../socket/socket.js";


export const createGroupChat = (name)=> {
    console.log("[CREATE_GROUP] start, name =", name);

    sendSocketMessage({
        action: "onchat",
        data: {
            event: "CREATE_ROOM",
            data: {
                name: name,
            },
        }
    }).catch((error) => {
        console.error("[CREATE_GROUP] sendSocketMessage error:", error);
    });
};

