import React, { useState } from 'react';
import Icon from '../../../components/AppIcon';
import Button from '../../../components/ui/Button';

const AnnouncementsWidget = () => {
  const [expandedAnnouncement, setExpandedAnnouncement] = useState(null);

  const announcements = [
    {
      id: 1,
      title: "Mid-Semester Break Schedule",
      content: `Dear Students,\n\nPlease note that the mid-semester break will be from August 15-22, 2025. All classes will resume on August 23rd. During this period, the library will have limited hours (9 AM - 5 PM) and the cafeteria will be closed.\n\nEnjoy your break!`,
      author: "Academic Office",
      date: "2025-07-30",
      priority: "high",
      category: "academic",
      readStatus: false,
      attachments: []
    },
    {
      id: 2,
      title: "New Online Learning Platform",
      content: `We're excited to announce the launch of our new online learning platform! This platform will provide enhanced features for course materials, assignments, and interactive learning.\n\nTraining sessions will be held next week. Please check your email for registration details.`,
      author: "IT Department",
      date: "2025-07-29",
      priority: "medium",
      category: "technology",
      readStatus: false,
      attachments: [
        { name: "Platform_Guide.pdf", size: "2.3 MB" }
      ]
    },
    {
      id: 3,
      title: "Student Council Elections",
      content: `Nominations for Student Council positions are now open! Interested candidates can submit their applications by August 5th, 2025.\n\nElections will be held on August 10th. Make your voice heard!`,
      author: "Student Affairs",
      date: "2025-07-28",
      priority: "medium",
      category: "events",
      readStatus: true,
      attachments: []
    },
    {
      id: 4,
      title: "Library Extended Hours",
      content: `Starting August 1st, the library will extend its operating hours during exam period:\n\nMonday-Friday: 7 AM - 11 PM\nWeekends: 9 AM - 9 PM\n\nAdditional study spaces have been arranged in the student center.`,
      author: "Library Services",
      date: "2025-07-27",
      priority: "low",
      category: "facilities",
      readStatus: true,
      attachments: []
    }
  ];

  const getPriorityColor = (priority) => {
    const colors = {
      high: 'text-error',
      medium: 'text-warning',
      low: 'text-success'
    };
    return colors[priority] || 'text-muted-foreground';
  };

  const getPriorityBg = (priority) => {
    const colors = {
      high: 'bg-error/10',
      medium: 'bg-warning/10',
      low: 'bg-success/10'
    };
    return colors[priority] || 'bg-muted';
  };

  const getCategoryIcon = (category) => {
    const icons = {
      academic: 'GraduationCap',
      technology: 'Monitor',
      events: 'Calendar',
      facilities: 'Building'
    };
    return icons[category] || 'Bell';
  };

  const toggleExpanded = (id) => {
    setExpandedAnnouncement(expandedAnnouncement === id ? null : id);
  };

  const formatDate = (dateString) => {
    const date = new Date(dateString);
    const today = new Date();
    const diffTime = today - date;
    const diffDays = Math.floor(diffTime / (1000 * 60 * 60 * 24));
    
    if (diffDays === 0) return 'Today';
    if (diffDays === 1) return 'Yesterday';
    if (diffDays < 7) return `${diffDays} days ago`;
    return date.toLocaleDateString();
  };

  return (
    <div className="bg-card rounded-lg border border-border shadow-subtle p-6">
      <div className="flex items-center justify-between mb-6">
        <div className="flex items-center space-x-3">
          <div className="w-10 h-10 bg-primary/10 rounded-lg flex items-center justify-center">
            <Icon name="Megaphone" size={20} color="var(--color-primary)" />
          </div>
          <div>
            <h2 className="text-lg font-semibold text-foreground">Announcements</h2>
            <p className="text-sm text-muted-foreground">
              {announcements.filter(a => !a.readStatus).length} unread
            </p>
          </div>
        </div>
        <Button variant="ghost" size="sm" iconName="Settings">
          Manage
        </Button>
      </div>

      <div className="space-y-4">
        {announcements.map((announcement) => (
          <div
            key={announcement.id}
            className={`p-4 rounded-lg border transition-smooth cursor-pointer ${
              !announcement.readStatus 
                ? 'bg-primary/5 border-primary/20 hover:bg-primary/10' :'bg-muted/30 border-border hover:bg-muted/50'
            }`}
            onClick={() => toggleExpanded(announcement.id)}
          >
            <div className="flex items-start justify-between mb-3">
              <div className="flex items-start space-x-3 flex-1">
                <div className="flex-shrink-0">
                  <div className={`w-10 h-10 rounded-lg flex items-center justify-center ${getPriorityBg(announcement.priority)}`}>
                    <Icon 
                      name={getCategoryIcon(announcement.category)} 
                      size={16} 
                      className={getPriorityColor(announcement.priority)}
                    />
                  </div>
                </div>
                
                <div className="flex-1 min-w-0">
                  <div className="flex items-center space-x-2 mb-1">
                    <h3 className={`text-sm font-medium truncate ${
                      !announcement.readStatus ? 'text-foreground' : 'text-muted-foreground'
                    }`}>
                      {announcement.title}
                    </h3>
                    {!announcement.readStatus && (
                      <div className="w-2 h-2 bg-primary rounded-full flex-shrink-0" />
                    )}
                  </div>
                  
                  <div className="flex items-center space-x-4 text-xs text-muted-foreground mb-2">
                    <span>{announcement.author}</span>
                    <span>•</span>
                    <span>{formatDate(announcement.date)}</span>
                    <span>•</span>
                    <span className={`capitalize ${getPriorityColor(announcement.priority)}`}>
                      {announcement.priority}
                    </span>
                  </div>

                  {expandedAnnouncement !== announcement.id && (
                    <p className="text-sm text-muted-foreground line-clamp-2">
                      {announcement.content.split('\n')[0]}
                    </p>
                  )}
                </div>
              </div>

              <div className="flex items-center space-x-2 ml-4">
                {announcement.attachments.length > 0 && (
                  <Icon name="Paperclip" size={14} className="text-muted-foreground" />
                )}
                <Icon 
                  name={expandedAnnouncement === announcement.id ? "ChevronUp" : "ChevronDown"} 
                  size={16} 
                  className="text-muted-foreground"
                />
              </div>
            </div>

            {expandedAnnouncement === announcement.id && (
              <div className="mt-4 pt-4 border-t border-border">
                <div className="prose prose-sm max-w-none">
                  {announcement.content.split('\n').map((paragraph, index) => (
                    <p key={index} className="text-sm text-foreground mb-2 last:mb-0">
                      {paragraph}
                    </p>
                  ))}
                </div>

                {announcement.attachments.length > 0 && (
                  <div className="mt-4">
                    <h4 className="text-sm font-medium text-foreground mb-2">Attachments:</h4>
                    <div className="space-y-2">
                      {announcement.attachments.map((attachment, index) => (
                        <div key={index} className="flex items-center space-x-2 p-2 bg-muted/50 rounded">
                          <Icon name="FileText" size={16} className="text-muted-foreground" />
                          <span className="text-sm text-foreground flex-1">{attachment.name}</span>
                          <span className="text-xs text-muted-foreground">{attachment.size}</span>
                          <Button variant="ghost" size="xs" iconName="Download">
                            Download
                          </Button>
                        </div>
                      ))}
                    </div>
                  </div>
                )}

                <div className="flex items-center justify-between mt-4 pt-3 border-t border-border">
                  <div className="flex items-center space-x-2">
                    <Button variant="ghost" size="xs" iconName="Bookmark">
                      Save
                    </Button>
                    <Button variant="ghost" size="xs" iconName="Share">
                      Share
                    </Button>
                  </div>
                  
                  {!announcement.readStatus && (
                    <Button variant="outline" size="xs" iconName="Check">
                      Mark as Read
                    </Button>
                  )}
                </div>
              </div>
            )}
          </div>
        ))}
      </div>

      <div className="mt-6 pt-4 border-t border-border">
        <Button variant="ghost" fullWidth iconName="Megaphone" iconPosition="left">
          View All Announcements
        </Button>
      </div>
    </div>
  );
};

export default AnnouncementsWidget;