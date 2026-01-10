import { createSlice } from "@reduxjs/toolkit";

const groupSlice = createSlice({
    name: "group",
    initialState: {
        groups: [],
        loading: false,
        error: null,
    },

    reducers: {
        // Load danh sách group từ server
        setGroups(state, action) {
            state.groups = action.payload;
        },

        // Thêm group mới (khi CREATE_ROOM)
        addGroup(state, action) {
            const exist = state.groups.find(
                (g) => g.name === action.payload.name
            );
            if (!exist) {
                state.groups.unshift({
                    ...action.payload,
                    joined: action.payload.joined ?? false,
                    lastMessage: action.payload.lastMessage ?? "",
                    time: action.payload.time ?? "",
                });
            }
        },

        // Đánh dấu user đã join group
        markGroupJoined(state, action) {
            const group = state.groups.find(
                (g) => g.name === action.payload
            );
            if (group) {
                group.joined = true;
            }
        },

        // Update last message của group (realtime)
        updateGroupLastMessage(state, action) {
            const { name, lastMessage, time } = action.payload;
            const group = state.groups.find((g) => g.name === name);
            if (group) {
                group.lastMessage = lastMessage;
                group.time = time;
            }
        },

        setGroupLoading(state, action) {
            state.loading = action.payload;
        },

        setGroupError(state, action) {
            state.error = action.payload;
        },

        clearGroups(state) {
            state.groups = [];
            state.loading = false;
            state.error = null;
        },
    },
});

export const {
    setGroups,
    addGroup,
    markGroupJoined,
    updateGroupLastMessage,
    setGroupLoading,
    setGroupError,
    clearGroups,
} = groupSlice.actions;

export default groupSlice.reducer;
