import { configureStore } from "@reduxjs/toolkit";
import authSlice from "./slices/authSlice";
import userSlice from "./slices/userSlice";
import messageSlice from "./slices/messageSlice";
import websocketSlice from "./slices/websocketSlice";

export const store = configureStore({
  reducer: {
    auth: authSlice,
    user: userSlice,
    message: messageSlice,
    websocket: websocketSlice,
  },
});
