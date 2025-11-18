import React, {
  useContext,
  useEffect,
  useState,
  useCallback,
  useRef,
} from "react";
import { io } from "socket.io-client";
import { useSelector } from "react-redux";
import { selectAuthUser } from "reducers/auth/authSelectors";

const SocketContext = React.createContext(null);

export const useSocket = () => {
  const state = useContext(SocketContext);
  if (!state) {
    throw new Error("useSocket must be used within a SocketProvider");
  }
  return state;
};

const SocketProvider = ({ children }) => {
  const [socket, setSocket] = useState(null);
  const [isConnected, setIsConnected] = useState(false);
  const currentUser = useSelector(selectAuthUser);
  const currentThreadRef = useRef(null); // Track current thread

  useEffect(() => {
    if (!currentUser?.id) return;

    // Initialize socket connection
    const _socket = io(import.meta.env.VITE_APP_SOCKET_URL, {
      transports: ["websocket", "polling"],
      reconnection: true,
      reconnectionDelay: 1000,
      reconnectionDelayMax: 5000,
      reconnectionAttempts: 5,
      autoConnect: true,
      query: {
        userId: currentUser.id, // Pass userId in connection
      },
    });

    // Connection event handlers
    _socket.on("connect", () => {
      console.log("✅ Socket connected:", _socket.id);
      setIsConnected(true);

      // Join user's personal room on connect
      _socket.emit("userConnect", { userId: currentUser.id });

      // Rejoin current thread if any (for page reload scenario)
      if (currentThreadRef.current) {
        console.log(
          "🔄 Rejoining thread after reconnect:",
          currentThreadRef.current
        );
        _socket.emit("threadOpen", {
          threadId: currentThreadRef.current,
          senderId: currentUser.id,
        });
      }
    });

    _socket.on("userConnected", (data) => {
      console.log("✅ User room joined:", data);
    });

    _socket.on("disconnect", (reason) => {
      console.log("🔴 Socket disconnected:", reason);
      setIsConnected(false);
    });

    _socket.on("connect_error", (error) => {
      console.error("🔴 Socket connection error:", error);
      setIsConnected(false);
    });

    _socket.on("reconnect", (attemptNumber) => {
      console.log("🔄 Socket reconnected, attempt:", attemptNumber);
      setIsConnected(true);

      // Rejoin user room after reconnect
      _socket.emit("userConnect", { userId: currentUser.id });
    });

    _socket.on("error", (error) => {
      console.error("🔴 Socket error:", error);
    });

    setSocket(_socket);

    // Cleanup on unmount
    return () => {
      console.log("🧹 Cleaning up socket connection");
      if (currentThreadRef.current) {
        _socket.emit("closeThread", {
          threadId: currentThreadRef.current,
          userId: currentUser.id,
        });
      }
      _socket.disconnect();
      setSocket(null);
    };
  }, [currentUser?.id]);

  /**
   * Open a thread and join socket room
   */
  const threadOpen = useCallback(
    (threadId, senderId) => {
      if (!socket || !isConnected) {
        console.error("❌ Cannot open thread - socket not connected");
        return;
      }

      // Leave previous thread if different
      if (currentThreadRef.current && currentThreadRef.current !== threadId) {
        console.log("🚪 Leaving previous thread:", currentThreadRef.current);
        socket.emit("closeThread", {
          threadId: currentThreadRef.current,
          userId: senderId,
        });
      }

      console.log("🚪 Opening thread:", threadId);
      currentThreadRef.current = threadId;

      socket.emit("threadOpen", {
        threadId,
        senderId,
      });
    },
    [socket, isConnected]
  );

  /**
   * Close thread (leave room)
   */
  const closeThread = useCallback(
    (threadId, userId) => {
      if (!socket || !isConnected) {
        return;
      }

      console.log("🚪 Closing thread:", threadId);

      socket.emit("closeThread", {
        threadId,
        userId,
      });

      // Clear current thread ref if it matches
      if (currentThreadRef.current === threadId) {
        currentThreadRef.current = null;
      }
    },
    [socket, isConnected]
  );

  /**
   * Send a message
   */
  const sendMessage = useCallback(
    (thread, body, sender, sentAt, type = "text") => {
      if (!socket || !isConnected) {
        console.error("❌ Cannot send message - socket not connected");
        return false;
      }

      socket.emit("sendMessage", {
        thread,
        body,
        sender,
        sentAt,
        type,
      });

      return true;
    },
    [socket, isConnected]
  );

  /**
   * Mark messages as read
   */
  const markAsRead = useCallback(
    (threadId, userId) => {
      if (!socket || !isConnected) {
        console.error("❌ Cannot mark as read - socket not connected");
        return;
      }

      console.log("✅ Marking as read:", threadId);

      socket.emit("markAsRead", {
        threadId,
        userId,
      });
    },
    [socket, isConnected]
  );

  /**
   * Send typing indicator
   */
  const sendTyping = useCallback(
    (threadId, userId, userName, isTyping) => {
      if (!socket || !isConnected) {
        return;
      }

      socket.emit("typing", {
        threadId,
        userId,
        userName,
        isTyping,
      });
    },
    [socket, isConnected]
  );

  /**
   * Get current unread count across all threads
   */
  const getUnreadCount = useCallback(() => {
    // This will be updated via socket events
    // The actual count will be managed by the component using this hook
    return 0;
  }, []);

  return (
    <SocketContext.Provider
      value={{
        socket,
        isConnected,
        threadOpen,
        closeThread,
        sendMessage,
        markAsRead,
        sendTyping,
        getUnreadCount,
        currentUser,
      }}
    >
      {children}
    </SocketContext.Provider>
  );
};

export default SocketProvider;
