import { createSlice } from "@reduxjs/toolkit";

const chatSlice = createSlice({
  name: "chat",
  initialState: {
    // User đang chat hiện tại (cho chat 1-1)
    currentChatUser: null,
    // Danh sách tin nhắn
    messages: [],
    // Trạng thái loading
    loading: false,
    // Lỗi nếu có
    error: null,
    // Trang hiện tại khi load messages
    currentPage: 1,
    // Có thêm messages không
    hasMore: true,
  },
  reducers: {
    //set user đang chat
    setCurrentChatUser(state, action) {
      // Nếu chọn lại đúng user đang chat thì không làm gì để tránh reset state lung tung
      if (state.currentChatUser === action.payload) return;
      state.currentChatUser = action.payload;
      state.messages = [];
      state.currentPage = 1;
      state.hasMore = true;
    },
    //set message
    setMessages(state, action) {
      state.messages = action.payload;
    },
    //Dùng khi load thêm mess
    addMessages(state, action) {
      state.messages = [...action.payload, ...state.messages];
    },
    //dùng khi nhận tin mới
    addNewMessage(state, action) {
      state.messages.push(action.payload);
    },
    setLoading(state, action) {
      state.loading = action.payload;
    },
    setError(state, action) {
      state.error = action.payload;
    },
    setCurrentPage(state, action) {
      state.currentPage = action.payload;
    },
    setHasMore(state, action) {
      state.hasMore = action.payload;
    },
    //clear chat khi logout hoặc đóng chat
    clearChat(state) {
      state.currentChatUser = null;
      state.messages = [];
      state.loading = false;
      state.error = null;
      state.currentPage = 1;
      state.hasMore = true;
    },
  },
});

export const {
  setCurrentChatUser,
  setMessages,
  addMessages,
  addNewMessage,
  setLoading,
  setError,
  setCurrentPage,
  setHasMore,
  clearChat,
} = chatSlice.actions;

export default chatSlice.reducer;
