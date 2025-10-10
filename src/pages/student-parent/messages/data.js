const mockUserData = [
  {
    name: "Emma Johnson",
    image:
      "https://images.unsplash.com/photo-1494790108755-2616b612b786?ixlib=rb-1.2.1&ixid=MnwxMjA3fDB8MHxwaG90by1wYWdlfHx8fGVufDB8fHx8&auto=format&fit=crop&w=200&q=80",
  },
  {
    name: "John Doe",
    image:
      "https://images.unsplash.com/photo-1507003211169-0a1dd7228f2d?ixlib=rb-1.2.1&ixid=MnwxMjA3fDB8MHxwaG90by1wYWdlfHx8fGVufDB8fHx8&auto=format&fit=crop&w=200&q=80",
  },
  {
    name: "Jane Smith",
    image:
      "https://images.unsplash.com/photo-1544005313-94ddf0286df2?ixlib=rb-1.2.1&ixid=MnwxMjA3fDB8MHxwaG90by1wYWdlfHx8fGVufDB8fHx8&auto=format&fit=crop&w=200&q=80",
  },
  {
    name: "Michael Johnson",
    image:
      "https://images.unsplash.com/photo-1507003211169-0a1dd7228f2d?ixlib=rb-1.2.1&ixid=MnwxMjA3fDB8MHxwaG90by1wYWdlfHx8fGVufDB8fHx8&auto=format&fit=crop&w=200&q=80",
  },
];

const mockConversations = [
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
    id: "conv-4",
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
    reactions: [],
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

export {
  mockUserData,
  mockConversations,
  mockMessages,
  mockParticipants,
  mockNotifications,
};
