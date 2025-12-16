import { createSlice } from "@reduxjs/toolkit";

const initialState = {
  conversations: [],
  currentConversation: null,
  messages: {},
  loading: false,
  error: null,
};

const messageSlice = createSlice({
  name: "message",
  initialState,
  reducers: {
    setConversations: (state, action) => {
      state.conversations = action.payload;
    },
    setCurrentConversation: (state, action) => {
      state.currentConversation = action.payload;
    },
    setMessages: (state, action) => {
      const { conversationId, messages } = action.payload;
      state.messages[conversationId] = messages;
    },
    addMessage: (state, action) => {
      const { conversationId, message } = action.payload;
      if (!state.messages[conversationId]) {
        state.messages[conversationId] = [];
      }
      state.messages[conversationId].push(message);

      // Update conversation last message
      const conversation = state.conversations.find(
        (conv) => conv._id === conversationId
      );
      if (conversation) {
        conversation.lastMessage = message;
        conversation.lastMessageAt = message.createdAt;
      }
    },
    updateConversation: (state, action) => {
      const updatedConv = action.payload;
      const index = state.conversations.findIndex(
        (conv) => conv._id === updatedConv._id
      );
      if (index !== -1) {
        state.conversations[index] = updatedConv;
      } else {
        state.conversations.unshift(updatedConv);
      }
    },
    setLoading: (state, action) => {
      state.loading = action.payload;
    },
    setError: (state, action) => {
      state.error = action.payload;
    },
  },
});

export const {
  setConversations,
  setCurrentConversation,
  setMessages,
  addMessage,
  updateConversation,
  setLoading,
  setError,
} = messageSlice.actions;
export default messageSlice.reducer;
