import React from 'react';
import Icon from '../../../components/AppIcon';
import Button from '../../../components/ui/Button';

const UpcomingSessionsWidget = () => {
  const upcomingSessions = [
    {
      id: 1,
      subject: "Mathematics",
      teacher: "Dr. Sarah Johnson",
      time: "09:00 AM",
      duration: "1 hour",
      location: "Room 204",
      type: "in-person",
      status: "upcoming",
      joinLink: "#"
    },
    {
      id: 2,
      subject: "Physics",
      teacher: "Prof. Michael Chen",
      time: "11:30 AM",
      duration: "1.5 hours",
      location: "Virtual Classroom",
      type: "online",
      status: "upcoming",
      joinLink: "#"
    },
    {
      id: 3,
      subject: "English Literature",
      teacher: "Ms. Emily Davis",
      time: "02:00 PM",
      duration: "45 minutes",
      location: "Room 101",
      type: "in-person",
      status: "upcoming",
      joinLink: "#"
    },
    {
      id: 4,
      subject: "Chemistry Lab",
      teacher: "Dr. Robert Wilson",
      time: "03:30 PM",
      duration: "2 hours",
      location: "Lab 3",
      type: "in-person",
      status: "upcoming",
      joinLink: "#"
    }
  ];

  const getSessionIcon = (type) => {
    return type === 'online' ? 'Video' : 'MapPin';
  };

  const getStatusColor = (status) => {
    const colors = {
      upcoming: 'text-primary',
      live: 'text-success',
      completed: 'text-muted-foreground'
    };
    return colors[status] || 'text-muted-foreground';
  };

  return (
    <div className="bg-card rounded-lg border border-border shadow-subtle p-6">
      <div className="flex items-center justify-between mb-6">
        <div className="flex items-center space-x-3">
          <div className="w-10 h-10 bg-primary/10 rounded-lg flex items-center justify-center">
            <Icon name="Calendar" size={20} color="var(--color-primary)" />
          </div>
          <div>
            <h2 className="text-lg font-semibold text-foreground">Upcoming Sessions</h2>
            <p className="text-sm text-muted-foreground">Today's schedule</p>
          </div>
        </div>
        <Button variant="ghost" size="sm" iconName="MoreHorizontal">
          More
        </Button>
      </div>

      <div className="space-y-4">
        {upcomingSessions.slice(0, 4).map((session) => (
          <div
            key={session.id}
            className="flex items-center justify-between p-4 bg-muted/30 rounded-lg hover:bg-muted/50 transition-smooth"
          >
            <div className="flex items-center space-x-4 flex-1">
              <div className="flex-shrink-0">
                <div className="w-12 h-12 bg-surface rounded-lg border border-border flex items-center justify-center">
                  <Icon 
                    name={getSessionIcon(session.type)} 
                    size={20} 
                    className={getStatusColor(session.status)}
                  />
                </div>
              </div>
              
              <div className="flex-1 min-w-0">
                <div className="flex items-center space-x-2 mb-1">
                  <h3 className="text-sm font-medium text-foreground truncate">
                    {session.subject}
                  </h3>
                  {session.type === 'online' && (
                    <span className="inline-flex items-center px-2 py-1 rounded-full text-xs bg-primary/10 text-primary">
                      <Icon name="Video" size={12} className="mr-1" />
                      Online
                    </span>
                  )}
                </div>
                <p className="text-xs text-muted-foreground mb-1">{session.teacher}</p>
                <div className="flex items-center space-x-4 text-xs text-muted-foreground">
                  <span className="flex items-center">
                    <Icon name="Clock" size={12} className="mr-1" />
                    {session.time} ({session.duration})
                  </span>
                  <span className="flex items-center">
                    <Icon name={getSessionIcon(session.type)} size={12} className="mr-1" />
                    {session.location}
                  </span>
                </div>
              </div>
            </div>

            <div className="flex items-center space-x-2 ml-4">
              {session.type === 'online' ? (
                <Button variant="default" size="sm" iconName="Video" iconPosition="left">
                  Join
                </Button>
              ) : (
                <Button variant="outline" size="sm" iconName="MapPin" iconPosition="left">
                  Locate
                </Button>
              )}
            </div>
          </div>
        ))}
      </div>

      <div className="mt-6 pt-4 border-t border-border">
        <Button variant="ghost" fullWidth iconName="Calendar" iconPosition="left">
          View Full Schedule
        </Button>
      </div>
    </div>
  );
};

export default UpcomingSessionsWidget;