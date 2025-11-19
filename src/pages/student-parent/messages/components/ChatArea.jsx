import React, { useState, useRef, useEffect } from "react";
import Icon from "../../../../components/AppIcon";
import Image from "../../../../components/AppImage";
import Button from "../../../../components/ui/Button";
import { listChats } from "../../../../services/messages/message.service";
import Loader from "../../../../components/ui/Loader";
import { useSocket } from "../../../../services/sockets/ws";
import { useDispatch } from "react-redux";
import { uploadAttachmentFlow } from "../../../../reducers/attachments/attachmentThunks";
import { errorToast, successToast } from "../../../../utils/utils";

const MAX_ATTACHMENT_BYTES = 100 * 1024 * 1024; // 100MB limit per file

const getAttachmentType = (mime = "", name = "") => {
  const normalizedMime = mime?.toLowerCase?.() || "";
  const extension = name?.split(".")?.pop()?.toLowerCase?.();

  if (normalizedMime.startsWith("image/")) return "image";
  if (normalizedMime.startsWith("video/")) return "video";
  if (normalizedMime.startsWith("audio/")) return "audio";

  if (extension) {
    if (["png", "jpg", "jpeg", "gif", "webp", "svg"].includes(extension))
      return "image";
    if (["mp4", "mov", "avi", "mkv", "webm"].includes(extension))
      return "video";
    if (["mp3", "wav", "aac", "flac", "ogg"].includes(extension))
      return "audio";
  }

  return "file";
};

const formatFileSize = (bytes) => {
  if (bytes === 0) return "0 Bytes";
  const k = 1024;
  const sizes = ["Bytes", "KB", "MB", "GB"];
  const i = Math.floor(Math.log(bytes) / Math.log(k));
  return Math.round((bytes / Math.pow(k, i)) * 100) / 100 + " " + sizes[i];
};

