export const formatMessage = (messageData, currentUser) => {
  return [...messageData].reverse().map((msg) => {
    const fromUser = msg.from || msg.sender || msg.name;
    const toUser = msg.to || msg.receiver;

    const rawTime = msg.time || msg.createdAt || msg.createAt;

    return {
      text: msg.mes || msg.message || msg.text,
      time: msg.time || msg.createdAt || msg.createAt || null,
      isSent: fromUser === currentUser,
      from: fromUser,
      to: toUser,
    };
  });
};
