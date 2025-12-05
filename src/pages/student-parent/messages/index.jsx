import { useState, useEffect, useRef } from "react";
import RoleBasedHeader from "../../../components/ui/RoleBasedHeader";
import ConversationList from "./components/ConversationList";
import ChatArea from "./components/ChatArea";
import ParticipantPanel from "./components/ParticipantPanel";
import CreateGroupModal from "./components/CreateGroupModal";
import MobileBottomNavigation from "../dashboard/components/MobileBottomNavigation";
import NewMassageModal from "./components/NewMassageModal";
import { useSocket } from "../../../services/sockets/ws";
import { listConversations } from "../../../services/messages/message.service";
import { useDispatch, useSelector } from "react-redux";
import { selectAuthUser } from "reducers/auth/authSelectors";
import { Navigate } from "react-router-dom";
import PageLoaderOverlay from "components/ui/PageLoaderOverlay";
import { toast } from "react-toastify";
import { setUnreadMessageCount } from "reducers/messages/messageSlice";

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
  const dispatch = useDispatch();
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

    const handleNewMessage = (message) => {
      setConversations((prev) => {
        return prev.map((conv) => {
          if (conv._id === message.thread) {
            // Don't update if user has left this group
            if (conv.hasLeft) {
              return conv;
            }

            const isActive = activeConversationRef.current?._id === message.thread;

            return {
              ...conv,
              lastMessage: {
                body: message.body,
                sender: message.sender,
                createdAt: message.sentAt,
                attachments: message.attachments || [],
              },
              unreadCount:
                isActive || message.sender._id === currentUser.id
                  ? conv.unreadCount || 0
                  : (conv.unreadCount || 0) + 1,
              updatedAt: message.sentAt,
            };
          }
          return conv;
        }).sort((a, b) => new Date(b.updatedAt) - new Date(a.updatedAt));
      });
    };

    const handleNewMessageNotification = (data) => {
      const { message, thread } = data;

      if (activeConversationRef.current?._id === thread._id) {
        return;
      }

      setConversations((prev) => {
        const existingConv = prev.find((c) => c._id === thread._id);

        if (existingConv) {
          //  Don't update if user has left
          if (existingConv.hasLeft) {
            return prev;
          }

          return prev.map((conv) => {
            if (conv._id === thread._id) {
              return {
                ...conv,
                lastMessage: {
                  body: message.body,
                  sender: message.sender,
                  createdAt: message.sentAt,
                  attachments: message.attachments || [],
                },
                unreadCount: (conv.unreadCount || 0) + 1,
                updatedAt: message.sentAt,
              };
            }
            return conv;
          }).sort((a, b) => new Date(b.updatedAt) - new Date(a.updatedAt));
        }

        return prev;
      });
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

    /**
     * Handle user online status
     */
    const handleUserOnline = ({ userId }) => {
      setConversations((prev) =>
        prev.map((conv) => ({
          ...conv,
          participants: conv.participants.map((p) =>
            p._id === userId ? { ...p, availabilityStatus: "online" } : p
          ),
        }))
      );
    };

    /**
     * Handle user offline status
     */
    const handleUserOffline = ({ userId }) => {
      setConversations((prev) =>
        prev.map((conv) => ({
          ...conv,
          participants: conv.participants.map((p) =>
            p._id === userId
              ? {
                ...p,
                availabilityStatus: "offline",
                lastSeen: new Date().toISOString(),
              }
              : p
          ),
        }))
      );
    };

    /**
     *  Handle participants added to group
     */
    const handleParticipantsAdded = (data) => {
      const { threadId, newParticipants, addedBy } = data;
      setConversations((prev) =>
        prev.map((conv) => {
          if (conv._id === threadId) {
            if (addedBy !== currentUser.id) {
              toast.info(`New members added to ${conv.groupName || "group"}`);
            }
            return conv;
          }
          return conv;
        })
      );
    };

    /**
     *  Handle being added to a group
     */
    /**
   * Handle being added to a group (including re-additions)
   */
    const handleAddedToGroup = async (data) => {
      const { threadId, addedBy } = data;
      const existingConv = conversations.find((c) => c._id === threadId);

      if (existingConv && existingConv.hasLeft) {
        toast.success("You were added back to the group!");
        try {
          const updatedConversations = await listConversations();
          const updatedConv = updatedConversations.find((c) => c._id === threadId);

          if (updatedConv) {
            setConversations((prev) =>
              prev.map((conv) => (conv._id === threadId ? updatedConv : conv))
            );
            if (activeConversationRef.current?._id === threadId) {
              setActiveConversation(updatedConv);
              threadOpen(threadId, currentUser?.id);
            }
          }
        } catch (err) {
          console.error("Failed to refresh conversation:", err);
        }
      } else if (!existingConv) {
        toast.success("You were added to a new group!");
        try {
          const updatedConversations = await listConversations();
          setConversations(updatedConversations);
        } catch (err) {
          console.error("Failed to refresh conversations:", err);
        }
      }
    };

    /**
     *  Handle participant leaving group
     */
    const handleParticipantLeft = (data) => {
      const { threadId, userId } = data;

      setConversations((prev) =>
        prev.map((conv) => {
          if (conv._id === threadId) {
            const updatedParticipants = conv.participants.filter(
              (p) => p._id !== userId
            );
            const leftParticipant = conv.participants.find(
              (p) => p._id === userId
            );

            if (leftParticipant && leftParticipant._id !== currentUser.id) {
              toast.info(
                `${leftParticipant.name} left ${conv.groupName || "the group"}`
              );
            }

            return {
              ...conv,
              participants: updatedParticipants,
            };
          }
          return conv;
        })
      );
      if (activeConversationRef.current?._id === threadId) {
        setActiveConversation((prev) => ({
          ...prev,
          participants: prev.participants.filter((p) => p._id !== userId),
        }));
      }
    };

    /**
     *  Handle current user leaving a group (socket event from server)
     */
    const handleLeftGroup = (data) => {
      const { threadId } = data;
      setConversations((prev) =>
        prev.map((conv) =>
          conv._id === threadId
            ? { ...conv, hasLeft: true, leftAt: new Date().toISOString() }
            : conv
        )
      );
      if (activeConversationRef.current?._id === threadId) {
        setActiveConversation((prev) => ({
          ...prev,
          hasLeft: true,
          leftAt: new Date().toISOString(),
        }));
      }
    };

    // Register event listeners
    socket.on("newMessage", handleNewMessage);
    socket.on("newMessageNotification", handleNewMessageNotification);
    socket.on("messagesRead", handleMessagesRead);
    socket.on("USER_ONLINE", handleUserOnline);
    socket.on("USER_OFFLINE", handleUserOffline);

    //  Register group management event listeners
    socket.on("participantsAdded", handleParticipantsAdded);
    socket.on("addedToGroup", handleAddedToGroup);
    socket.on("participantLeft", handleParticipantLeft);
    socket.on("leftGroup", handleLeftGroup);

    return () => {
      socket.off("newMessage", handleNewMessage);
      socket.off("newMessageNotification", handleNewMessageNotification);
      socket.off("messagesRead", handleMessagesRead);
      socket.off("USER_ONLINE", handleUserOnline);
      socket.off("USER_OFFLINE", handleUserOffline);

      //  Cleanup group management event listeners
      socket.off("participantsAdded", handleParticipantsAdded);
      socket.off("addedToGroup", handleAddedToGroup);
      socket.off("participantLeft", handleParticipantLeft);
      socket.off("leftGroup", handleLeftGroup);
    };
  }, [socket, currentUser, closeThread]);

  // Sync activeConversation with the newest object from conversations
  useEffect(() => {
    if (!activeConversation?._id) return;
    const fresh = conversations.find((c) => c._id === activeConversation._id);
    if (fresh && fresh !== activeConversation) setActiveConversation(fresh);
  }, [conversations, activeConversation]);

  // Handle conversation selection
  const handleConversationSelect = (conversation) => {
    if (
      activeConversation?._id &&
      activeConversation._id !== conversation._id
    ) {
      closeThread(activeConversation._id, currentUser?.id);
    }
    setActiveConversation(conversation);
    threadOpen(conversation._id, currentUser?.id);

    if (conversation.threadType === "GROUP") {
      setShowParticipants(true);
    } else {
      setShowParticipants(false);
    }
    // Mark as read if has unread messages
    if (conversation.unreadCount > 0) {
      const unreadToClear = conversation.unreadCount;
      markAsRead(conversation._id, currentUser?.id);

      // Optimistically update UI
      setConversations((prev) =>
        prev.map((conv) =>
          conv._id === conversation._id ? { ...conv, unreadCount: 0 } : conv
        )
      );

      // Sync unread count badge in header
      dispatch(setUnreadMessageCount({ decrement: unreadToClear }));
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

  const handleParticipantsUpdated = (updatedThread) => {
    setConversations((prev) =>
      prev.map((conv) =>
        conv._id === updatedThread._id ? updatedThread : conv
      )
    );
    if (activeConversation?._id === updatedThread._id) {
      setActiveConversation(updatedThread);
    }
  };

  const handleLeaveGroup = (threadId) => {
    setConversations((prev) =>
      prev.map((conv) =>
        conv._id === threadId
          ? { ...conv, hasLeft: true, leftAt: new Date().toISOString() }
          : conv
      )
    );
    if (activeConversation?._id === threadId) {
      setActiveConversation(null);
    }

    toast.success("You have left the group");
  };

  useEffect(() => {
    return () => {
      if (activeConversation?._id) {
        closeThread(activeConversation._id, currentUser?.id);
      }
    };
  }, []);

  return (
    <div className="min-h-screen bg-background">
      <PageLoaderOverlay show={loadingConversations} label="Loading messages…" />
      <RoleBasedHeader />

      {/* Main Content */}
      <div className="max-w-[1400px] mx-auto px-4 sm:px-6 lg:px-8 pt-16 pb-28 lg:pb-8">
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
                participants={activeConversation?.participants}
                currentUser={currentUser}
                onParticipantsUpdated={handleParticipantsUpdated}
                onLeaveGroup={handleLeaveGroup}
              />
            </div>
          )}
        </div>
      </div>

      {/* Mobile Bottom Navigation */}
      <MobileBottomNavigation />

      {/* Mobile Chat Overlay */}
      {activeConversation && (
        <div className="lg:hidden fixed inset-0 bg-background z-40 pt-[calc(4rem+env(safe-area-inset-top))] pb-[calc(5rem+env(safe-area-inset-bottom))]">
          <div className="flex flex-col h-full min-h-0">
            <div className="flex-1 overflow-hidden min-h-0">
              <ChatArea
                conversation={activeConversation}
                currentUser={currentUser}
                participants={activeConversation?.participants}
                onBack={() => {
                  closeThread(activeConversation._id, currentUser?.id);
                  setActiveConversation(null);
                }}
              />
            </div>
          </div>
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
          conversations={conversations}
        />
      )}
    </div>
  );
};

export default Messages;