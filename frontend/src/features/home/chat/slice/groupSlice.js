import { createSlice } from "@reduxjs/toolkit";

const groupSlice = createSlice({
    name: "group",
    initialState: {
        groups: [],
        loading: false,
        error:null,

    },

    reducers:{
        // load group từ server
        setGroups(state, action){
            state.groups = action.payload;

        },
        //thêm group
        addGroup(state, action){
            const exist = state.groups.find(
                (g)=>g.name===action.payload.name
            );
            if(!exist){
                state.groups.unshift(action.payload);
            }
        },
        // đánh dấu đã join
        markGroupJoined(state, action){
            const group = state.groups.find(
                (g)=>g.name ===action.payload
            );
            if(group){
                group.joined = true;
            }
        },
        // update last message
        updateGroupLastMes(state, action){
            const {name, lastMes, time}= action.payload;
            const group = state.groups.find(
                (g)=>g.name===action.payload.name
            );
            if(group){
                group.lastMes = lastMes;
                group.time=time;
            }
        },
        setGroupLoading(state, action){
            state.loading = action.payload;
        },
        setGroupError(state, action){
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