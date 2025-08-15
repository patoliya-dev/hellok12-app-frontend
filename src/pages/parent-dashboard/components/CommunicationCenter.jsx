import React, { useState } from 'react';
import Icon from '../../../components/AppIcon';
import Button from '../../../components/ui/Button';
import Image from '../../../components/AppImage';

const CommunicationCenter = () => {
  const [activeTab, setActiveTab] = useState('announcements');

  const announcements = [
    {
      id: 1,
      title: "Parent-Teacher Conference Schedule",
      message: "Parent-teacher conferences will be held from August 15-17. Please schedule your appointments through the parent portal.",
      date: "2025-07-30",
      priority: "high",
      from: "School Administration",
      read: false
    },
    {
      id: 2,
      title: "School Lunch Menu Update",
      message: "New healthy lunch options have been added to our menu starting next week. View the complete menu in the resources section.",
      date: "2025-07-29",
      priority: "medium",
      from: "Cafeteria Services",
      read: true
    },
    {
      id: 3,
      title: "Field Trip Permission Required",
      message: "Grade 8 students will visit the Science Museum on August 10. Permission slips must be submitted by August 5.",
      date: "2025-07-28",
      priority: "high",
      from: "Ms. Rodriguez",
      read: false
    }
  ];

  const messages = [
    {
      id: 1,
      from: "Ms. Rodriguez",
      subject: "Emma\'s Math Progress",
      preview: "I wanted to update you on Emma\'s excellent progress in algebra...",
      date: "2025-07-30",
      read: false,
      avatar: "https://images.unsplash.com/photo-1494790108755-2616b612b786?w=100&h=100&fit=crop&crop=face"
    },
    {
      id: 2,
      from: "Mr. Thompson",
      subject: "Science Project Reminder",
      preview: "Just a friendly reminder about the upcoming science project deadline...",
      date: "2025-07-29",
      read: true,
      avatar: "https://images.unsplash.com/photo-1472099645785-5658abf4ff4e?w=100&h=100&fit=crop&crop=face"
    },
    {
      id: 3,
      from: "School Nurse",
      subject: "Health Check Reminder",
      preview: "Annual health check-ups are due for all students...",
      date: "2025-07-28",
      read: true,
      avatar: "https://images.unsplash.com/photo-1559839734-2b71ea197ec2?w=100&h=100&fit=crop&crop=face"
    }
  ];

  const conferences = [
    {
      id: 1,
      teacher: "Ms. Rodriguez",
      subject: "Mathematics",
      date: "2025-08-15",
      time: "2:00 PM",
      duration: "15 minutes",
      status: "scheduled",
      avatar: "https://images.unsplash.com/photo-1494790108755-2616b612b786?w=100&h=100&fit=crop&crop=face"
    },
    {
      id: 2,
      teacher: "Mr. Thompson",
      subject: "Science",
      date: "2025-08-16",
      time: "10:30 AM",
      duration: "15 minutes",
      status: "pending",
      avatar: "https://images.unsplash.com/photo-1472099645785-5658abf4ff4e?w=100&h=100&fit=crop&crop=face"
    }
  ];

  const getPriorityBadge = (priority) => {
    const badges = {
      high: "bg-error/10 text-error border-error/20",
      medium: "bg-warning/10 text-warning border-warning/20",
      low: "bg-muted text-muted-foreground border-border"
    };
    return badges[priority] || badges.medium;
  };

  const getStatusBadge = (status) => {
    const badges = {
      scheduled: "bg-success/10 text-success border-success/20",
      pending: "bg-warning/10 text-warning border-warning/20",
      completed: "bg-muted text-muted-foreground border-border"
    };
    return badges[status] || badges.pending;
  };

  const renderAnnouncements = () => (
    <div className="space-y-4">
      {announcements.map((announcement) => (
        <div key={announcement.id} className={`p-4 rounded-lg border transition-smooth hover:shadow-subtle ${!announcement.read ? 'bg-primary/5 border-primary/20' : 'bg-card border-border'}`}>
          <div className="flex items-start justify-between mb-2">
            <div className="flex items-center space-x-2">
              <h3 className="font-medium text-foreground">{announcement.title}</h3>
              {!announcement.read && (
                <div className="w-2 h-2 bg-primary rounded-full"></div>
              )}
            </div>
            <div className={`px-2 py-1 rounded-full border text-xs font-medium ${getPriorityBadge(announcement.priority)}`}>
              {announcement.priority}
            </div>
          </div>
          <p className="text-sm text-muted-foreground mb-3">{announcement.message}</p>
          <div className="flex items-center justify-between text-xs text-muted-foreground">
            <span>From: {announcement.from}</span>
            <span>{new Date(announcement.date).toLocaleDateString()}</span>
          </div>
        </div>
      ))}
    </div>
  );

  const renderMessages = () => (
    <div className="space-y-4">
      {messages.map((message) => (
        <div key={message.id} className={`p-4 rounded-lg border transition-smooth hover:shadow-subtle cursor-pointer ${!message.read ? 'bg-primary/5 border-primary/20' : 'bg-card border-border'}`}>
          <div className="flex items-start space-x-3">
            <div className="w-10 h-10 rounded-full overflow-hidden bg-muted flex-shrink-0">
              <Image
                src={message.avatar}
                alt={message.from}
                className="w-full h-full object-cover"
              />
            </div>
            <div className="flex-1 min-w-0">
              <div className="flex items-center justify-between mb-1">
                <h3 className="font-medium text-foreground truncate">{message.from}</h3>
                <div className="flex items-center space-x-2">
                  {!message.read && (
                    <div className="w-2 h-2 bg-primary rounded-full"></div>
                  )}
                  <span className="text-xs text-muted-foreground">{new Date(message.date).toLocaleDateString()}</span>
                </div>
              </div>
              <h4 className="text-sm font-medium text-foreground mb-1">{message.subject}</h4>
              <p className="text-sm text-muted-foreground line-clamp-2">{message.preview}</p>
            </div>
          </div>
        </div>
      ))}
    </div>
  );

  const renderConferences = () => (
    <div className="space-y-4">
      {conferences.map((conference) => (
        <div key={conference.id} className="p-4 rounded-lg border border-border bg-card transition-smooth hover:shadow-subtle">
          <div className="flex items-start space-x-3">
            <div className="w-12 h-12 rounded-full overflow-hidden bg-muted flex-shrink-0">
              <Image
                src={conference.avatar}
                alt={conference.teacher}
                className="w-full h-full object-cover"
              />
            </div>
            <div className="flex-1">
              <div className="flex items-center justify-between mb-2">
                <div>
                  <h3 className="font-medium text-foreground">{conference.teacher}</h3>
                  <p className="text-sm text-muted-foreground">{conference.subject}</p>
                </div>
                <div className={`px-2 py-1 rounded-full border text-xs font-medium ${getStatusBadge(conference.status)}`}>
                  {conference.status}
                </div>
              </div>
              <div className="flex items-center space-x-4 text-sm text-muted-foreground mb-3">
                <div className="flex items-center space-x-1">
                  <Icon name="Calendar" size={14} />
                  <span>{new Date(conference.date).toLocaleDateString()}</span>
                </div>
                <div className="flex items-center space-x-1">
                  <Icon name="Clock" size={14} />
                  <span>{conference.time}</span>
                </div>
                <div className="flex items-center space-x-1">
                  <Icon name="Timer" size={14} />
                  <span>{conference.duration}</span>
                </div>
              </div>
              <div className="flex items-center space-x-2">
                {conference.status === 'pending' && (
                  <Button variant="outline" size="sm" iconName="Calendar">
                    Schedule
                  </Button>
                )}
                <Button variant="ghost" size="sm" iconName="MessageSquare">
                  Message
                </Button>
              </div>
            </div>
          </div>
        </div>
      ))}
      
      <Button variant="outline" fullWidth iconName="Plus">
        Request New Conference
      </Button>
    </div>
  );

  return (
    <div className="bg-card rounded-lg border border-border shadow-subtle">
      <div className="p-6 border-b border-border">
        <h2 className="text-lg font-semibold text-foreground mb-4">Communication Center</h2>
        
        <div className="flex space-x-1 bg-muted p-1 rounded-lg">
          {[
            { key: 'announcements', label: 'Announcements', icon: 'Megaphone' },
            { key: 'messages', label: 'Messages', icon: 'MessageSquare' },
            { key: 'conferences', label: 'Conferences', icon: 'Calendar' }
          ].map((tab) => (
            <button
              key={tab.key}
              onClick={() => setActiveTab(tab.key)}
              className={`flex-1 flex items-center justify-center space-x-2 px-3 py-2 rounded-md text-sm font-medium transition-smooth ${
                activeTab === tab.key
                  ? 'bg-surface text-foreground shadow-sm'
                  : 'text-muted-foreground hover:text-foreground'
              }`}
            >
              <Icon name={tab.icon} size={16} />
              <span>{tab.label}</span>
            </button>
          ))}
        </div>
      </div>

      <div className="p-6 max-h-96 overflow-y-auto">
        {activeTab === 'announcements' && renderAnnouncements()}
        {activeTab === 'messages' && renderMessages()}
        {activeTab === 'conferences' && renderConferences()}
      </div>
    </div>
  );
};

export default CommunicationCenter;