import React, { useState } from "react";
import Icon from "../../../../components/AppIcon";
import Image from "../../../../components/AppImage";
import Input from "../../../../components/ui/Input";
import Select from "../../../../components/ui/Select";
import Button from "../../../../components/ui/Button";

const ConversationList = ({
  conversations,
  activeConversation,

  onConversationSelect,
  searchQuery,
  onSearchChange,
  onGroupCreate,
}) => {
  const [buttonType, setButtonType] = useState("all");

  const filteredConversations = conversations?.filter((conv) => {
    const matchesSearch =
      conv?.name?.toLowerCase()?.includes(searchQuery?.toLowerCase()) ||
      conv?.lastMessage?.toLowerCase()?.includes(searchQuery?.toLowerCase());

    if (buttonType === "all") return matchesSearch;
    return matchesSearch && conv?.type === buttonType;
  });

  const formatTime = (timestamp) => {
    const now = new Date();
    const messageTime = new Date(timestamp);
    const diffInHours = (now - messageTime) / (1000 * 60 * 60);

    if (diffInHours < 1) {
      const minutes = Math.floor(diffInHours * 60);
      return minutes < 1 ? "now" : `${minutes}m`;
    } else if (diffInHours < 24) {
      return `${Math.floor(diffInHours)}h`;
    } else {
      return messageTime?.toLocaleDateString();
    }
  };

  const getConversationIcon = (type) => {
    switch (type) {
      case "direct":
        return "User";
      case "group":
        return "Users";
      case "announcements":
        return "Megaphone";
      default:
        return "MessageSquare";
    }
  };

  return (
    <div className="flex flex-col h-full bg-card border-r border-border">
      {/* Header */}
      <div className="p-4 border-b border-border">
        <h2 className="text-lg font-semibold text-foreground mb-4">Messages</h2>

        {/* Search */}
        <Input
          type="search"
          placeholder="Search conversations..."
          value={searchQuery}
          onChange={(e) => onSearchChange(e?.target?.value)}
          className="mb-3"
        />

        {/* Filter */}
        <div className="flex space-x-2">
          <Button
            size="sm"
            onClick={() => setButtonType("all")}
            className={`font-normal ${
              buttonType === "all"
                ? "bg-primary text-white"
                : "!bg-inherit text-black"
            }`}
          >
            All Messages
          </Button>
          <Button
            size="sm"
            onClick={() => setButtonType("group")}
            className={`font-normal ${
              buttonType === "group"
                ? "bg-primary text-white"
                : "!bg-inherit text-black"
            }`}
          >
            Group
          </Button>
        </div>
      </div>
      {/* Conversations List */}
      <div className="flex-1 overflow-y-auto">
        {filteredConversations?.length === 0 ? (
          <div className="p-4 text-center">
            <Icon
              name="MessageSquare"
              size={48}
              className="mx-auto text-muted-foreground mb-2"
            />
            <p className="text-muted-foreground">No conversations found</p>
          </div>
        ) : (
          <div className="space-y-1 p-2">
            {filteredConversations?.map((conversation) => (
              <div
                key={conversation?.id}
                onClick={() => onConversationSelect(conversation)}
                className={`flex items-center p-3 rounded-lg cursor-pointer transition-colors duration-200 ${
                  activeConversation?.id === conversation?.id
                    ? "bg-primary/10 border border-primary/20"
                    : "hover:bg-muted"
                }`}
              >
                {/* Avatar/Icon */}
                <div className="relative flex-shrink-0 mr-3">
                  {conversation?.type === "direct" ? (
                    <Image
                      src={conversation?.avatar}
                      alt={conversation?.name}
                      className="w-12 h-12 rounded-full object-cover"
                    />
                  ) : (
                    <div className="w-12 h-12 bg-secondary rounded-full flex items-center justify-center">
                      <Icon
                        name={getConversationIcon(conversation?.type)}
                        size={20}
                        className="text-secondary-foreground"
                      />
                    </div>
                  )}

                  {/* Online Status */}
                  {conversation?.isOnline &&
                    conversation?.type === "direct" && (
                      <div className="absolute -bottom-1 -right-1 w-4 h-4 bg-success rounded-full border-2 border-card"></div>
                    )}

                  {/* Priority Flag */}
                  {conversation?.isPriority && (
                    <div className="absolute -top-1 -right-1 w-4 h-4 bg-warning rounded-full flex items-center justify-center">
                      <Icon
                        name="AlertTriangle"
                        size={10}
                        className="text-warning-foreground"
                      />
                    </div>
                  )}
                </div>

                {/* Content */}
                <div className="flex-1 min-w-0">
                  <div className="flex items-center justify-between mb-1">
                    <h3
                      className={`font-medium truncate ${
                        conversation?.unreadCount > 0
                          ? "text-foreground"
                          : "text-foreground"
                      }`}
                    >
                      {conversation?.name}
                    </h3>
                    <span className="text-xs text-muted-foreground flex-shrink-0 ml-2">
                      {formatTime(conversation?.timestamp)}
                    </span>
                  </div>

                  <div className="flex items-center justify-between">
                    <p
                      className={`text-sm truncate ${
                        conversation?.unreadCount > 0
                          ? "text-foreground font-medium"
                          : "text-muted-foreground"
                      }`}
                    >
                      {conversation?.lastSender &&
                        conversation?.type !== "direct" && (
                          <span className="text-primary">
                            {conversation?.lastSender}:{" "}
                          </span>
                        )}
                      {conversation?.lastMessage}
                    </p>

                    {/* Unread Badge */}
                    {conversation?.unreadCount > 0 && (
                      <div className="bg-primary text-primary-foreground text-xs rounded-full px-2 py-1 ml-2 flex-shrink-0 min-w-[20px] text-center">
                        {conversation?.unreadCount > 99
                          ? "99+"
                          : conversation?.unreadCount}
                      </div>
                    )}
                  </div>

                  {/* Typing Indicator */}
                  {conversation?.isTyping && (
                    <div className="flex items-center mt-1">
                      <div className="flex space-x-1">
                        <div className="w-1 h-1 bg-primary rounded-full animate-bounce"></div>
                        <div
                          className="w-1 h-1 bg-primary rounded-full animate-bounce"
                          style={{ animationDelay: "0.1s" }}
                        ></div>
                        <div
                          className="w-1 h-1 bg-primary rounded-full animate-bounce"
                          style={{ animationDelay: "0.2s" }}
                        ></div>
                      </div>
                      <span className="text-xs text-primary ml-2">
                        typing...
                      </span>
                    </div>
                  )}
                </div>
              </div>
            ))}
          </div>
        )}
      </div>
      {/* New Message Button */}
      <div className="p-4 border-t border-border flex flex-col items-center gap-6">
        <button
          className="w-52 border border-primary text-primary rounded-lg py-2 px-4 flex items-center justify-center space-x-2 hover:bg-primary/90 transition-colors duration-200"
          onClick={onGroupCreate}
        >
          <Icon name="Users" size={16} />
          <span className="font-medium">New Group</span>
        </button>
        <button className="w-full bg-primary text-primary-foreground rounded-lg py-2 px-4 flex items-center justify-center space-x-2 hover:bg-primary/90 transition-colors duration-200">
          <Icon name="Plus" size={16} />
          <span className="font-medium">New Message</span>
        </button>
      </div>
    </div>
  );
};

export default ConversationList;
