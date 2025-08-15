import React, { useState } from 'react';
import Icon from '../AppIcon';

const NotificationPanel = ({ isOpen, onClose, userRole = 'student' }) => {
  const [activeTab, setActiveTab] = useState('all');
  const [notifications, setNotifications] = useState([
    {
      id: 1,
      type: 'assignment',
      title: 'New Assignment Posted',
      message: 'Mathematics homework due tomorrow',
      time: '2 hours ago',
      read: false,
      priority: 'high'
    },
    {
      id: 2,
      type: 'grade',
      title: 'Grade Updated',
      message: 'Your Science quiz has been graded',
      time: '4 hours ago',
      read: false,
      priority: 'medium'
    },
    {
      id: 3,
      type: 'announcement',
      title: 'School Event',
      message: 'Parent-teacher conference next week',
      time: '1 day ago',
      read: true,
      priority: 'low'
    },
    {
      id: 4,
      type: 'message',
      title: 'Message from Teacher',
      message: 'Please review the study materials',
      time: '2 days ago',
      read: true,
      priority: 'medium'
    }
  ]);

  const getNotificationIcon = (type) => {
    const iconMap = {
      assignment: 'FileText',
      grade: 'Award',
      announcement: 'Megaphone',
      message: 'MessageSquare',
      event: 'Calendar',
      payment: 'CreditCard'
    };
    return iconMap[type] || 'Bell';
  };

  const getPriorityColor = (priority) => {
    const colorMap = {
      high: 'text-error',
      medium: 'text-warning',
      low: 'text-muted-foreground'
    };
    return colorMap[priority] || 'text-muted-foreground';
  };

  const markAsRead = (id) => {
    setNotifications(prev => 
      prev.map(notif => 
        notif.id === id ? { ...notif, read: true } : notif
      )
    );
  };

  const markAllAsRead = () => {
    setNotifications(prev => 
      prev.map(notif => ({ ...notif, read: true }))
    );
  };

  const deleteNotification = (id) => {
    setNotifications(prev => prev.filter(notif => notif.id !== id));
  };

  const filteredNotifications = notifications.filter(notif => {
    if (activeTab === 'all') return true;
    if (activeTab === 'unread') return !notif.read;
    return notif.type === activeTab;
  });

  const unreadCount = notifications.filter(n => !n.read).length;

  if (!isOpen) return null;

  return (
    <>
      {/* Mobile Backdrop */}
      <div 
        className="fixed inset-0 bg-black/50 z-50 lg:hidden"
        onClick={onClose}
      />

      {/* Notification Panel */}
      <div className="fixed top-16 right-0 bottom-0 w-full max-w-md bg-surface border-l border-border shadow-modal z-50 lg:max-w-sm">
        <div className="flex flex-col h-full">
          {/* Header */}
          <div className="flex items-center justify-between p-4 border-b border-border">
            <div className="flex items-center space-x-2">
              <h2 className="text-lg font-semibold text-foreground">Notifications</h2>
              {unreadCount > 0 && (
                <span className="bg-primary text-primary-foreground text-xs px-2 py-1 rounded-full">
                  {unreadCount}
                </span>
              )}
            </div>
            <div className="flex items-center space-x-2">
              {unreadCount > 0 && (
                <button
                  onClick={markAllAsRead}
                  className="text-xs text-primary hover:text-primary/80 transition-smooth"
                >
                  Mark all read
                </button>
              )}
              <button
                onClick={onClose}
                className="p-1 text-muted-foreground hover:text-foreground hover:bg-muted rounded transition-smooth"
              >
                <Icon name="X" size={16} />
              </button>
            </div>
          </div>

          {/* Filter Tabs */}
          <div className="flex border-b border-border">
            {['all', 'unread', 'assignment', 'grade'].map((tab) => (
              <button
                key={tab}
                onClick={() => setActiveTab(tab)}
                className={`
                  flex-1 px-3 py-2 text-sm font-medium capitalize transition-smooth
                  ${activeTab === tab 
                    ? 'text-primary border-b-2 border-primary' :'text-muted-foreground hover:text-foreground'
                  }
                `}
              >
                {tab}
              </button>
            ))}
          </div>

          {/* Notifications List */}
          <div className="flex-1 overflow-y-auto">
            {filteredNotifications.length === 0 ? (
              <div className="flex flex-col items-center justify-center h-full p-8 text-center">
                <Icon name="Bell" size={48} color="var(--color-muted-foreground)" />
                <h3 className="mt-4 text-lg font-medium text-foreground">No notifications</h3>
                <p className="mt-2 text-sm text-muted-foreground">
                  You're all caught up! Check back later for updates.
                </p>
              </div>
            ) : (
              <div className="divide-y divide-border">
                {filteredNotifications.map((notification) => (
                  <div
                    key={notification.id}
                    className={`
                      p-4 hover:bg-muted/50 transition-smooth cursor-pointer
                      ${!notification.read ? 'bg-primary/5 border-l-4 border-l-primary' : ''}
                    `}
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
                          <h4 className={`
                            text-sm font-medium truncate
                            ${!notification.read ? 'text-foreground' : 'text-muted-foreground'}
                          `}>
                            {notification.title}
                          </h4>
                          <div className="flex items-center space-x-1 ml-2">
                            <Icon 
                              name="Circle" 
                              size={8} 
                              className={getPriorityColor(notification.priority)}
                            />
                            <button
                              onClick={(e) => {
                                e.stopPropagation();
                                deleteNotification(notification.id);
                              }}
                              className="p-1 text-muted-foreground hover:text-error transition-smooth"
                            >
                              <Icon name="X" size={12} />
                            </button>
                          </div>
                        </div>
                        <p className="mt-1 text-sm text-muted-foreground line-clamp-2">
                          {notification.message}
                        </p>
                        <p className="mt-2 text-xs text-muted-foreground">
                          {notification.time}
                        </p>
                      </div>
                    </div>
                  </div>
                ))}
              </div>
            )}
          </div>

          {/* Footer Actions */}
          <div className="p-4 border-t border-border">
            <button className="w-full px-4 py-2 text-sm text-primary hover:bg-primary/10 rounded-lg transition-smooth">
              View All Notifications
            </button>
          </div>
        </div>
      </div>
    </>
  );
};

export default NotificationPanel;