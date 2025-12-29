import { formatMessageTime } from "./dateFormat";

export const formatMessage = (messageData, currentUser) => {
  return [...messageData].reverse().map((msg) => {
    const fromUser = msg.from || msg.sender || msg.name;
    const toUser = msg.to || msg.receiver;

    return {
      text: msg.mes || msg.message || msg.text,
      time: formatMessageTime(
        msg.time || msg.createdAt || msg.createAt || new Date()
      ),
      isSent: fromUser === currentUser,
      from: fromUser,
      to: toUser,
    };
  });
};
