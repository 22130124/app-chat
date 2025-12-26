import { combineReducers } from "@reduxjs/toolkit";

import authReducer from "../features/auth/slice/authSlice";
import chatReducer from "../features/home/chat/slice/chatSlice";
import conversationListReducer from "../features/home/conversation-list/slice/conversationListSlice";

const rootReducer = combineReducers({
    auth: authReducer,
    chat:chatReducer,
    conversationList:conversationListReducer,
});

export default rootReducer;
