import React, { useState, useRef, useEffect } from "react";
import Icon from "../../../../components/AppIcon";
import Image from "../../../../components/AppImage";
import Button from "../../../../components/ui/Button";

const ChatArea = ({ conversation, messages, onSendMessage, currentUser }) => {
  const [messageText, setMessageText] = useState("");
  const [showEmojiPicker, setShowEmojiPicker] = useState(false);
  const [isTyping, setIsTyping] = useState(false);
  const [dragOver, setDragOver] = useState(false);
  const messagesEndRef = useRef(null);
  const fileInputRef = useRef(null);

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

  useEffect(() => {
    messagesEndRef?.current?.scrollIntoView({ behavior: "smooth" });
  }, [messages]);

  const handleSendMessage = () => {
    if (messageText?.trim()) {
      onSendMessage({
        text: messageText,
        type: "text",
        timestamp: new Date(),
      });
      setMessageText("");
    }
  };

  const handleKeyPress = (e) => {
    if (e?.key === "Enter" && !e?.shiftKey) {
      e?.preventDefault();
      handleSendMessage();
    }
  };

  const handleFileUpload = (e) => {
    const files = Array.from(e?.target?.files);
    files?.forEach((file) => {
      onSendMessage({
        type: "file",
        file: file,
        fileName: file?.name,
        fileSize: file?.size,
        timestamp: new Date(),
      });
    });
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
    files?.forEach((file) => {
      onSendMessage({
        type: "file",
        file: file,
        fileName: file?.name,
        fileSize: file?.size,
        timestamp: new Date(),
      });
    });
  };

  const formatTime = (timestamp) => {
    return new Date(timestamp)?.toLocaleTimeString([], {
      hour: "2-digit",
      minute: "2-digit",
    });
  };

  const formatFileSize = (bytes) => {
    if (bytes === 0) return "0 Bytes";
    const k = 1024;
    const sizes = ["Bytes", "KB", "MB", "GB"];
    const i = Math.floor(Math.log(bytes) / Math.log(k));
    return parseFloat((bytes / Math.pow(k, i))?.toFixed(2)) + " " + sizes?.[i];
  };

  const getFileIcon = (fileName) => {
    const extension = fileName?.split(".")?.pop()?.toLowerCase();
    switch (extension) {
      case "pdf":
        return "FileText";
      case "doc":
      case "docx":
        return "FileText";
      case "jpg":
      case "jpeg":
      case "png":
      case "gif":
        return "Image";
      case "mp3":
      case "wav":
        return "Music";
      case "mp4":
      case "avi":
        return "Video";
      default:
        return "File";
    }
  };

  const handleReaction = (messageId, emoji) => {
    // Handle message reaction
    console.log("Reaction:", messageId, emoji);
  };

  if (!conversation) {
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

  return (
    <div className="flex-1 flex flex-col bg-background">
      {/* Chat Header */}
      <div className="bg-card border-b border-border p-4">
        <div className="flex items-center justify-between">
          <div className="flex items-center space-x-3">
            {conversation?.type === "direct" ? (
              <Image
                src={conversation?.avatar}
                alt={conversation?.name}
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
                {conversation?.name}
              </h3>
              <p className="text-sm text-muted-foreground">
                {conversation?.type === "direct"
                  ? conversation?.isOnline
                    ? "Online"
                    : "Last seen recently"
                  : `${conversation?.participantCount} participants`}
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
          const isCurrentUser = message?.senderId === currentUser?.id;
          const showAvatar =
            !isCurrentUser &&
            (index === 0 ||
              messages?.[index - 1]?.senderId !== message?.senderId);

          return (
            <div
              key={message?.id}
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
                    src={message?.senderAvatar}
                    alt={message?.senderName}
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
                      {message?.senderName}
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
                    {message?.type === "text" && (
                      <p className="whitespace-pre-wrap break-words">
                        {message?.content}
                      </p>
                    )}

                    {message?.type === "file" && (
                      <div className="flex items-center space-x-3">
                        <div
                          className={`p-2 rounded-lg ${
                            isCurrentUser
                              ? "bg-primary-foreground/20"
                              : "bg-muted"
                          }`}
                        >
                          <Icon
                            name={getFileIcon(message?.fileName)}
                            size={20}
                          />
                        </div>
                        <div className="flex-1 min-w-0">
                          <p className="font-medium truncate">
                            {message?.fileName}
                          </p>
                          <p className="text-xs opacity-75">
                            {formatFileSize(message?.fileSize)}
                          </p>
                        </div>
                        <Button variant="ghost" size="icon" className="h-8 w-8">
                          <Icon name="Download" size={14} />
                        </Button>
                      </div>
                    )}

                    {message?.type === "image" && (
                      <div className="max-w-xs">
                        <Image
                          src={message?.imageUrl}
                          alt="Shared image"
                          className="rounded-lg w-full h-auto"
                        />
                      </div>
                    )}

                    {/* Message Time */}
                    <div
                      className={`text-xs mt-1 ${
                        isCurrentUser
                          ? "text-primary-foreground/70"
                          : "text-muted-foreground"
                      }`}
                    >
                      {formatTime(message?.timestamp)}
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

                  {/* Message Reactions */}
                  {message?.reactions && message?.reactions?.length > 0 && (
                    <div className="flex flex-wrap gap-1 mt-1 ml-3">
                      {message?.reactions?.map((reaction, idx) => (
                        <button
                          key={idx}
                          onClick={() =>
                            handleReaction(message?.id, reaction?.emoji)
                          }
                          className="bg-muted hover:bg-muted/80 rounded-full px-2 py-1 text-xs flex items-center space-x-1 transition-colors duration-200"
                        >
                          <span>{reaction?.emoji}</span>
                          <span className="text-muted-foreground">
                            {reaction?.count}
                          </span>
                        </button>
                      ))}
                    </div>
                  )}
                </div>
              </div>
            </div>
          );
        })}

        {/* Typing Indicator */}
        {isTyping && (
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
                Someone is typing...
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
              onChange={(e) => setMessageText(e?.target?.value)}
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
