import React, { useState, useEffect } from 'react';
import Icon from '../../../components/AppIcon';

const RealtimeNotifications = () => {
  const [notifications, setNotifications] = useState([
    {
      id: 1,
      type: 'submission',
      title: 'New Assignment Submission',
      message: 'Emma Johnson submitted Quadratic Equations Worksheet',
      time: new Date(Date.now() - 300000),
      read: false,
      priority: 'medium'
    },
    {
      id: 2,
      type: 'message',
      title: 'Parent Message',
      message: 'Mrs. Chen wants to schedule a meeting about Michael\'s progress',
      time: new Date(Date.now() - 900000),
      read: false,
      priority: 'high'
    },
    {
      id: 3,
      type: 'system',
      title: 'Grade Book Updated',
      message: 'Physics Lab Report grades have been published',
      time: new Date(Date.now() - 1800000),
      read: true,
      priority: 'low'
    },
    {
      id: 4,
      type: 'reminder',
      title: 'Class Reminder',
      message: 'Grade 10A Mathematics class starts in 30 minutes',
      time: new Date(Date.now() - 3600000),
      read: true,
      priority: 'medium'
    }
  ]);

  const [showAll, setShowAll] = useState(false);

  const getNotificationIcon = (type) => {
    const iconMap = {
      submission: 'FileText',
      message: 'MessageSquare',
      system: 'Settings',
      reminder: 'Bell',
      grade: 'Award'
    };
    return iconMap[type] || 'Bell';
  };

  const getPriorityColor = (priority) => {
    switch (priority) {
      case 'high':
        return 'border-l-error bg-error/5';
      case 'medium':
        return 'border-l-warning bg-warning/5';
      case 'low':
        return 'border-l-success bg-success/5';
      default:
        return 'border-l-border bg-muted/5';
    }
  };

  const formatTime = (date) => {
    const now = new Date();
    const diff = now - date;
    const minutes = Math.floor(diff / 60000);
    const hours = Math.floor(diff / 3600000);
    const days = Math.floor(diff / 86400000);

    if (minutes < 60) return `${minutes}m ago`;
    if (hours < 24) return `${hours}h ago`;
    return `${days}d ago`;
  };

  const markAsRead = (id) => {
    setNotifications(prev =>
      prev.map(notif =>
        notif.id === id ? { ...notif, read: true } : notif
      )
    );
  };

  const unreadCount = notifications.filter(n => !n.read).length;
  const displayedNotifications = showAll ? notifications : notifications.slice(0, 3);

  return (
    <div className="bg-card rounded-lg border border-border p-6 shadow-subtle">
      <div className="flex items-center justify-between mb-6">
        <div className="flex items-center space-x-2">
          <h3 className="text-lg font-semibold text-foreground">Notifications</h3>
          {unreadCount > 0 && (
            <span className="bg-error text-error-foreground text-xs px-2 py-1 rounded-full">
              {unreadCount}
            </span>
          )}
        </div>
        <div className="flex items-center space-x-2">
          <button className="p-2 text-muted-foreground hover:text-foreground hover:bg-muted rounded-lg transition-smooth">
            <Icon name="Settings" size={16} />
          </button>
          <button className="p-2 text-muted-foreground hover:text-foreground hover:bg-muted rounded-lg transition-smooth">
            <Icon name="MoreHorizontal" size={16} />
          </button>
        </div>
      </div>

      <div className="space-y-3">
        {displayedNotifications.map((notification) => (
          <div
            key={notification.id}
            className={`p-4 rounded-lg border-l-4 transition-smooth cursor-pointer hover:bg-muted/30 ${
              getPriorityColor(notification.priority)
            } ${!notification.read ? 'bg-primary/5' : ''}`}
            onClick={() => markAsRead(notification.id)}
          >
            <div className="flex items-start space-x-3">
              <div className={`
                flex-shrink-0 w-8 h-8 rounded-full flex items-center justify-center
                ${!notification.read ? 'bg-primary/10' : 'bg-muted'}
              `}>
                <Icon 
                  name={getNotificationIcon(notification.type)} 
                  size={16} 
                  color={!notification.read ? 'var(--color-primary)' : 'var(--color-muted-foreground)'}
                />
              </div>
              
              <div className="flex-1 min-w-0">
                <div className="flex items-center justify-between">
                  <h4 className={`text-sm font-medium ${
                    !notification.read ? 'text-foreground' : 'text-muted-foreground'
                  }`}>
                    {notification.title}
                  </h4>
                  <span className="text-xs text-muted-foreground ml-2">
                    {formatTime(notification.time)}
                  </span>
                </div>
                <p className="mt-1 text-sm text-muted-foreground line-clamp-2">
                  {notification.message}
                </p>
                {!notification.read && (
                  <div className="flex items-center mt-2">
                    <div className="w-2 h-2 bg-primary rounded-full mr-2" />
                    <span className="text-xs text-primary">New</span>
                  </div>
                )}
              </div>
            </div>
          </div>
        ))}
      </div>

      {notifications.length === 0 && (
        <div className="text-center py-8">
          <Icon name="Bell" size={48} color="var(--color-muted-foreground)" />
          <h4 className="mt-4 text-lg font-medium text-foreground">No notifications</h4>
          <p className="mt-2 text-sm text-muted-foreground">
            You're all caught up! New notifications will appear here.
          </p>
        </div>
      )}

      {notifications.length > 3 && (
        <div className="mt-6 pt-4 border-t border-border">
          <button
            onClick={() => setShowAll(!showAll)}
            className="w-full flex items-center justify-center space-x-2 py-2 text-sm text-primary hover:bg-primary/10 rounded-lg transition-smooth"
          >
            <Icon name={showAll ? "ChevronUp" : "ChevronDown"} size={16} />
            <span>{showAll ? 'Show Less' : `View All (${notifications.length})`}</span>
          </button>
        </div>
      )}
    </div>
  );
};

export default RealtimeNotifications;