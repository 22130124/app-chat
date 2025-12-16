import { createSlice } from "@reduxjs/toolkit";

const initialState = {
  users: [],
  friends: [],
  friendRequests: [],
  currentUser: null,
  loading: false,
  error: null,
};

const userSlice = createSlice({
  name: "user",
  initialState,
  reducers: {
    setUsers: (state, action) => {
      state.users = action.payload;
    },
    setFriends: (state, action) => {
      state.friends = action.payload;
    },
    setFriendRequests: (state, action) => {
      state.friendRequests = action.payload;
    },
    setCurrentUser: (state, action) => {
      state.currentUser = action.payload;
    },
    addFriend: (state, action) => {
      state.friends.push(action.payload);
    },
    removeFriendRequest: (state, action) => {
      state.friendRequests = state.friendRequests.filter(
        (req) => req._id !== action.payload
      );
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
  setUsers,
  setFriends,
  setFriendRequests,
  setCurrentUser,
  addFriend,
  removeFriendRequest,
  setLoading,
  setError,
} = userSlice.actions;
export default userSlice.reducer;
