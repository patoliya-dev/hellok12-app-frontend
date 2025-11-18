import React, { useState, useRef, useEffect } from "react";
import Icon from "../../../../components/AppIcon";
import Image from "../../../../components/AppImage";
import Button from "../../../../components/ui/Button";
import { listChats } from "../../../../services/messages/message.service";
import Loader from "../../../../components/ui/Loader";
import { useSocket } from "../../../../services/sockets/ws";

const ChatArea = ({ conversation, currentUser }) => {
  const [messageText, setMessageText] = useState("");
  const [showEmojiPicker, setShowEmojiPicker] = useState(false);
  const [typingUsers, setTypingUsers] = useState([]);
  const [dragOver, setDragOver] = useState(false);
  const [messages, setMessages] = useState([]);
  const [loading, setLoading] = useState(false);

  const messagesEndRef = useRef(null);
  const fileInputRef = useRef(null);
  const typingTimeoutRef = useRef(null);

  const { sendMessage, socket, sendTyping, markAsRead } = useSocket();

  const emojis = [
    "😀",
    "😂",
    "😍",
    "🤔",
    "👍",
    "👎",
    "❤️",
    "🎉",
    "😢",
    "😡",
    "🙏",
    "💯",
  ];

  // Load messages when conversation changes
  useEffect(() => {
    if (!conversation?._id) return;

    const loadMessages = async () => {
      setLoading(true);
      try {
        const data = await listChats(conversation._id);
        setMessages(data);
      } catch (err) {
        console.error("Message fetching failed:", err);
      } finally {
        setLoading(false);
      }
    };

    loadMessages();
  }, [conversation?._id]);

  // Socket listeners for real-time updates
  useEffect(() => {
    if (!socket || !conversation?._id) return;
    const handleNewMessage = (message) => {
      if (message.thread === conversation._id) {
        setMessages((prev) => {
          const exists = prev.some((m) => m._id === message._id);
          if (exists) {
            return prev;
          }
          return [...prev, message];
        });
        if (message.sender._id !== currentUser.id) {
          markAsRead(conversation._id, currentUser.id);
        }
      }
    };

    // Handle typing indicator
    const handleUserTyping = (data) => {
      if (
        data.threadId === conversation._id &&
        data.userId !== currentUser.id
      ) {
        if (data.isTyping) {
          setTypingUsers((prev) => {
            if (!prev.includes(data.userName)) {
              return [...prev, data.userName];
            }
            return prev;
          });
        } else {
          setTypingUsers((prev) =>
            prev.filter((name) => name !== data.userName)
          );
        }
      }
    };

    // Handle messages read
    const handleMessagesRead = (data) => {
      if (data.threadId === conversation._id) {
        // Update read status for messages
        setMessages((prev) =>
          prev.map((msg) => ({
            ...msg,
            readBy: msg.readBy
              ? [...new Set([...msg.readBy, data.userId])]
              : [data.userId],
          }))
        );
      }
    };

    socket.on("newMessage", handleNewMessage);
    socket.on("userTyping", handleUserTyping);
    socket.on("messagesRead", handleMessagesRead);

    return () => {
      socket.off("newMessage", handleNewMessage);
      socket.off("userTyping", handleUserTyping);
      socket.off("messagesRead", handleMessagesRead);
    };
  }, [socket, conversation?._id, currentUser, markAsRead]);

  // Auto-scroll to bottom when new messages arrive
  useEffect(() => {
    messagesEndRef?.current?.scrollIntoView({ behavior: "smooth" });
  }, [messages]);

  // Handle sending message
  const handleSendMessage = () => {
    if (!messageText?.trim()) return;

    const messageData = {
      thread: conversation._id,
      body: messageText.trim(),
      sender: currentUser.id,
      sentAt: new Date().toISOString(),
      type: "text",
    };

    const sent = sendMessage(
      messageData.thread,
      messageData.body,
      messageData.sender,
      messageData.sentAt,
      messageData.type
    );

    if (sent) {
      setMessageText("");
      sendTyping(conversation._id, currentUser.id, currentUser.name, false);
    }
  };

  const handleKeyPress = (e) => {
    if (e?.key === "Enter" && !e?.shiftKey) {
      e?.preventDefault();
      handleSendMessage();
    }
  };

  // Handle typing indicator
  const handleTyping = (e) => {
    setMessageText(e.target.value);

    // Clear existing timeout
    if (typingTimeoutRef.current) {
      clearTimeout(typingTimeoutRef.current);
    }

    // Send typing = true
    sendTyping(conversation._id, currentUser.id, currentUser.name, true);

    // Set timeout to send typing = false
    typingTimeoutRef.current = setTimeout(() => {
      sendTyping(conversation._id, currentUser.id, currentUser.name, false);
    }, 2000);
  };

  const handleFileUpload = (e) => {
    const files = Array.from(e?.target?.files);
    // TODO: Implement file upload
  };

  const handleDragOver = (e) => {
    e?.preventDefault();
    setDragOver(true);
  };

  const handleDragLeave = (e) => {
    e?.preventDefault();
    setDragOver(false);
  };

  const handleDrop = (e) => {
    e?.preventDefault();
    setDragOver(false);
    const files = Array.from(e?.dataTransfer?.files);
    // TODO: Implement file upload
  };

  const formatTime = (timestamp) => {
    return new Date(timestamp)?.toLocaleTimeString([], {
      hour: "2-digit",
      minute: "2-digit",
    });
  };

  const getParticipantName = (thread, currentUser) => {
    const participants = thread?.participants;
    const otherParticipant = participants?.find(
      (p) => p._id !== currentUser?.id
    );
    return thread.threadType?.toLowerCase() === "direct"
      ? otherParticipant?.name
      : thread.groupName;
  };

  const getParticipantAvatar = (thread, currentUser) => {
    const participants = thread?.participants;
    const otherParticipant = participants?.find(
      (p) => p._id !== currentUser?.id
    );
    return otherParticipant?.profileImage?.url || "/assets/images/no_image.png";
  };

  if (!conversation && !loading) {
    return (
      <div className="flex-1 flex items-center justify-center bg-background">
        <div className="text-center">
          <Icon
            name="MessageSquare"
            size={64}
            className="mx-auto text-muted-foreground mb-4"
          />
          <h3 className="text-lg font-medium text-foreground mb-2">
            Select a conversation
          </h3>
          <p className="text-muted-foreground">
            Choose a conversation from the sidebar to start messaging
          </p>
        </div>
      </div>
    );
  }

  return loading ? (
    <Loader fullScreen={false} className="flex-1 bg-background" />
  ) : (
    <div className="flex-1 flex flex-col bg-background">
      {/* Chat Header */}
      <div className="bg-card border-b border-border p-4">
        <div className="flex items-center justify-between">
          <div className="flex items-center space-x-3">
            {conversation?.threadType?.toLowerCase() === "direct" ? (
              <Image
                src={getParticipantAvatar(conversation, currentUser)}
                alt={getParticipantName(conversation, currentUser)}
                className="w-10 h-10 rounded-full object-cover"
              />
            ) : (
              <div className="w-10 h-10 bg-secondary rounded-full flex items-center justify-center">
                <Icon
                  name="Users"
                  size={20}
                  className="text-secondary-foreground"
                />
              </div>
            )}
            <div>
              <h3 className="font-semibold text-foreground">
                {getParticipantName(conversation, currentUser)}
              </h3>
              <p className="text-sm text-muted-foreground">
                {conversation?.threadType?.toLowerCase() === "direct"
                  ? conversation?.isOnline
                    ? "Online"
                    : "Last seen recently"
                  : `${conversation?.participants?.length} participants`}
              </p>
            </div>
          </div>
        </div>
      </div>

      {/* Messages Area */}
      <div
        className={`flex-1 overflow-y-auto p-4 space-y-4 ${
          dragOver ? "bg-primary/5 border-2 border-dashed border-primary" : ""
        }`}
        onDragOver={handleDragOver}
        onDragLeave={handleDragLeave}
        onDrop={handleDrop}
      >
        {dragOver && (
          <div className="absolute inset-0 flex items-center justify-center bg-primary/10 z-10">
            <div className="text-center">
              <Icon
                name="Upload"
                size={48}
                className="mx-auto text-primary mb-2"
              />
              <p className="text-primary font-medium">
                Drop files here to share
              </p>
            </div>
          </div>
        )}

        {messages?.map((message, index) => {
          const isCurrentUser = message?.sender?._id === currentUser?.id;
          const showAvatar =
            !isCurrentUser &&
            (index === 0 ||
              messages?.[index - 1]?.sender?._id !== message?.sender?._id);

          return (
            <div
              key={message?._id}
              className={`flex ${
                isCurrentUser ? "justify-end" : "justify-start"
              }`}
            >
              <div
                className={`flex max-w-[70%] ${
                  isCurrentUser ? "flex-row-reverse" : "flex-row"
                }`}
              >
                {/* Avatar */}
                {showAvatar && !isCurrentUser && (
                  <Image
                    src={
                      message?.sender?.profileImage?.url ||
                      "/assets/images/no_image.png"
                    }
                    alt={message?.sender?.name}
                    className="w-8 h-8 rounded-full object-cover mr-2 mt-1"
                  />
                )}
                {!showAvatar && !isCurrentUser && (
                  <div className="w-8 mr-2"></div>
                )}

                {/* Message Content */}
                <div
                  className={`group relative ${
                    isCurrentUser ? "ml-2" : "mr-2"
                  }`}
                >
                  {/* Sender Name */}
                  {!isCurrentUser && showAvatar && (
                    <p className="text-xs text-muted-foreground mb-1 ml-3">
                      {message?.sender?.name}
                    </p>
                  )}

                  {/* Message Bubble */}
                  <div
                    className={`relative px-4 py-2 rounded-2xl ${
                      isCurrentUser
                        ? "bg-primary text-primary-foreground"
                        : "bg-card border border-border text-foreground"
                    }`}
                  >
                    <p className="whitespace-pre-wrap break-words">
                      {message?.body}
                    </p>

                    {/* Message Time */}
                    <div
                      className={`text-xs mt-1 ${
                        isCurrentUser
                          ? "text-primary-foreground/70"
                          : "text-muted-foreground"
                      }`}
                    >
                      {formatTime(message?.sentAt)}
                      {isCurrentUser && (
                        <Icon
                          name={
                            message?.status === "read" ? "CheckCheck" : "Check"
                          }
                          size={12}
                          className={`inline ml-1 ${
                            message?.status === "read" ? "text-success" : ""
                          }`}
                        />
                      )}
                    </div>
                  </div>
                </div>
              </div>
            </div>
          );
        })}

        {/* Typing Indicator */}
        {typingUsers.length > 0 && (
          <div className="flex justify-start">
            <div className="flex items-center space-x-2 bg-card border border-border rounded-2xl px-4 py-2">
              <div className="flex space-x-1">
                <div className="w-2 h-2 bg-muted-foreground rounded-full animate-bounce"></div>
                <div
                  className="w-2 h-2 bg-muted-foreground rounded-full animate-bounce"
                  style={{ animationDelay: "0.1s" }}
                ></div>
                <div
                  className="w-2 h-2 bg-muted-foreground rounded-full animate-bounce"
                  style={{ animationDelay: "0.2s" }}
                ></div>
              </div>
              <span className="text-sm text-muted-foreground">
                {typingUsers[0]} is typing...
              </span>
            </div>
          </div>
        )}

        <div ref={messagesEndRef} />
      </div>

      {/* Message Input */}
      <div className="bg-card border-t border-border p-4">
        {/* Emoji Picker */}
        {showEmojiPicker && (
          <div className="mb-3 p-3 bg-muted rounded-lg">
            <div className="grid grid-cols-6 gap-2">
              {emojis?.map((emoji) => (
                <button
                  key={emoji}
                  onClick={() => {
                    setMessageText((prev) => prev + emoji);
                    setShowEmojiPicker(false);
                  }}
                  className="text-xl hover:bg-background rounded p-2 transition-colors duration-200"
                >
                  {emoji}
                </button>
              ))}
            </div>
          </div>
        )}

        <div className="flex items-end space-x-3">
          {/* File Upload */}
          <input
            ref={fileInputRef}
            type="file"
            multiple
            onChange={handleFileUpload}
            className="hidden"
          />
          <Button
            variant="ghost"
            size="icon"
            onClick={() => fileInputRef?.current?.click()}
            className="flex-shrink-0"
          >
            <Icon name="Paperclip" size={18} />
          </Button>

          {/* Message Input */}
          <div className="flex-1 relative">
            <textarea
              value={messageText}
              onChange={handleTyping}
              onKeyPress={handleKeyPress}
              placeholder="Type a message..."
              className="w-full bg-background border border-border rounded-lg px-4 py-3 pr-12 resize-none focus:outline-none focus:ring-2 focus:ring-primary focus:border-transparent"
              rows="1"
              style={{ minHeight: "44px", maxHeight: "120px" }}
            />
            <Button
              variant="ghost"
              size="icon"
              onClick={() => setShowEmojiPicker(!showEmojiPicker)}
              className="absolute right-2 top-1/2 -translate-y-1/2"
            >
              <Icon name="Smile" size={18} />
            </Button>
          </div>

          {/* Send Button */}
          <Button
            onClick={handleSendMessage}
            disabled={!messageText?.trim()}
            className="flex-shrink-0"
            size="icon"
          >
            <Icon name="Send" size={18} />
          </Button>
        </div>
      </div>
    </div>
  );
};

export default ChatArea;
