import { combineReducers } from "@reduxjs/toolkit";

import authReducer from "../features/auth/slice/authSlice";
import chatReducer from "../features/home/chat/slice/chatSlice";
import conversationListReducer from "../features/home/conversation-list/slice/conversationListSlice";
import groupReducer from "../features/home/chat/slice/groupSlice";

const rootReducer = combineReducers({
    auth: authReducer,
    chat:chatReducer,
    conversationList:conversationListReducer,
    group: groupReducer,
});

export default rootReducer;
