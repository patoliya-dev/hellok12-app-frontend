import React, { useState, useEffect } from 'react';
import Icon from '../AppIcon';
import Button from './Button';

const NotificationCenter = ({ isOpen, onClose, userRole = 'student' }) => {
  const [notifications, setNotifications] = useState([]);
  const [unreadCount, setUnreadCount] = useState(0);

  useEffect(() => {
    // Simulate role-based notifications
    const mockNotifications = {
      student: [
        {
          id: 1,
          type: 'session',
          title: 'Class Starting Soon',
          message: 'Your English lesson with Ms. Smith starts in 15 minutes',
          time: '2 min ago',
          read: false,
          icon: 'Clock',
          color: 'text-warning'
        },
        {
          id: 2,
          type: 'achievement',
          title: 'New Badge Earned!',
          message: 'Congratulations! You earned the "Reading Champion" badge',
          time: '1 hour ago',
          read: false,
          icon: 'Award',
          color: 'text-success'
        },
        {
          id: 3,
          type: 'message',
          title: 'Message from Teacher',
          message: 'Great job on your homework assignment!',
          time: '3 hours ago',
          read: true,
          icon: 'MessageCircle',
          color: 'text-primary'
        }
      ],
      parent: [
        {
          id: 1,
          type: 'booking',
          title: 'Session Confirmed',
          message: 'Math tutoring session booked for Emma on Dec 15, 3:00 PM',
          time: '5 min ago',
          read: false,
          icon: 'CheckCircle',
          color: 'text-success'
        },
        {
          id: 2,
          type: 'payment',
          title: 'Payment Due',
          message: 'Monthly subscription payment of $89 is due tomorrow',
          time: '2 hours ago',
          read: false,
          icon: 'CreditCard',
          color: 'text-warning'
        },
        {
          id: 3,
          type: 'progress',
          title: 'Weekly Progress Report',
          message: 'Emma completed 4 sessions this week with excellent progress',
          time: '1 day ago',
          read: true,
          icon: 'TrendingUp',
          color: 'text-primary'
        }
      ],
      teacher: [
        {
          id: 1,
          type: 'booking',
          title: 'New Session Request',
          message: 'Parent has requested a session for tomorrow at 4:00 PM',
          time: '10 min ago',
          read: false,
          icon: 'Calendar',
          color: 'text-primary'
        },
        {
          id: 2,
          type: 'payment',
          title: 'Payment Received',
          message: 'You earned $45 from completed sessions this week',
          time: '1 hour ago',
          read: false,
          icon: 'DollarSign',
          color: 'text-success'
        },
        {
          id: 3,
          type: 'system',
          title: 'Schedule Updated',
          message: 'Your availability for next week has been confirmed',
          time: '4 hours ago',
          read: true,
          icon: 'Settings',
          color: 'text-muted-foreground'
        }
      ],
      admin: [
        {
          id: 1,
          type: 'system',
          title: 'New Teacher Application',
          message: '3 new teacher applications require review and approval',
          time: '30 min ago',
          read: false,
          icon: 'UserPlus',
          color: 'text-primary'
        },
        {
          id: 2,
          type: 'report',
          title: 'Monthly Report Ready',
          message: 'November performance report is available for download',
          time: '2 hours ago',
          read: false,
          icon: 'FileText',
          color: 'text-success'
        },
        {
          id: 3,
          type: 'alert',
          title: 'System Maintenance',
          message: 'Scheduled maintenance on Dec 20, 2:00 AM - 4:00 AM',
          time: '1 day ago',
          read: true,
          icon: 'AlertTriangle',
          color: 'text-warning'
        }
      ]
    };

    const roleNotifications = mockNotifications[userRole] || [];
    setNotifications(roleNotifications);
    setUnreadCount(roleNotifications.filter(n => !n.read).length);
  }, [userRole]);

  const markAsRead = (id) => {
    setNotifications(prev => 
      prev.map(notification => 
        notification.id === id 
          ? { ...notification, read: true }
          : notification
      )
    );
    setUnreadCount(prev => Math.max(0, prev - 1));
  };

  const markAllAsRead = () => {
    setNotifications(prev => 
      prev.map(notification => ({ ...notification, read: true }))
    );
    setUnreadCount(0);
  };

  const clearAll = () => {
    setNotifications([]);
    setUnreadCount(0);
  };

  if (!isOpen) return null;

  return (
    <>
      {/* Mobile Overlay */}
      <div 
        className="fixed inset-0 bg-black bg-opacity-50 z-1100 lg:hidden"
        onClick={onClose}
      />
      
      {/* Notification Panel */}
      <div className="fixed top-16 right-0 w-full h-full bg-card border-l border-border z-1200 lg:absolute lg:top-full lg:right-0 lg:w-96 lg:h-auto lg:max-h-96 lg:rounded-lg lg:shadow-modal lg:border">
        {/* Header */}
        <div className="flex items-center justify-between p-4 border-b border-border">
          <div className="flex items-center space-x-2">
            <Icon name="Bell" size={20} color="var(--color-foreground)" />
            <h3 className="font-semibold text-foreground">Notifications</h3>
            {unreadCount > 0 && (
              <span className="bg-error text-error-foreground text-xs px-2 py-1 rounded-full font-medium">
                {unreadCount}
              </span>
            )}
          </div>
          <div className="flex items-center space-x-1">
            {notifications.length > 0 && (
              <Button
                variant="ghost"
                size="sm"
                onClick={markAllAsRead}
                className="text-xs"
              >
                Mark all read
              </Button>
            )}
            <Button
              variant="ghost"
              size="icon"
              iconName="X"
              iconSize={16}
              onClick={onClose}
            />
          </div>
        </div>

        {/* Notifications List */}
        <div className="overflow-y-auto max-h-80">
          {notifications.length === 0 ? (
            <div className="flex flex-col items-center justify-center py-8 text-center">
              <Icon name="Bell" size={48} color="var(--color-muted-foreground)" />
              <p className="text-muted-foreground mt-2">No notifications</p>
              <p className="text-sm text-muted-foreground">You're all caught up!</p>
            </div>
          ) : (
            <div className="divide-y divide-border">
              {notifications.map((notification) => (
                <div
                  key={notification.id}
                  className={`p-4 hover:bg-muted transition-micro cursor-pointer ${
                    !notification.read ? 'bg-muted/50' : ''
                  }`}
                  onClick={() => markAsRead(notification.id)}
                >
                  <div className="flex items-start space-x-3">
                    <div className={`mt-1 ${notification.color}`}>
                      <Icon name={notification.icon} size={16} />
                    </div>
                    <div className="flex-1 min-w-0">
                      <div className="flex items-center justify-between">
                        <p className={`text-sm font-medium ${
                          !notification.read ? 'text-foreground' : 'text-muted-foreground'
                        }`}>
                          {notification.title}
                        </p>
                        {!notification.read && (
                          <div className="w-2 h-2 bg-primary rounded-full ml-2 flex-shrink-0" />
                        )}
                      </div>
                      <p className="text-sm text-muted-foreground mt-1 line-clamp-2">
                        {notification.message}
                      </p>
                      <p className="text-xs text-muted-foreground mt-2">
                        {notification.time}
                      </p>
                    </div>
                  </div>
                </div>
              ))}
            </div>
          )}
        </div>

        {/* Footer */}
        {notifications.length > 0 && (
          <div className="p-4 border-t border-border">
            <Button
              variant="ghost"
              size="sm"
              onClick={clearAll}
              className="w-full text-destructive hover:text-destructive"
            >
              Clear all notifications
            </Button>
          </div>
        )}
      </div>
    </>
  );
};

export default NotificationCenter;