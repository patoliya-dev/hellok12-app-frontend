import { useEffect } from "react";
import { useDispatch, useSelector } from "react-redux";
import { useSocket } from "../../services/sockets/ws";
import { selectAuthUser } from "reducers/auth/authSelectors";
import { setUnreadMessageCount } from "../../reducers/messages/messageSlice";
import { toast } from "react-toastify";

/**
 * Global Socket Listener Component
 * This component listens to socket events app-wide and updates global state
 * It should be mounted once at the app root level
 */
const SocketListener = () => {
  const { socket, isConnected } = useSocket();
  const dispatch = useDispatch();
  const currentUser = useSelector(selectAuthUser);

  useEffect(() => {
    if (!socket || !isConnected || !currentUser) return;

    console.log("🎧 Global socket listeners registered");

    /**
     * Listen for new message notifications globally
     * This updates the header badge count
     */
    const handleNewMessageNotification = (data) => {
      console.log("🔔 [Global] New message notification:", data);

      // Increment unread count in global state
      dispatch(setUnreadMessageCount({ increment: 1 }));

      // Show toast notification
      const sender =
        data.thread.threadType === "GROUP"
          ? data.thread.groupName
          : data.sender.name;

      toast.info(`New message from ${sender}`, {
        position: "top-right",
        autoClose: 3000,
      });
    };

    /**
     * Listen for messages marked as read
     * This decreases the header badge count
     */
    const handleMessagesRead = (data) => {
      console.log("✅ [Global] Messages marked as read:", data);

      // Only update if it's the current user who marked as read
      if (data.userId === currentUser.id) {
        // Fetch updated count from server
        dispatch(setUnreadMessageCount({ refresh: true }));
      }
    };

    /**
     * Listen for thread opened event
     * When user opens a thread, we need to refresh the count
     */
    const handleThreadOpened = (data) => {
      console.log("📂 [Global] Thread opened:", data);

      // Refresh unread count when user opens a thread
      if (data.senderId === currentUser.id) {
        dispatch(setUnreadMessageCount({ refresh: true }));
      }
    };

    // Register event listeners
    socket.on("newMessageNotification", handleNewMessageNotification);
    socket.on("messagesRead", handleMessagesRead);
    socket.on("threadOpen", handleThreadOpened);

    // Cleanup on unmount
    return () => {
      console.log("🧹 Cleaning up global socket listeners");
      socket.off("newMessageNotification", handleNewMessageNotification);
      socket.off("messagesRead", handleMessagesRead);
      socket.off("threadOpen", handleThreadOpened);
    };
  }, [socket, isConnected, currentUser, dispatch]);

  // This component doesn't render anything
  return null;
};

export default SocketListener;
