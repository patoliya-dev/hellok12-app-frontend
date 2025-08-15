import React, { useState } from 'react';
import Icon from '../../../components/AppIcon';
import Button from '../../../components/ui/Button';

const NotificationsPanelWidget = () => {
  const [activeFilter, setActiveFilter] = useState('all');
  const [notifications, setNotifications] = useState([
    {
      id: 1,
      type: 'assignment',
      title: 'New Assignment Posted',
      message: 'Mathematics homework due tomorrow at 11:59 PM',
      time: '2 hours ago',
      read: false,
      priority: 'high',
      actionRequired: true
    },
    {
      id: 2,
      type: 'grade',
      title: 'Grade Updated',
      message: 'Your Physics quiz has been graded - Score: 87/100',
      time: '4 hours ago',
      read: false,
      priority: 'medium',
      actionRequired: false
    },
    {
      id: 3,
      type: 'announcement',
      title: 'Class Schedule Change',
      message: 'Chemistry lab moved to Room 205 for tomorrow',
      time: '6 hours ago',
      read: true,
      priority: 'medium',
      actionRequired: false
    },
    {
      id: 4,
      type: 'message',
      title: 'Message from Dr. Johnson',
      message: 'Please review the study materials before next class',
      time: '1 day ago',
      read: true,
      priority: 'low',
      actionRequired: false
    },
    {
      id: 5,
      type: 'event',
      title: 'Upcoming Event',
      message: 'Science fair registration closes in 3 days',
      time: '1 day ago',
      read: false,
      priority: 'medium',
      actionRequired: true
    }
  ]);

  const getNotificationIcon = (type) => {
    const iconMap = {
      assignment: 'FileText',
      grade: 'Award',
      announcement: 'Megaphone',
      message: 'MessageSquare',
      event: 'Calendar'
    };
    return iconMap[type] || 'Bell';
  };

  const getPriorityColor = (priority) => {
    const colorMap = {
      high: 'text-error',
      medium: 'text-warning',
      low: 'text-success'
    };
    return colorMap[priority] || 'text-muted-foreground';
  };

  const getPriorityBg = (priority) => {
    const colorMap = {
      high: 'bg-error/10',
      medium: 'bg-warning/10',
      low: 'bg-success/10'
    };
    return colorMap[priority] || 'bg-muted';
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
    if (activeFilter === 'all') return true;
    if (activeFilter === 'unread') return !notif.read;
    if (activeFilter === 'action') return notif.actionRequired;
    return notif.type === activeFilter;
  });

  const unreadCount = notifications.filter(n => !n.read).length;
  const actionRequiredCount = notifications.filter(n => n.actionRequired && !n.read).length;

  const filters = [
    { key: 'all', label: 'All', count: notifications.length },
    { key: 'unread', label: 'Unread', count: unreadCount },
    { key: 'action', label: 'Action Required', count: actionRequiredCount },
    { key: 'assignment', label: 'Assignments', count: notifications.filter(n => n.type === 'assignment').length }
  ];

  return (
    <div className="bg-card rounded-lg border border-border shadow-subtle p-6">
      <div className="flex items-center justify-between mb-6">
        <div className="flex items-center space-x-3">
          <div className="w-10 h-10 bg-primary/10 rounded-lg flex items-center justify-center relative">
            <Icon name="Bell" size={20} color="var(--color-primary)" />
            {unreadCount > 0 && (
              <span className="absolute -top-1 -right-1 w-5 h-5 bg-error text-white text-xs rounded-full flex items-center justify-center">
                {unreadCount > 9 ? '9+' : unreadCount}
              </span>
            )}
          </div>
          <div>
            <h2 className="text-lg font-semibold text-foreground">Notifications</h2>
            <p className="text-sm text-muted-foreground">
              {unreadCount} unread, {actionRequiredCount} need action
            </p>
          </div>
        </div>
        <div className="flex items-center space-x-2">
          {unreadCount > 0 && (
            <Button variant="ghost" size="sm" onClick={markAllAsRead}>
              Mark all read
            </Button>
          )}
          <Button variant="ghost" size="sm" iconName="Settings">
            Settings
          </Button>
        </div>
      </div>

      {/* Filter Tabs */}
      <div className="flex space-x-1 mb-6 bg-muted p-1 rounded-lg">
        {filters.map((filter) => (
          <button
            key={filter.key}
            onClick={() => setActiveFilter(filter.key)}
            className={`
              flex-1 px-3 py-2 text-sm font-medium rounded-md transition-smooth
              ${activeFilter === filter.key 
                ? 'bg-surface text-foreground shadow-sm' 
                : 'text-muted-foreground hover:text-foreground'
              }
            `}
          >
            <span className="truncate">{filter.label}</span>
            {filter.count > 0 && (
              <span className={`ml-2 px-2 py-1 text-xs rounded-full ${
                activeFilter === filter.key 
                  ? 'bg-primary/10 text-primary' :'bg-muted-foreground/10 text-muted-foreground'
              }`}>
                {filter.count}
              </span>
            )}
          </button>
        ))}
      </div>

      {/* Notifications List */}
      <div className="space-y-3 max-h-96 overflow-y-auto">
        {filteredNotifications.length === 0 ? (
          <div className="text-center py-8">
            <Icon name="Bell" size={48} color="var(--color-muted-foreground)" />
            <h3 className="mt-4 text-lg font-medium text-foreground">No notifications</h3>
            <p className="mt-2 text-sm text-muted-foreground">
              You're all caught up! Check back later for updates.
            </p>
          </div>
        ) : (
          filteredNotifications.map((notification) => (
            <div
              key={notification.id}
              className={`
                p-4 rounded-lg border transition-smooth cursor-pointer group
                ${!notification.read 
                  ? 'bg-primary/5 border-primary/20 hover:bg-primary/10' :'bg-muted/30 border-border hover:bg-muted/50'
                }
                ${notification.actionRequired && !notification.read ? 'ring-2 ring-warning/20' : ''}
              `}
              onClick={() => markAsRead(notification.id)}
            >
              <div className="flex items-start space-x-3">
                <div className="flex-shrink-0">
                  <div className={`w-10 h-10 rounded-lg flex items-center justify-center ${getPriorityBg(notification.priority)}`}>
                    <Icon 
                      name={getNotificationIcon(notification.type)} 
                      size={16} 
                      className={getPriorityColor(notification.priority)}
                    />
                  </div>
                </div>
                
                <div className="flex-1 min-w-0">
                  <div className="flex items-center justify-between mb-1">
                    <h4 className={`text-sm font-medium truncate ${
                      !notification.read ? 'text-foreground' : 'text-muted-foreground'
                    }`}>
                      {notification.title}
                    </h4>
                    <div className="flex items-center space-x-2 ml-2">
                      {notification.actionRequired && !notification.read && (
                        <span className="inline-flex items-center px-2 py-1 rounded-full text-xs bg-warning/10 text-warning">
                          Action Required
                        </span>
                      )}
                      {!notification.read && (
                        <div className="w-2 h-2 bg-primary rounded-full" />
                      )}
                    </div>
                  </div>
                  
                  <p className="text-sm text-muted-foreground mb-2 line-clamp-2">
                    {notification.message}
                  </p>
                  
                  <div className="flex items-center justify-between">
                    <span className="text-xs text-muted-foreground">
                      {notification.time}
                    </span>
                    
                    <div className="flex items-center space-x-1 opacity-0 group-hover:opacity-100 transition-smooth">
                      {notification.actionRequired && (
                        <Button variant="ghost" size="xs" iconName="ExternalLink">
                          View
                        </Button>
                      )}
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
                </div>
              </div>
            </div>
          ))
        )}
      </div>

      <div className="mt-6 pt-4 border-t border-border">
        <Button variant="ghost" fullWidth iconName="Bell" iconPosition="left">
          View All Notifications
        </Button>
      </div>
    </div>
  );
};

export default NotificationsPanelWidget;