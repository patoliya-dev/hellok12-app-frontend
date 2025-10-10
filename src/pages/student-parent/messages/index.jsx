import { useState, useEffect } from "react";
import RoleBasedHeader from "../../../components/ui/RoleBasedHeader";
import ConversationList from "./components/ConversationList";
import ChatArea from "./components/ChatArea";
import ParticipantPanel from "./components/ParticipantPanel";
import Icon from "../../../components/AppIcon";
import CreateGroupModal from "./components/CreateGroupModal";
import MobileBottomNavigation from "../dashboard/components/MobileBottomNavigation";
import NewMassageModal from "./components/NewMassageModal";
import {
  mockConversations,
  mockMessages,
  mockNotifications,
  mockParticipants,
} from "./data";

const Messages = () => {
  const [activeConversation, setActiveConversation] = useState(null);
  const [searchQuery, setSearchQuery] = useState("");
  const [showParticipants, setShowParticipants] = useState(false);
  const [messages, setMessages] = useState([]);
  const [notifications, setNotifications] = useState([]);
  const [isCreateGroupModal, setIsCreateGroupModal] = useState(false);
  const [isOpenNewMessageModal, setIsOpenNewMessageModal] = useState(false);
  const [conversations, setConversations] = useState(mockConversations);

  // Mock current user
  const currentUser = {
    id: "user-1",
    name: "Sarah Johnson",
    email: "sarah.johnson@email.com",
    role: "parent",
    avatar:
      "https://images.unsplash.com/photo-1494790108755-2616b612b786?w=150&h=150&fit=crop&crop=face",
  };

  useEffect(() => {
    setMessages(mockMessages);
    setNotifications(mockNotifications);
  }, []);

  useEffect(() => {
    if (activeConversation && !activeConversation?.isNewMessage) {
      // Load messages for the selected conversation
      setMessages(mockMessages);
      // Show participants panel for group conversations
      setShowParticipants(activeConversation?.type !== "direct");
    } else {
      setMessages([]);
      setShowParticipants(false);
    }
  }, [activeConversation]);

  const handleConversationSelect = (conversation) => {
    setActiveConversation(conversation);
  };

  const handleSendMessage = (messageData) => {
    const newMessage = {
      id: `msg-${Date.now()}`,
      senderId: currentUser?.id,
      senderName: currentUser?.name,
      senderAvatar: currentUser?.avatar,
      content: messageData?.text || messageData?.fileName || "",
      type: messageData?.type,
      timestamp: messageData?.timestamp,
      status: "sent",
      reactions: [],
      ...messageData,
    };

    setMessages((prev) => [...prev, newMessage]);

    // Simulate message delivery status update
    setTimeout(() => {
      setMessages((prev) =>
        prev?.map((msg) =>
          msg?.id === newMessage?.id ? { ...msg, status: "delivered" } : msg
        )
      );
    }, 1000);

    // Simulate read receipt
    setTimeout(() => {
      setMessages((prev) =>
        prev?.map((msg) =>
          msg?.id === newMessage?.id ? { ...msg, status: "read" } : msg
        )
      );
    }, 3000);
  };

  const handleGroupCreate = () => {
    setIsCreateGroupModal(true);
  };

  const handleNewMessageModal = () => {
    setIsOpenNewMessageModal(!isOpenNewMessageModal);
  };

  const handleNewConversation = (newConversation) => {
    setConversations((prev) => [
      ...prev,
      { ...newConversation, id: Date.now() },
    ]);
    setActiveConversation({ ...newConversation, id: Date.now() });
  };

  return (
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
            />
          </div>

          {/* Chat Area */}
          <div className="hidden lg:flex lg:flex-1">
            <ChatArea
              conversation={activeConversation}
              messages={messages}
              onSendMessage={handleSendMessage}
              currentUser={currentUser}
            />
          </div>

          {/* Participant Panel */}
          {showParticipants && activeConversation && (
            <div className="hidden xl:block">
              <ParticipantPanel
                conversation={activeConversation}
                participants={mockParticipants}
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
                messages={messages}
                onSendMessage={handleSendMessage}
                currentUser={currentUser}
              />
            </div>
          </div>

          {/* Back Button */}
          <button
            onClick={() => setActiveConversation(null)}
            className="absolute top-20 left-4 bg-card border border-border rounded-full p-2 shadow-lg"
          >
            <Icon name="ArrowLeft" size={20} />
          </button>
        </div>
      )}

      {isCreateGroupModal && (
        <CreateGroupModal
          isOpen={isCreateGroupModal}
          onClose={() => setIsCreateGroupModal(false)}
        />
      )}

      {isOpenNewMessageModal && (
        <NewMassageModal
          onClose={handleNewMessageModal}
          onNewConversation={handleNewConversation}
        />
      )}
    </div>
  );
};

export default Messages;
