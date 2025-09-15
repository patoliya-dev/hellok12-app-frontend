import { useState, useEffect } from "react";
import RoleBasedHeader from "../../../components/ui/RoleBasedHeader";
import ConversationList from "./components/ConversationList";
import ChatArea from "./components/ChatArea";
import ParticipantPanel from "./components/ParticipantPanel";
import Icon from "../../../components/AppIcon";
import CreateGroupModal from "./components/CreateGroupModal";
import MobileBottomNavigation from "../dashboard/components/MobileBottomNavigation";

const Messages = () => {
  const [activeConversation, setActiveConversation] = useState(null);
  const [searchQuery, setSearchQuery] = useState("");
  const [showParticipants, setShowParticipants] = useState(false);
  const [messages, setMessages] = useState([]);
  const [notifications, setNotifications] = useState([]);
  const [isCreateGroupModal, setIsCreateGroupModal] = useState(false);

  // Mock current user
  const currentUser = {
    id: "user-1",
    name: "Sarah Johnson",
    email: "sarah.johnson@email.com",
    role: "parent",
    avatar:
      "https://images.unsplash.com/photo-1494790108755-2616b612b786?w=150&h=150&fit=crop&crop=face",
  };

  // Mock conversations data
  const conversations = [
    {
      id: "conv-1",
      name: "Ms. Rodriguez - Math Teacher",
      type: "direct",
      avatar:
        "https://images.unsplash.com/photo-1507003211169-0a1dd7228f2d?w=150&h=150&fit=crop&crop=face",
      lastMessage:
        "Emma did great in today's algebra session! She's really improving with quadratic equations.",
      lastSender: null,
      timestamp: new Date(Date.now() - 300000),
      unreadCount: 2,
      isOnline: true,
      isPriority: false,
      isTyping: false,
      participantCount: 2,
    },
    {
      id: "conv-2",
      name: "Grade 7 Math Class",
      type: "group",
      avatar: null,
      lastMessage: "Don't forget about tomorrow's quiz on fractions!",
      lastSender: "Ms. Rodriguez",
      timestamp: new Date(Date.now() - 900000),
      unreadCount: 0,
      isOnline: false,
      isPriority: false,
      isTyping: true,
      participantCount: 15,
    },
    {
      id: "conv-3",
      name: "School Announcements",
      type: "announcements",
      avatar: null,
      lastMessage:
        "Parent-teacher conferences scheduled for next week. Please check your calendar for assigned slots.",
      lastSender: "HelloK12 Admin",
      timestamp: new Date(Date.now() - 3600000),
      unreadCount: 1,
      isOnline: false,
      isPriority: true,
      isTyping: false,
      participantCount: 150,
    },
    {
      id: "conv-4",
      name: "Dr. Chen - Science Teacher",
      type: "direct",
      avatar:
        "https://images.unsplash.com/photo-1559839734-2b71ea197ec2?w=150&h=150&fit=crop&crop=face",
      lastMessage:
        "The chemistry experiment went well today. Emma showed excellent understanding of molecular structures.",
      lastSender: null,
      timestamp: new Date(Date.now() - 7200000),
      unreadCount: 0,
      isOnline: false,
      isPriority: false,
      isTyping: false,
      participantCount: 2,
    },
    {
      id: "conv-5",
      name: "Parent Support Group",
      type: "group",
      avatar: null,
      lastMessage:
        "Has anyone tried the new study techniques mentioned in the workshop?",
      lastSender: "Jennifer M.",
      timestamp: new Date(Date.now() - 14400000),
      unreadCount: 5,
      isOnline: false,
      isPriority: false,
      isTyping: false,
      participantCount: 8,
    },
  ];

  // Mock messages for active conversation
  const mockMessages = [
    {
      id: "msg-1",
      senderId: "teacher-1",
      senderName: "Ms. Rodriguez",
      senderAvatar:
        "https://images.unsplash.com/photo-1507003211169-0a1dd7228f2d?w=150&h=150&fit=crop&crop=face",
      content:
        "Hi Sarah! I wanted to update you on Emma's progress in our math sessions.",
      type: "text",
      timestamp: new Date(Date.now() - 1800000),
      status: "read",
      reactions: [],
    },
    {
      id: "msg-2",
      senderId: "user-1",
      senderName: "Sarah Johnson",
      senderAvatar:
        "https://images.unsplash.com/photo-1494790108755-2616b612b786?w=150&h=150&fit=crop&crop=face",
      content: "Thank you for reaching out! I'd love to hear how she's doing.",
      type: "text",
      timestamp: new Date(Date.now() - 1740000),
      status: "read",
      reactions: [],
    },
    {
      id: "msg-3",
      senderId: "teacher-1",
      senderName: "Ms. Rodriguez",
      senderAvatar:
        "https://images.unsplash.com/photo-1507003211169-0a1dd7228f2d?w=150&h=150&fit=crop&crop=face",
      content:
        "She's made significant improvement with algebraic equations. Her problem-solving approach has become much more systematic.",
      type: "text",
      timestamp: new Date(Date.now() - 1680000),
      status: "read",
      reactions: [{ emoji: "👍", count: 1, users: ["user-1"] }],
    },
    {
      id: "msg-4",
      senderId: "teacher-1",
      senderName: "Ms. Rodriguez",
      senderAvatar:
        "https://images.unsplash.com/photo-1507003211169-0a1dd7228f2d?w=150&h=150&fit=crop&crop=face",
      content: "homework_solutions.pdf",
      type: "file",
      fileName: "homework_solutions.pdf",
      fileSize: 245760,
      timestamp: new Date(Date.now() - 1620000),
      status: "read",
      reactions: [],
    },
    {
      id: "msg-5",
      senderId: "user-1",
      senderName: "Sarah Johnson",
      senderAvatar:
        "https://images.unsplash.com/photo-1494790108755-2616b612b786?w=150&h=150&fit=crop&crop=face",
      content:
        "That's wonderful to hear! Emma mentioned she's enjoying the sessions much more now. Thank you for the homework solutions.",
      type: "text",
      timestamp: new Date(Date.now() - 1560000),
      status: "read",
      reactions: [],
    },
    {
      id: "msg-6",
      senderId: "teacher-1",
      senderName: "Ms. Rodriguez",
      senderAvatar:
        "https://images.unsplash.com/photo-1507003211169-0a1dd7228f2d?w=150&h=150&fit=crop&crop=face",
      content:
        "Emma did great in today's algebra session! She's really improving with quadratic equations.",
      type: "text",
      timestamp: new Date(Date.now() - 300000),
      status: "delivered",
      reactions: [],
    },
  ];

  // Mock participants for group conversations
  const mockParticipants = [
    {
      id: "teacher-1",
      name: "Ms. Rodriguez",
      role: "teacher",
      avatar:
        "https://images.unsplash.com/photo-1507003211169-0a1dd7228f2d?w=150&h=150&fit=crop&crop=face",
      status: "online",
    },
    {
      id: "user-1",
      name: "Sarah Johnson",
      role: "parent",
      avatar:
        "https://images.unsplash.com/photo-1494790108755-2616b612b786?w=150&h=150&fit=crop&crop=face",
      status: "online",
    },
    {
      id: "student-1",
      name: "Emma Johnson",
      role: "student",
      avatar:
        "https://images.unsplash.com/photo-1544005313-94ddf0286df2?w=150&h=150&fit=crop&crop=face",
      status: "away",
    },
    {
      id: "parent-2",
      name: "Michael Chen",
      role: "parent",
      avatar:
        "https://images.unsplash.com/photo-1472099645785-5658abf4ff4e?w=150&h=150&fit=crop&crop=face",
      status: "offline",
    },
    {
      id: "parent-3",
      name: "Jennifer Martinez",
      role: "parent",
      avatar:
        "https://images.unsplash.com/photo-1438761681033-6461ffad8d80?w=150&h=150&fit=crop&crop=face",
      status: "busy",
    },
  ];

  // Mock notifications
  const mockNotifications = [
    {
      id: "notif-1",
      type: "message",
      title: "New message from Ms. Rodriguez",
      message:
        "Emma did great in today's algebra session! She's really improving with quadratic equations.",
      timestamp: new Date(Date.now() - 300000),
      isRead: false,
      priority: "normal",
      conversationId: "conv-1",
    },
    {
      id: "notif-2",
      type: "mention",
      title: "You were mentioned in Grade 7 Math Class",
      message: "@Sarah Johnson, please review Emma's homework submission.",
      timestamp: new Date(Date.now() - 900000),
      isRead: false,
      priority: "high",
      conversationId: "conv-2",
    },
    {
      id: "notif-3",
      type: "file",
      title: "File shared in Parent Support Group",
      message: "Jennifer M. shared study_tips_guide.pdf",
      timestamp: new Date(Date.now() - 3600000),
      isRead: true,
      priority: "normal",
      conversationId: "conv-5",
    },
  ];

  useEffect(() => {
    setMessages(mockMessages);
    setNotifications(mockNotifications);
  }, []);

  useEffect(() => {
    if (activeConversation) {
      // Load messages for the selected conversation
      setMessages(mockMessages);
      // Show participants panel for group conversations
      setShowParticipants(activeConversation?.type !== "direct");
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

  return (
    <div className="min-h-screen bg-background">
      <RoleBasedHeader />

      {/* Main Content */}
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 pt-16 pb-20 lg:pb-8">
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
    </div>
  );
};

export default Messages;