const ChatArea = ({ conversation, currentUser, onBack }) => {
  const dispatch = useDispatch();
  const [messageText, setMessageText] = useState("");
  const [showEmojiPicker, setShowEmojiPicker] = useState(false);
  const [typingUsers, setTypingUsers] = useState([]);
  const [dragOver, setDragOver] = useState(false);
  const [messages, setMessages] = useState([]);
  const [loading, setLoading] = useState(false);
  const [uploadingFiles, setUploadingFiles] = useState(false);
  const [uploadProgress, setUploadProgress] = useState({
    current: 0,
    total: 0,
    fileName: "",
  });

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

  useEffect(() => {
    if (!socket || !conversation?._id) return;

    const handleNewMessage = (message) => {
      if (message.thread === conversation._id) {
        setMessages((prev) => {
          // Check if this is replacing an optimistic message
          const optimisticIndex = prev.findIndex(
            (m) =>
              m._id?.startsWith("temp-") &&
              m.sender?._id === message.sender?._id &&
              m.thread === message.thread &&
              Math.abs(new Date(m.sentAt) - new Date(message.sentAt)) < 5000
          );

          if (optimisticIndex !== -1) {
            const updated = [...prev];
            updated[optimisticIndex] = message;
            return updated;
          }

          const exists = prev.some((m) => m._id === message._id);
          if (exists) return prev;

          return [...prev, message];
        });

        if (message.sender._id !== currentUser.id) {
          markAsRead(conversation._id, currentUser.id);
        }
      }
    };

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

    const handleMessagesRead = (data) => {
      if (data.threadId === conversation._id) {
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

    // Handle message status updates (when all participants have read)
    const handleMessageStatusUpdated = (data) => {
      if (data.threadId === conversation._id) {
        setMessages((prev) =>
          prev.map((msg) =>
            msg._id === data.messageId ? { ...msg, status: data.status } : msg
          )
        );
      }
    };

    socket.on("newMessage", handleNewMessage);
    socket.on("userTyping", handleUserTyping);
    socket.on("messagesRead", handleMessagesRead);
    socket.on("messageStatusUpdated", handleMessageStatusUpdated);

    return () => {
      socket.off("newMessage", handleNewMessage);
      socket.off("userTyping", handleUserTyping);
      socket.off("messagesRead", handleMessagesRead);
      socket.off("messageStatusUpdated", handleMessageStatusUpdated);
    };
  }, [socket, conversation?._id, currentUser, markAsRead]);

  // Auto-scroll to bottom
  useEffect(() => {
    messagesEndRef?.current?.scrollIntoView({ behavior: "smooth" });
  }, [messages]);

  // Handle sending text message
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
      messageData.type,
      []
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

  const handleTyping = (e) => {
    setMessageText(e.target.value);

    if (typingTimeoutRef.current) {
      clearTimeout(typingTimeoutRef.current);
    }

    sendTyping(conversation._id, currentUser.id, currentUser.name, true);

    typingTimeoutRef.current = setTimeout(() => {
      sendTyping(conversation._id, currentUser.id, currentUser.name, false);
    }, 2000);
  };

  const buildAttachmentPayload = (uploadedAttachment, file) => {
    if (!uploadedAttachment) return null;
    const attachmentId = uploadedAttachment?._id || uploadedAttachment?.id;
    if (!attachmentId) return null;

    const attachmentType = getAttachmentType(file?.type, file?.name);

    return {
      attachmentId,
      url:
        uploadedAttachment?.url ||
        uploadedAttachment?.location ||
        uploadedAttachment?.cdnUrl ||
        uploadedAttachment?.previewUrl ||
        "",
      name:
        uploadedAttachment?.filename ||
        uploadedAttachment?.fileName ||
        uploadedAttachment?.originalName ||
        file?.name ||
        "Attachment",
      mimeType:
        uploadedAttachment?.mimeType || uploadedAttachment?.mime || file?.type,
      size: uploadedAttachment?.size || file?.size,
      type: attachmentType,
    };
  };

  const handleFileUpload = async (e) => {
    const files = Array.from(e?.target?.files || []);
    await handleFilesUpload(files);
  };

  const handleFilesUpload = async (incomingFiles = []) => {
    if (!incomingFiles?.length) return;

    if (!conversation?._id) {
      errorToast("Please select a conversation first.");
      return;
    }

    const files = incomingFiles.filter(Boolean);

    // Validate file sizes
    const oversizedFile = files.find(
      (file) => file?.size > MAX_ATTACHMENT_BYTES
    );

    if (oversizedFile) {
      errorToast(
        `${oversizedFile?.name} exceeds the 100MB limit (${formatFileSize(
          oversizedFile?.size
        )})`
      );
      return;
    }

    setUploadingFiles(true);
    setUploadProgress({ current: 0, total: files.length, fileName: "" });

    try {
      const uploadedAttachments = [];

      // Upload files one by one
      for (let i = 0; i < files.length; i++) {
        const file = files[i];

        setUploadProgress({
          current: i + 1,
          total: files.length,
          fileName: file.name,
        });

        try {
          const uploaded = await dispatch(
            uploadAttachmentFlow({
              file,
              entityType: "MessageThread",
              entityId: conversation?._id,
              scope: "messages",
            })
          ).unwrap();

          const payload = buildAttachmentPayload(uploaded, file);
          if (payload) {
            uploadedAttachments.push(payload);
          }
        } catch (uploadError) {
          console.error(`Failed to upload ${file.name}:`, uploadError);
          errorToast(`Failed to upload ${file.name}`);
        }
      }

      if (!uploadedAttachments.length) {
        errorToast("Unable to upload any files. Please try again.");
        return;
      }
      const distinctTypes = Array.from(
        new Set(uploadedAttachments.map((item) => item.type))
      );
      const messageType =
        distinctTypes.length === 1 ? distinctTypes[0] : "file";

      const attachmentIds = uploadedAttachments.map(
        (item) => item.attachmentId
      );

      // Create optimistic message
      const tempMessageId = `temp-${Date.now()}-${Math.random()}`;
      const optimisticMessage = {
        _id: tempMessageId,
        thread: conversation._id,
        body: "",
        sender: {
          _id: currentUser.id,
          name: currentUser.name,
          profileImage: currentUser.profileImage,
        },
        sentAt: new Date().toISOString(),
        type: messageType,
        attachments: uploadedAttachments,
        status: "sending",
      };

      // Add to UI optimistically
      setMessages((prev) => [...prev, optimisticMessage]);

      // Send via socket
      const sent = sendMessage(
        conversation._id,
        "",
        currentUser.id,
        new Date().toISOString(),
        messageType,
        attachmentIds
      );

      if (!sent) {
        errorToast("Unable to send attachments. Please try again.");
        setMessages((prev) => prev.filter((m) => m._id !== tempMessageId));
      } else {
        successToast(
          `${uploadedAttachments.length} ${
            uploadedAttachments.length === 1 ? "file" : "files"
          } sent successfully`
        );
      }
    } catch (err) {
      console.error("Attachment upload failed:", err);
      errorToast(err?.message || "Failed to upload attachments.");
    } finally {
      setUploadingFiles(false);
      setUploadProgress({ current: 0, total: 0, fileName: "" });
      if (fileInputRef?.current) {
        fileInputRef.current.value = "";
      }
    }
  };

  const handleDragOver = (e) => {
    e?.preventDefault();
    if (!uploadingFiles) {
      setDragOver(true);
    }
  };

  const handleDragLeave = (e) => {
    e?.preventDefault();
    setDragOver(false);
  };

  const handleDrop = async (e) => {
    e?.preventDefault();
    setDragOver(false);
    const files = Array.from(e?.dataTransfer?.files || []);
    await handleFilesUpload(files);
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
    <div className="flex-1 flex flex-col bg-background relative h-full min-h-0">
      {/* Upload Progress Overlay */}
      {uploadingFiles && (
        <div className="absolute inset-0 bg-black/60 backdrop-blur-sm z-50 flex items-center justify-center">
          <div className="bg-card rounded-lg p-6 max-w-md w-full mx-4 shadow-2xl">
            <div className="flex items-center justify-center mb-4">
              <div className="w-12 h-12 border-4 border-primary border-t-transparent rounded-full animate-spin"></div>
            </div>
            <h3 className="text-lg font-semibold text-center mb-2">
              Uploading Files
            </h3>
            <p className="text-sm text-muted-foreground text-center mb-4">
              {uploadProgress.current} of {uploadProgress.total} files
            </p>
            {uploadProgress.fileName && (
              <div className="bg-muted rounded-lg p-3 mb-4">
                <p className="text-sm text-foreground truncate">
                  <Icon
                    name="File"
                    size={14}
                    className="inline mr-2 text-primary"
                  />
                  {uploadProgress.fileName}
                </p>
              </div>
            )}
            <div className="w-full bg-muted rounded-full h-2 overflow-hidden">
              <div
                className="bg-primary h-full transition-all duration-300 ease-out"
                style={{
                  width: `${
                    (uploadProgress.current / uploadProgress.total) * 100
                  }%`,
                }}
              ></div>
            </div>
            <p className="text-xs text-muted-foreground text-center mt-2">
              Please wait...
            </p>
          </div>
        </div>
      )}

      {/* Chat Header */}
      <div className="bg-card border-b border-border p-4 sticky top-0 z-20">
        <div className="flex items-center justify-between">
          <div className="flex items-center space-x-3">
            {onBack && (
              <button
                onClick={onBack}
                className="lg:hidden mr-2 inline-flex items-center justify-center w-10 h-10 rounded-full border border-border bg-background shadow-sm"
              >
                <Icon name="ArrowLeft" size={20} />
              </button>
            )}
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
                  ? (() => {
                      const other = conversation.participants.find(
                        (p) => p._id !== currentUser.id
                      );

                      if (other?.availabilityStatus === "online") {
                        return "Online";
                      }

                      return other?.lastSeen
                        ? `Last seen ${new Date(
                            other.lastSeen
                          ).toLocaleTimeString([], {
                            hour: "2-digit",
                            minute: "2-digit",
                          })}`
                        : "Offline";
                    })()
                  : `${conversation?.participants?.length} participants`}
              </p>
            </div>
          </div>
        </div>
      </div>

      {/* Messages Area */}
      <div
        className={`flex-1 min-h-0 overflow-y-auto p-4 space-y-4 ${
          dragOver ? "bg-primary/5 border-2 border-dashed border-primary" : ""
        }`}
        onDragOver={handleDragOver}
        onDragLeave={handleDragLeave}
        onDrop={handleDrop}
      >
        {dragOver && (
          <div className="absolute inset-0 flex items-center justify-center bg-primary/10 z-10 pointer-events-none">
            <div className="text-center">
              <Icon
                name="Upload"
                size={64}
                className="mx-auto text-primary mb-4"
              />
              <p className="text-primary font-medium text-lg">
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
                className={`flex max-w-[85%] sm:max-w-[70%] ${
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
                    {/* Attachments */}
                    {Array.isArray(message?.attachments) &&
                      message.attachments.length > 0 && (
                        <div
                          className={`space-y-2 ${
                            message?.body?.trim?.() ? "mb-2" : ""
                          }`}
                        >
                          {message.attachments.map((attachment, idx) => {
                            const attachmentType = getAttachmentType(
                              attachment?.mime || attachment?.mimeType,
                              attachment?.name || attachment?.filename
                            );
                            const key =
                              attachment?._id ||
                              attachment?.attachmentId ||
                              `${message?._id}-attachment-${idx}`;
                            const url =
                              attachment?.url ||
                              attachment?.location ||
                              attachment?.cdnUrl ||
                              attachment?.previewUrl;
                            const displayName =
                              attachment?.name ||
                              attachment?.filename ||
                              "Attachment";
                            if (attachmentType === "image" && url) {
                              return (
                                <Image
                                  key={key}
                                  src={url}
                                  alt={displayName}
                                  className="max-h-64 rounded-xl object-cover cursor-pointer hover:opacity-90 transition-opacity"
                                  onClick={() => window.open(url, "_blank")}
                                />
                              );
                            }

                            if (attachmentType === "video" && url) {
                              return (
                                <video
                                  key={key}
                                  controls
                                  className="max-h-64 rounded-xl"
                                >
                                  <source
                                    src={url}
                                    type={
                                      attachment?.mimeType ||
                                      attachment?.mime ||
                                      "video/mp4"
                                    }
                                  />
                                  Your browser does not support the video tag.
                                </video>
                              );
                            }

                            if (attachmentType === "audio" && url) {
                              return (
                                <audio key={key} controls className="w-full">
                                  <source
                                    src={url}
                                    type={
                                      attachment?.mimeType ||
                                      attachment?.mime ||
                                      "audio/mpeg"
                                    }
                                  />
                                  Your browser does not support the audio tag.
                                </audio>
                              );
                            }

                            return (
                              <a
                                key={key}
                                href={url || "#"}
                                target="_blank"
                                rel="noreferrer"
                                className={`flex items-center space-x-2 text-sm font-medium p-3 rounded-lg transition-colors ${
                                  isCurrentUser
                                    ? "bg-primary-foreground/10 hover:bg-primary-foreground/20 text-primary-foreground"
                                    : "bg-muted hover:bg-muted/80 text-foreground"
                                }`}
                              >
                                <Icon name="Paperclip" size={16} />
                                <div className="flex-1 min-w-0">
                                  <p className="truncate">{displayName}</p>
                                  {attachment?.size && (
                                    <p
                                      className={`text-xs ${
                                        isCurrentUser
                                          ? "text-primary-foreground/60"
                                          : "text-muted-foreground"
                                      }`}
                                    >
                                      {formatFileSize(attachment.size)}
                                    </p>
                                  )}
                                </div>
                                <Icon name="Download" size={16} />
                              </a>
                            );
                          })}
                        </div>
                      )}

                    {/* Message text */}
                    {message?.body?.trim?.() && (
                      <p className="whitespace-pre-wrap break-words">
                        {message?.body}
                      </p>
                    )}

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
            accept="image/*,video/*,audio/*,.pdf,.doc,.docx,.txt,.zip,.rar"
          />
          <Button
            variant="ghost"
            size="icon"
            onClick={() => !uploadingFiles && fileInputRef?.current?.click()}
            className="flex-shrink-0"
            disabled={uploadingFiles}
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
              disabled={uploadingFiles}
              className="w-full bg-background border border-border rounded-lg px-4 py-3 pr-12 resize-none focus:outline-none focus:ring-2 focus:ring-primary focus:border-transparent disabled:opacity-50 disabled:cursor-not-allowed"
              rows="1"
              style={{ minHeight: "44px", maxHeight: "120px" }}
            />
            <Button
              variant="ghost"
              size="icon"
              onClick={() => setShowEmojiPicker(!showEmojiPicker)}
              className="absolute right-2 top-1/2 -translate-y-1/2"
              disabled={uploadingFiles}
            >
              <Icon name="Smile" size={18} />
            </Button>
          </div>

          {/* Send Button */}
          <Button
            onClick={handleSendMessage}
            disabled={!messageText?.trim() || uploadingFiles}
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
