import { createSlice } from "@reduxjs/toolkit";
import { setLoading } from "../../chat/slice/chatSlice";

const conversationListSlide = createSlice({
  name: "conversationList",
  initialState: {
    conversations: [], //danh sách conversations (1-1)
    users: [], //ds user (lấy từ GET_USER_LIST)
    searchQuery: "",
    loading: false,
    error: null,
  },
  reducers: {
    setConversations(state, action) {
      state.conversations = action.payload;
    },
    addConversation(state, action) {
      const existingIndex = state.conversations.findIndex(
        (conv) => conv.user === action.payload.user
      );
      if (existingIndex >= 0) {
        state.conversations[existingIndex] = action.payload;
      } else {
        state.conversations.unshift(action.payload); //thêm vào đầu
      }
    },
    //cập nhật last mes
    updateConversationLastMessage(state, action) {
      const { user, lastMessage, time } = action.payload;
      const conversation = state.conversations.find(
        (conv) => conv.user === user
      );
      if (conversation) {
        conversation.lastMessage = lastMessage;
        conversation.time = time;
        //Di chuyển lên đầu
        state.conversations = [
          conversation,
          ...state.conversations.filter((conv) => conv.user !== user),
        ];
      }
    },
    setUsers(state, action) {
      state.users = action.payload;
    },
    setSearchQuery(state, action) {
      state.searchQuery = action.payload;
    },
    setConversationLoading(state, action) {
      state.loading = action.payload;
    },
    setError(state, action) {
      state.error = action.payload;
    },
    clearConversations(state) {
      (state.conversations = []),
        (state.users = []),
        (state.searchQuery = ""),
        (state.loading = false);
      state.error = null;
    },
  },
});

export const {
  setConversations,
  addConversation,
  updateConversationLastMessage,
  setUsers,
  setSearchQuery,
  setConversationLoading,
  setError,
  clearConversations,
} = conversationListSlide.actions;

export default conversationListSlide.reducer;
