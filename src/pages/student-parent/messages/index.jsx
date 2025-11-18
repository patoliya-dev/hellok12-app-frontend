import { useState, useEffect, useRef } from "react";
import RoleBasedHeader from "../../../components/ui/RoleBasedHeader";
import ConversationList from "./components/ConversationList";
import ChatArea from "./components/ChatArea";
import ParticipantPanel from "./components/ParticipantPanel";
import Icon from "../../../components/AppIcon";
import CreateGroupModal from "./components/CreateGroupModal";
import MobileBottomNavigation from "../dashboard/components/MobileBottomNavigation";
import NewMassageModal from "./components/NewMassageModal";
import { useSocket } from "../../../services/sockets/ws";
import { listConversations } from "../../../services/messages/message.service";
import { useSelector } from "react-redux";
import { selectAuthUser } from "reducers/auth/authSelectors";
import { Navigate } from "react-router-dom";
import Loader from "components/ui/Loader";
import { toast } from "react-toastify";

const Messages = () => {
  const [activeConversation, setActiveConversation] = useState(null);
  const [searchQuery, setSearchQuery] = useState("");
  const [showParticipants, setShowParticipants] = useState(false);
  const [isCreateGroupModal, setIsCreateGroupModal] = useState(false);
  const [isOpenNewMessageModal, setIsOpenNewMessageModal] = useState(false);
  const [conversations, setConversations] = useState([]);
  const [loadingConversations, setLoadingConversations] = useState(true);

  const { socket, threadOpen, markAsRead, closeThread } = useSocket();
  const currentUser = useSelector(selectAuthUser);
  const activeConversationRef = useRef(null);

  if (!currentUser) return <Navigate to="/login" replace />;

  // Keep ref in sync with state
  useEffect(() => {
    activeConversationRef.current = activeConversation;
  }, [activeConversation]);

  // Load conversations on mount
  useEffect(() => {
    const loadConversations = async () => {
      try {
        setLoadingConversations(true);
        const data = await listConversations();

        setConversations(data);
      } catch (err) {
        console.error("Failed to load conversations:", err);
      } finally {
        setLoadingConversations(false);
      }
    };

    loadConversations();
  }, []);

  // Socket listener for real-time message updates
  useEffect(() => {
    if (!socket) return;

    /**
     * Handle new messages in ACTIVE conversations (user is in the room)
     */
    const handleNewMessage = (message) => {


      setConversations((prev) => {
        return prev
          .map((conv) => {
            if (conv._id === message.thread) {
              // Check if this thread is currently active
              const isActive =
                activeConversationRef.current?._id === message.thread;

              return {
                ...conv,
                lastMessage: {
                  body: message.body,
                  sender: message.sender,
                  createdAt: message.sentAt,
                },
                // Only increment unread if NOT active and NOT sent by current user
                unreadCount:
                  isActive || message.sender._id === currentUser.id
                    ? conv.unreadCount || 0
                    : (conv.unreadCount || 0) + 1,
                updatedAt: message.sentAt,
              };
            }
            return conv;
          })
          .sort((a, b) => new Date(b.updatedAt) - new Date(a.updatedAt));
      });
    };

    /**
     * Handle message notifications for conversations user is NOT viewing
     * This fires even if user is not in the thread room
     */
    const handleNewMessageNotification = (data) => {

      const { message, thread } = data;

      // Skip if it's the current active conversation (already handled by handleNewMessage)
      if (activeConversationRef.current?._id === thread._id) {
        return;
      }

      setConversations((prev) => {
        // Check if conversation already exists
        const existingConv = prev.find((c) => c._id === thread._id);

        if (existingConv) {
          // Update existing conversation
          return prev
            .map((conv) => {
              if (conv._id === thread._id) {
                return {
                  ...conv,
                  lastMessage: {
                    body: message.body,
                    sender: message.sender,
                    createdAt: message.sentAt,
                  },
                  unreadCount: (conv.unreadCount || 0) + 1,
                  updatedAt: message.sentAt,
                };
              }
              return conv;
            })
            .sort((a, b) => new Date(b.updatedAt) - new Date(a.updatedAt));
        } else {
          // Add new conversation to the list
          const newConversation = {
            ...thread,
            lastMessage: {
              body: message.body,
              sender: message.sender,
              createdAt: message.sentAt,
            },
            unreadCount: 1,
            updatedAt: message.sentAt,
          };

          return [newConversation, ...prev].sort(
            (a, b) => new Date(b.updatedAt) - new Date(a.updatedAt)
          );
        }
      });

      const sender =
        thread.threadType === "GROUP" ? thread.groupName : message.sender.name;

      toast.info(`Message from ${sender}`);
    };

    /**
     * Handle messages marked as read
     */
    const handleMessagesRead = (data) => {


      // Update unread count for the specific thread
      setConversations((prev) =>
        prev.map((conv) =>
          conv._id === data.threadId ? { ...conv, unreadCount: 0 } : conv
        )
      );
    };

    // Register event listeners
    socket.on("newMessage", handleNewMessage);
    socket.on("newMessageNotification", handleNewMessageNotification);
    socket.on("messagesRead", handleMessagesRead);

    return () => {
      socket.off("newMessage", handleNewMessage);
      socket.off("newMessageNotification", handleNewMessageNotification);
      socket.off("messagesRead", handleMessagesRead);
    };
  }, [socket, currentUser]);

  // Request notification permission on mount
  useEffect(() => {
    if ("Notification" in window && Notification.permission === "default") {
      Notification.requestPermission().then((permission) => {

      });
    }
  }, []);

  // Handle conversation selection
  const handleConversationSelect = (conversation) => {


    // Close previous thread if any
    if (
      activeConversation?._id &&
      activeConversation._id !== conversation._id
    ) {

      closeThread(activeConversation._id, currentUser?.id);
    }

    // Set as active
    setActiveConversation(conversation);

    // Open thread via socket
    threadOpen(conversation._id, currentUser?.id);

    // Mark as read if has unread messages
    if (conversation.unreadCount > 0) {
      markAsRead(conversation._id, currentUser?.id);

      // Optimistically update UI
      setConversations((prev) =>
        prev.map((conv) =>
          conv._id === conversation._id ? { ...conv, unreadCount: 0 } : conv
        )
      );
    }
  };

  const handleGroupCreate = () => {
    setIsCreateGroupModal(true);
  };

  const handleGroupCreated = (newGroup) => {


    // Check if group already exists
    const exists = conversations.find((c) => c._id === newGroup._id);

    if (!exists) {
      setConversations((prev) => [newGroup, ...prev]);
    }

    // Open the new group
    setActiveConversation(newGroup);
    threadOpen(newGroup._id, currentUser?.id);
  };

  const handleNewMessageModal = () => {
    setIsOpenNewMessageModal(!isOpenNewMessageModal);
  };

  const handleNewConversation = (newConversation) => {


    // Check if conversation already exists
    const exists = conversations.find((c) => c._id === newConversation._id);

    if (!exists) {
      setConversations((prev) => [newConversation, ...prev]);
    }

    setActiveConversation(newConversation);

    // Open the thread
    threadOpen(newConversation._id, currentUser?.id);
  };

  // Cleanup on unmount
  useEffect(() => {
    return () => {
      if (activeConversation?._id) {

        closeThread(activeConversation._id, currentUser?.id);
      }
    };
  }, []);

  return loadingConversations ? (
    <Loader />
  ) : (
    <div className="min-h-screen bg-background">
      <RoleBasedHeader />

      {/* Main Content */}
      <div className="max-w-[1400px] mx-auto px-4 sm:px-6 lg:px-8 pt-16 pb-20 lg:pb-8">
        <div className="flex h-[calc(100vh-9rem)] mt-10 border border-border">
          {/* Conversation List */}
          <div className="w-full lg:w-80 lg:flex-shrink-0">
            <ConversationList
              conversations={conversations}
              activeConversation={activeConversation}
              onConversationSelect={handleConversationSelect}
              searchQuery={searchQuery}
              onSearchChange={setSearchQuery}
              onGroupCreate={handleGroupCreate}
              onNewMessage={handleNewMessageModal}
              currentUser={currentUser}
            />
          </div>

          {/* Chat Area */}
          <div className="hidden lg:flex lg:flex-1">
            <ChatArea
              conversation={activeConversation}
              currentUser={currentUser}
            />
          </div>

          {/* Participant Panel */}
          {showParticipants && activeConversation && (
            <div className="hidden xl:block">
              <ParticipantPanel
                conversation={activeConversation}
                currentUser={currentUser}
              />
            </div>
          )}
        </div>
      </div>

      {/* Mobile Bottom Navigation */}
      <MobileBottomNavigation />

      {/* Mobile Chat Overlay */}
      {activeConversation && (
        <div className="lg:hidden fixed inset-0 bg-background z-50 pt-16">
          <div className="flex h-full">
            <div className="flex-1">
              <ChatArea
                conversation={activeConversation}
                currentUser={currentUser}
              />
            </div>
          </div>

          {/* Back Button */}
          <button
            onClick={() => {
              // Close thread when going back
              closeThread(activeConversation._id, currentUser?.id);
              setActiveConversation(null);
            }}
            className="absolute top-20 left-4 bg-card border border-border rounded-full p-2 shadow-lg"
          >
            <Icon name="ArrowLeft" size={20} />
          </button>
        </div>
      )}

      {/* Modals */}
      {isCreateGroupModal && (
        <CreateGroupModal
          isOpen={isCreateGroupModal}
          onClose={() => setIsCreateGroupModal(false)}
          onGroupCreated={handleGroupCreated}
          currentUser={currentUser}
        />
      )}

      {isOpenNewMessageModal && (
        <NewMassageModal
          onClose={handleNewMessageModal}
          onNewConversation={handleNewConversation}
          currentUser={currentUser}
        />
      )}
    </div>
  );
};

export default Messages;
