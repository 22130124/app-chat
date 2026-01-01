import { getUserList } from "../../chat/services/peopleChatService";

export const fetchInitialConversations = (currentUser, cb) => {
  getUserList((response) => {
    if (response.status !== "success" || !response.data) {
      cb([]);
      return;
    }

    const users = Array.isArray(response.data)
      ? response.data
      : response.data.users || [];

    const conversations = users
      .filter((u) => {
        const name = typeof u === "string" ? u : u.user || u.name;
        return name && String(name) !== String(currentUser);
      })
      .map((u) => {
        const name = typeof u === "string" ? u : u.user || u.name;
        return {
          user: name,
          name,
          lastMessage: null,
          time: null,
          avatarContent: name.charAt(0).toUpperCase(),
        };
      });

    cb(conversations);
  });
};
