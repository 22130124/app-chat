import { createSlice } from "@reduxjs/toolkit";

const initialState = {
  connected: false,
  connecting: false,
  error: null,
};

const websocketSlice = createSlice({
  name: "websocket",
  initialState,
  reducers: {
    setConnected: (state, action) => {
      state.connected = action.payload;
    },
    setConnecting: (state, action) => {
      state.connecting = action.payload;
    },
    setError: (state, action) => {
      state.error = action.payload;
    },
    clearError: (state) => {
      state.error = null;
    },
  },
});

export const { setConnected, setConnecting, setError, clearError } =
  websocketSlice.actions;
export default websocketSlice.reducer;
