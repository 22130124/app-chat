
// để lấy danh sách các nhóm đã tham gia và lưu lại trong local khi reload lại vẫn giữ nguyên trạng thái

export const getJoinedGroups = (currentUser) => {
    if (!currentUser) return [];

    const userKey = currentUser?.username || currentUser;

    try {
        return JSON.parse(
            localStorage.getItem(`joinedGroups_${userKey}`)
        ) || [];
    } catch {
        return [];
    }
};

export const saveJoinedGroup = (currentUser, groupName) => {
    if (!currentUser || !groupName) return;

    const userKey = currentUser?.username || currentUser;
    const groups = getJoinedGroups(currentUser);

    if (!groups.includes(groupName)) {
        groups.push(groupName);
        localStorage.setItem(
            `joinedGroups_${userKey}`,
            JSON.stringify(groups)
        );
    }
};

const INVITE_GROUPS_KEY = "INVITED_GROUPS";

export const getInvitedGroups = (username) => {
    const data = JSON.parse(localStorage.getItem(INVITE_GROUPS_KEY) || "{}");
    return data[username] || [];
};

export const saveInvitedGroup = (username, groupName) => {
    const data = JSON.parse(localStorage.getItem(INVITE_GROUPS_KEY) || "{}");
    if (!data[username]) data[username] = [];
    if (!data[username].includes(groupName)) {
        data[username].push(groupName);
        localStorage.setItem(INVITE_GROUPS_KEY, JSON.stringify(data));
    }
};