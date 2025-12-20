import { createSlice } from "@reduxjs/toolkit";

const authSlice = createSlice({
    name: "auth",
    initialState: {
        user: null,
        isLoggedIn: false,
    },
    reducers: {
        loginSuccess(state, action) {
            state.user = action.payload.user;
            state.isLoggedIn = true;
        },
        processLogout(state) {
            state.user = null;
            state.isLoggedIn = false;
        },
    },
});

export const { loginSuccess, processLogout } = authSlice.actions;
export default authSlice.reducer;
