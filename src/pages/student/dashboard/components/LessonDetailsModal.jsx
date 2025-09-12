import React from 'react';
import Image from "../../../../components/AppImage";
import Icon from "../../../../components/AppIcon";
import Button from "../../../../components/ui/Button";
import { CourseIcon } from 'components/icons';

const SessionCard = ({ session, getTimeUntilSession, onViewDetails }) => {

  const getStatusColor = (status) => {
    switch (status) {
      case "starting-soon":
        return "text-warning";
      case "scheduled":
        return "text-primary";
      case "completed":
        return "text-success";
      case "cancelled":
        return "text-error";
      default:
        return "text-muted-foreground";
    }
  };

  const getCardBgColor = (status) => {
    switch (status) {
      case "starting-soon":
        return "border-warning bg-warning/5";
      default:
        return "border-border bg-muted/30";
    }
  };

  const handleJoinSession = (session) => {
    if (session.meetingLink) {
      // In a real app, this would redirect to the meeting link
      alert(`Joining session for: ${session.subject}`);
    }
  };

  return (
    <div
      key={session.id}
      className={`p-4 rounded-lg border transition-micro ${getCardBgColor(session.status)}`}
    >
      <div className="flex items-center justify-between mb-3">
        <div className="flex items-center space-x-3">
          <div className="w-12 h-12 rounded-full overflow-hidden bg-muted">
            <Image
              src={session.teacher.avatar}
              alt={session.teacher.name}
              className="w-full h-full object-cover"
            />
          </div>
          <div>
            <h3 className="font-medium text-foreground">
              {session.subject}
            </h3>
            <p className="text-sm text-muted-foreground">
              {session.teacher.name}
            </p>
          </div>
        </div>

        <div className="text-right">
          <div className={`text-sm font-medium ${getStatusColor(session.status)}`}>
            {getTimeUntilSession(session.startTime)}
          </div>
          <div className="text-xs text-muted-foreground">
            {session.startTime.toLocaleTimeString([], {
              hour: '2-digit',
              minute: '2-digit'
            })}
          </div>
        </div>
      </div>

      <div className="flex items-center justify-between text-sm mb-3">
        <div className="flex items-center space-x-4">
          <div className="flex items-center space-x-1">
            <Icon
              name="Clock"
              size={14}
              color="var(--color-muted-foreground)"
            />
            <span className="text-muted-foreground">
              {session.duration} min
            </span>
          </div>
          <div className="flex items-center space-x-1">
            <CourseIcon selected={false} />
            <span className="text-muted-foreground">{session.courseName}</span>
          </div>
        </div>

        {session.status === 'starting-soon' && (
          <div className="flex items-center space-x-1 text-warning">
            <Icon name="AlertCircle" size={14} />
            <span className="text-xs font-medium">Starting Soon</span>
          </div>
        )}
      </div>

      <div className="flex space-x-2">
        {session.status === "starting-soon" ? (
          <Button
            variant="default"
            size="sm"
            iconName="Video"
            iconPosition="left"
            iconSize={16}
            onClick={() => handleJoinSession(session)}
            className="flex-1"
          >
            Join Now
          </Button>
        ) : (
          <Button
            variant="outline"
            size="sm"
            iconName="Calendar"
            iconPosition="left"
            iconSize={16}
            onClick={() => onViewDetails(session)}
            className="flex-1"
          >
            View Details
          </Button>
        )}

        <Button
          variant="ghost"
          size="sm"
          iconName="MessageCircle"
          iconPosition="left"
          iconSize={16}
        >
          Message
        </Button>
      </div>
    </div>
  );
};

export default SessionCard;
