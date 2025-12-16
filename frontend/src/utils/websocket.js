import { store } from "../store/store";
import {
  setConnected,
  setConnecting,
  setError,
} from "../store/slices/websocketSlice";
import {
  addMessage,
  updateConversation,
  setConversations,
} from "../store/slices/messageSlice";
import {
  addFriend,
  removeFriendRequest,
  setFriendRequests,
} from "../store/slices/userSlice";

class WebSocketClient {
  constructor() {
    this.ws = null;
    this.reconnectAttempts = 0;
    this.maxReconnectAttempts = 5;
    this.reconnectDelay = 3000;
  }

  connect(token) {
    if (this.ws?.readyState === WebSocket.OPEN) {
      return;
    }

    store.dispatch(setConnecting(true));

    const wsUrl = import.meta.env.VITE_WS_URL || "ws://localhost:8000/ws";
    this.ws = new WebSocket(`${wsUrl}?token=${token}`);

    this.ws.onopen = () => {
      console.log("WebSocket connected");
      store.dispatch(setConnected(true));
      store.dispatch(setConnecting(false));
      this.reconnectAttempts = 0;
    };

    this.ws.onmessage = (event) => {
      try {
        const message = JSON.parse(event.data);
        this.handleMessage(message);
      } catch (error) {
        console.error("Error parsing WebSocket message:", error);
      }
    };

    this.ws.onerror = (error) => {
      console.error("WebSocket error:", error);
      store.dispatch(setError("WebSocket connection error"));
      store.dispatch(setConnecting(false));
    };

    this.ws.onclose = () => {
      console.log("WebSocket disconnected");
      store.dispatch(setConnected(false));
      store.dispatch(setConnecting(false));
      this.attemptReconnect(token);
    };
  }

  attemptReconnect(token) {
    if (this.reconnectAttempts < this.maxReconnectAttempts) {
      this.reconnectAttempts++;
      setTimeout(() => {
        console.log(
          `Attempting to reconnect... (${this.reconnectAttempts}/${this.maxReconnectAttempts})`
        );
        this.connect(token);
      }, this.reconnectDelay);
    }
  }

  handleMessage(message) {
    const { type, data } = message;

    switch (type) {
      case "connection":
        console.log("Connection confirmed:", data);
        break;

      case "new_message":
        store.dispatch(
          addMessage({
            conversationId: data.conversation_id,
            message: data,
          })
        );
        break;

      case "conversation_started":
        store.dispatch(updateConversation(data));
        break;

      case "conversations":
        store.dispatch(setConversations(data));
        break;

      case "new_friend_request":
        // Handle new friend request notification
        break;

      case "friend_request_accepted":
        store.dispatch(addFriend(data.user));
        break;

      case "audio_call_notification":
      case "video_call_notification":
        // Handle call notifications
        break;

      default:
        console.log("Unknown message type:", type);
    }
  }

  send(message) {
    if (this.ws?.readyState === WebSocket.OPEN) {
      this.ws.send(JSON.stringify(message));
    } else {
      console.error("WebSocket is not connected");
    }
  }

  disconnect() {
    if (this.ws) {
      this.ws.close();
      this.ws = null;
      store.dispatch(setConnected(false));
    }
  }
}

export const wsClient = new WebSocketClient();
