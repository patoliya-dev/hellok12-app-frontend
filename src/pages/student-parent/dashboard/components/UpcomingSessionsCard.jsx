import React, { useState, useEffect } from "react";
import { useNavigate } from "react-router-dom";
import Icon from "../../../../components/AppIcon";
import Image from "../../../../components/AppImage";
import Button from "../../../../components/ui/Button";
import { CourseIcon } from 'components/icons';
import LessonDetailsModal from "./LessonDetailsModal";

const UpcomingSessionsCard = () => {
  const [upcomingSessions, setUpcomingSessions] = useState([]);
  const [currentTime, setCurrentTime] = useState(new Date());
  const [selectedSession, setSelectedSession] = useState(null);
  const navigate = useNavigate();

  useEffect(() => {
    // Update current time every minute
    const timer = setInterval(() => {
      setCurrentTime(new Date());
    }, 60000);

    return () => clearInterval(timer);
  }, []);

  useEffect(() => {
    // Mock upcoming sessions data
    const mockSessions = [
      {
        id: 1,
        subject: "English Literature",
        teacher: {
          name: "Ms. Sarah Johnson",
          avatar:
            "https://images.unsplash.com/photo-1494790108755-2616b612b786?w=150&h=150&fit=crop&crop=face",
        },
        startTime: new Date(Date.now() + 15 * 60 * 1000), // 15 minutes from now
        duration: 60,
        type: "video-call",
        meetingLink: "https://meet.google.com/abc-defg-hij",
        status: "starting-soon",
        courseName: "English 101",
        tags: ["1-on-1", "Online Course"],
        description: "A deep dive into Shakespeare's sonnets and their impact on modern literature.",
        address: "19 Washington Square N, New York, NY 10011, USA"
      },
      {
        id: 2,
        subject: "Spanish Conversation",
        teacher: {
          name: "Mr. Carlos Rodriguez",
          avatar:
            "https://images.unsplash.com/photo-1472099645785-5658abf4ff4e?w=150&h=150&fit=crop&crop=face",
        },
        startTime: new Date(Date.now() + 2 * 60 * 60 * 1000), // 2 hours from now
        duration: 45,
        type: "video-call",
        meetingLink: "https://meet.google.com/xyz-uvwx-yz",
        status: "scheduled",
        courseName: "Spanish Basics",
        tags: ["Trial Lessons", "1-on-1"],
        description: "Practice conversational Spanish with a native speaker. Focus on pronunciation and common phrases.",
      },
      {
        id: 3,
        subject: "Japanese Writing",
        teacher: {
          name: "Ms. Yuki Tanaka",
          avatar:
            "https://images.unsplash.com/photo-1438761681033-6461ffad8d80?w=150&h=150&fit=crop&crop=face",
        },
        startTime: new Date(Date.now() + 24 * 60 * 60 * 1000), // Tomorrow
        duration: 90,
        type: "video-call",
        meetingLink: "https://meet.google.com/def-ghij-klm",
        status: "scheduled",
        courseName: "Japanese Advanced",
        tags: ["Curriculum-Aligned Games", "Online Course"],
        description: "Learn advanced Kanji and writing techniques through interactive exercises.",
      }
    ];

    setUpcomingSessions(mockSessions);
  }, []);

  const getTimeUntilSession = (startTime) => {
    const diff = startTime.getTime() - currentTime.getTime();
    const minutes = Math.floor(diff / (1000 * 60));
    const hours = Math.floor(minutes / 60);
    const days = Math.floor(hours / 24);

    if (days > 0) return `${days}d ${hours % 24}h`;
    if (hours > 0) return `${hours}h ${minutes % 60}m`;
    if (minutes > 0) return `${minutes}m`;
    return "Starting now";
  };

  const handleJoinSession = (session) => {
    if (session.meetingLink) {
      window.open(session.meetingLink, "_blank");
    }
  };

  const handleViewSchedule = () => {
    navigate("/student-parent/lessons");
  };

  const handleSessionClick = (session) => {
    setSelectedSession(session);
  };

  return (
    <div className="bg-card rounded-lg border border-border p-6">
      <div className="flex items-center justify-between mb-6">
        <div className="flex items-center space-x-2">
          <Icon name="CalendarClock" size={24} color="var(--color-primary)" />
          <h2 className="text-xl font-semibold text-foreground">
            Upcoming Lessons
          </h2>
        </div>
        <Button
          variant="outline"
          size="sm"
          iconName="Calendar"
          iconPosition="left"
          iconSize={16}
          onClick={handleViewSchedule}
        >
          View All
        </Button>
      </div>

      {upcomingSessions.length === 0 ? (
        <div className="text-center py-8">
          <Icon
            name="Calendar"
            size={48}
            color="var(--color-muted-foreground)"
          />
          <p className="text-muted-foreground mt-4">No upcoming sessions</p>
          <p className="text-sm text-muted-foreground">
            Book a session to get started!
          </p>
          <Button
            variant="default"
            size="sm"
            iconName="Plus"
            iconPosition="left"
            iconSize={16}
            onClick={handleViewSchedule}
            className="mt-4"
          >
            Book Session
          </Button>
        </div>
      ) : (
        <div className="space-y-4">
          {upcomingSessions.slice(0, 3).map((session) => (
            <div
              key={session.id}
              className={`p-4 rounded-lg border transition-micro ${session.status === 'starting-soon' ? 'border-warning bg-warning/5' : 'border-border bg-muted/30'
                }`}
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
                  <div className={`text-sm font-medium ${session.status === 'starting-soon' ? 'text-warning' : 'text-primary'
                    }`}>
                    {getTimeUntilSession(session.startTime)}
                  </div>
                  <div className="text-xs text-muted-foreground">
                    {session.startTime.toLocaleTimeString([], {
                      hour: '2-digit',
                      minute: '2-digit',
                      hour12: true
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
                ) : (<div className="flex-1"></div>)}
                <Button
                  variant="ghost"
                  size="sm"
                  iconName="ReceiptText"
                  iconPosition="left"
                  iconSize={16}
                  onClick={() => handleSessionClick(session)}
                >
                  View Details
                </Button>

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
          ))}
        </div>
      )}

      {/* Session Detail Modal */}
      {selectedSession && (
        <LessonDetailsModal
          lesson={selectedSession}
          onClose={() => setSelectedSession(null)}
        />
      )}
    </div>
  );
};

export default UpcomingSessionsCard;
