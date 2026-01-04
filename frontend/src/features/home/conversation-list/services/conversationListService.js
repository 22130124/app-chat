import { getUserList } from "../../chat/services/peopleChatService";
import { getJoinedGroups } from "../../../../utils/joinGroupStorage";

export const fetchInitialConversations = (currentUser, cb) => {
  getUserList((response) => {
    if (response.status !== "success" || !response.data) {
      cb([]);
      return;
    }

    const users = Array.isArray(response.data)
        ? response.data
        : response.data.users || [];

    const joinedGroups = getJoinedGroups(currentUser);

    const conversations = users
        .filter((u) => {
          const name = typeof u === "string" ? u : u.user || u.name;
          return name && String(name) !== String(currentUser);
        })
        .map((u) => {
          const name = typeof u === "string" ? u : u.user || u.name;

          const type = typeof u === "object" ? Number(u.type) || 0 : 0;
          const isGroup = type === 1;

          return {
            user: name,
            name,

            type,
            isGroup,
            isJoined: isGroup
                ? joinedGroups.includes(name)
                : false,

            lastMessage: null,
            time: null,
            avatarContent: isGroup ? undefined : name.charAt(0).toUpperCase(),
            conversationKey: isGroup
                ? `group:${name}`
                : `user:${name}`,
          };
        });

    cb(conversations);
  });
};
