import React, { useState, useEffect } from "react";
import Icon from "../../../../components/AppIcon";
import Button from "../../../../components/ui/Button";

const MessageNotifications = ({
  notifications,
  onMarkAsRead,
  onMarkAllAsRead,
  onNotificationClick,
}) => {
  const [isVisible, setIsVisible] = useState(false);
  const [unreadCount, setUnreadCount] = useState(0);

  useEffect(() => {
    const unread = notifications?.filter((n) => !n?.isRead)?.length;
    setUnreadCount(unread);

    // Show notification popup for new messages
    if (unread > 0 && !isVisible) {
      setIsVisible(true);
      // Auto-hide after 5 seconds
      setTimeout(() => setIsVisible(false), 5000);
    }
  }, [notifications, isVisible]);

  const formatTime = (timestamp) => {
    const now = new Date();
    const notificationTime = new Date(timestamp);
    const diffInMinutes = (now - notificationTime) / (1000 * 60);

    if (diffInMinutes < 1) return "now";
    if (diffInMinutes < 60) return `${Math.floor(diffInMinutes)}m ago`;
    if (diffInMinutes < 1440) return `${Math.floor(diffInMinutes / 60)}h ago`;
    return notificationTime?.toLocaleDateString();
  };

  const getNotificationIcon = (type) => {
    switch (type) {
      case "message":
        return "MessageSquare";
      case "mention":
        return "AtSign";
      case "file":
        return "Paperclip";
      case "call":
        return "Phone";
      case "video":
        return "Video";
      default:
        return "Bell";
    }
  };

  const getNotificationColor = (type, priority) => {
    if (priority === "high") return "border-l-error";
    switch (type) {
      case "mention":
        return "border-l-warning";
      case "call":
      case "video":
        return "border-l-success";
      default:
        return "border-l-primary";
    }
  };

  // Floating notification popup
  const FloatingNotification = ({ notification }) => (
    <div className="fixed top-20 right-4 z-50 bg-card border border-border rounded-lg shadow-modal p-4 max-w-sm animate-slide-in-right">
      <div className="flex items-start space-x-3">
        <div className="flex-shrink-0">
          <div className="w-10 h-10 bg-primary/10 rounded-full flex items-center justify-center">
            <Icon
              name={getNotificationIcon(notification?.type)}
              size={18}
              className="text-primary"
            />
          </div>
        </div>

        <div className="flex-1 min-w-0">
          <h4 className="font-medium text-foreground text-sm">
            {notification?.title}
          </h4>
          <p className="text-sm text-muted-foreground mt-1 line-clamp-2">
            {notification?.message}
          </p>
          <span className="text-xs text-muted-foreground mt-2 block">
            {formatTime(notification?.timestamp)}
          </span>
        </div>

        <Button
          variant="ghost"
          size="icon"
          onClick={() => setIsVisible(false)}
          className="h-6 w-6 flex-shrink-0"
        >
          <Icon name="X" size={14} />
        </Button>
      </div>

      <div className="flex space-x-2 mt-3">
        <Button
          size="sm"
          onClick={() => {
            onNotificationClick(notification);
            setIsVisible(false);
          }}
          className="flex-1"
        >
          View
        </Button>
        <Button
          variant="outline"
          size="sm"
          onClick={() => {
            onMarkAsRead(notification?.id);
            setIsVisible(false);
          }}
        >
          Dismiss
        </Button>
      </div>
    </div>
  );

  return (
    <>
      {/* Floating Notification */}
      {isVisible && notifications?.filter((n) => !n?.isRead)?.length > 0 && (
        <FloatingNotification
          notification={notifications?.filter((n) => !n?.isRead)?.[0]}
        />
      )}
      {/* Notification Badge (for header integration) */}
      {unreadCount > 0 && (
        <div className="absolute -top-1 -right-1 bg-error text-error-foreground text-xs rounded-full w-5 h-5 flex items-center justify-center font-medium">
          {unreadCount > 99 ? "99+" : unreadCount}
        </div>
      )}
      {/* Notification Panel */}
      <div className="bg-card border border-border rounded-lg shadow-modal max-h-96 overflow-hidden">
        {/* Header */}
        <div className="p-4 border-b border-border">
          <div className="flex items-center justify-between">
            <h3 className="font-semibold text-foreground">Notifications</h3>
            {unreadCount > 0 && (
              <Button
                variant="ghost"
                size="sm"
                onClick={onMarkAllAsRead}
                className="text-xs"
              >
                Mark all read
              </Button>
            )}
          </div>
        </div>

        {/* Notifications List */}
        <div className="max-h-80 overflow-y-auto">
          {notifications?.length === 0 ? (
            <div className="p-6 text-center">
              <Icon
                name="Bell"
                size={48}
                className="mx-auto text-muted-foreground mb-2"
              />
              <p className="text-muted-foreground">No notifications</p>
            </div>
          ) : (
            <div className="divide-y divide-border">
              {notifications?.map((notification) => (
                <div
                  key={notification?.id}
                  onClick={() => onNotificationClick(notification)}
                  className={`p-4 hover:bg-muted cursor-pointer transition-colors duration-200 border-l-4 ${getNotificationColor(
                    notification?.type,
                    notification?.priority
                  )} ${!notification?.isRead ? "bg-accent/5" : ""}`}
                >
                  <div className="flex items-start space-x-3">
                    <div className="flex-shrink-0">
                      <div
                        className={`w-8 h-8 rounded-full flex items-center justify-center ${
                          !notification?.isRead ? "bg-primary/10" : "bg-muted"
                        }`}
                      >
                        <Icon
                          name={getNotificationIcon(notification?.type)}
                          size={16}
                          className={
                            !notification?.isRead
                              ? "text-primary"
                              : "text-muted-foreground"
                          }
                        />
                      </div>
                    </div>

                    <div className="flex-1 min-w-0">
                      <div className="flex items-center justify-between mb-1">
                        <h4
                          className={`font-medium text-sm ${
                            !notification?.isRead
                              ? "text-foreground"
                              : "text-muted-foreground"
                          }`}
                        >
                          {notification?.title}
                        </h4>
                        {!notification?.isRead && (
                          <div className="w-2 h-2 bg-primary rounded-full flex-shrink-0"></div>
                        )}
                      </div>

                      <p className="text-sm text-muted-foreground line-clamp-2 mb-2">
                        {notification?.message}
                      </p>

                      <div className="flex items-center justify-between">
                        <span className="text-xs text-muted-foreground">
                          {formatTime(notification?.timestamp)}
                        </span>

                        {notification?.priority === "high" && (
                          <span className="text-xs bg-error/10 text-error px-2 py-1 rounded-full font-medium">
                            Urgent
                          </span>
                        )}
                      </div>
                    </div>
                  </div>
                </div>
              ))}
            </div>
          )}
        </div>

        {/* Footer */}
        {notifications?.length > 0 && (
          <div className="p-3 border-t border-border">
            <Button variant="ghost" size="sm" className="w-full">
              View All Notifications
            </Button>
          </div>
        )}
      </div>
    </>
  );
};

export default MessageNotifications;
