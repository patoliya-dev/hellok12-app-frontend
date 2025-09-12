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
        // room: "Virtual Room A"
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
        // room: "Virtual Room B"
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
        status: "completed",
        courseName: "Japanese Advanced",
        // room: "Virtual Room C"
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
    navigate("/student/lessons");
  };

  const handleSessionClick = (session) => {
    setSelectedSession(session);
  };

  const getStatusColor = (status) => {
    switch (status) {
      case "upcoming":
        return "bg-primary/10 text-primary border-primary/20";
      case "completed":
        return "bg-success/10 text-success border-success/20";
      case "cancelled":
        return "bg-error/10 text-error border-error/20";
      default:
        return "bg-muted text-muted-foreground border-border";
    }
  };

  const formatDateTime = (date, time) => {
    const dateObj = new Date(`${date}T${time}`);
    return {
      date: dateObj?.toLocaleDateString("en-US", {
        month: "short",
        day: "numeric",
      }),
      time: dateObj?.toLocaleTimeString("en-US", {
        hour: "numeric",
        minute: "2-digit",
        hour12: true,
      }),
    };
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
                    onClick={() => handleSessionClick(session)}
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
          ))}
        </div>
      )}
      {/* Session Detail Modal */}
      {/* The functional details modal */}
      {/* {selectedSession && <LessonDetailsModal 
        lesson={selectedSession} 
        onClose={() => setSelectedSession(null)} 
      />} */}
      {selectedSession && (
        <div className="fixed inset-0 bg-black/50 flex items-center justify-center z-50 p-4">
          <div className="bg-card rounded-lg border border-border w-full max-w-2xl max-h-[90vh] overflow-y-auto">
            {/* Modal Header */}
            <div className="flex items-center justify-between p-6 border-b border-border">
              <div>
                {/* <h2 className="text-xl font-semibold text-foreground">{selectedSession?.student}</h2> */}
                <p className="text-muted-foreground">Lesson Details</p>
              </div>
              <Button
                variant="ghost"
                size="sm"
                iconName="X"
                onClick={() => setSelectedSession(null)}
              />
            </div>

            {/* Modal Content */}
            <div className="p-6 space-y-6">
              {/* Session Details */}
              <div>
                <div className="flex justify-between items-center mb-4">
                  <h3 className="text-lg font-medium text-foreground">
                    {selectedSession.subject}
                  </h3>
                  <span className={`inline-block px-2 py-1 rounded-full text-xs font-medium border ${getStatusColor(selectedSession?.status)}`}>
                    {selectedSession?.status}
                  </span>
                </div>
                <div className="flex items-center space-x-3 p-[15px] px-[20px] bg-gray-100 rounded-lg sm:space-x-4 sm:p-5 sm:px-6">
                  <div className="w-12 h-12 rounded-full overflow-hidden bg-muted">
                    <Image
                      src={selectedSession.teacher.avatar}
                      alt={selectedSession.teacher.name}
                      className="w-full h-full object-cover"
                    />
                  </div>
                  <div>
                    <h3 className="font-medium text-foreground text-sm sm:text-base">
                      {selectedSession.subject}
                    </h3>
                    <p className="text-xs sm:text-sm text-muted-foreground">
                      {selectedSession.teacher.name}
                    </p>
                  </div>
                </div>

                <div className="grid grid-cols-2 gap-4">
                  <div>
                    <label className="text-sm font-medium text-foreground">
                      Date & Time
                    </label>
                    <p className="text-sm text-muted-foreground">
                      {
                        formatDateTime(
                          selectedSession?.date,
                          selectedSession?.time
                        )?.date
                      }{" "}
                      at{" "}
                      {
                        formatDateTime(
                          selectedSession?.date,
                          selectedSession?.time
                        )?.time
                      }
                    </p>
                  </div>
                  <div>
                    <label className="text-sm font-medium text-foreground">
                      Duration
                    </label>
                    <p className="text-sm text-muted-foreground">
                      {selectedSession?.duration} minutes
                    </p>
                  </div>
                  <div>
                    <label className="text-sm font-medium text-foreground">
                      Type
                    </label>
                    <p className="text-sm text-muted-foreground capitalize">
                      {selectedSession?.type}
                    </p>
                  </div>
                  {/* <div>
                    <label className="text-sm font-medium text-foreground">Status</label>
                    <span className={`inline-block px-2 py-1 rounded-full text-xs font-medium border ${getStatusColor(selectedSession?.status)}`}>
                      {selectedSession?.status}
                    </span>
                  </div> */}
                </div>
              </div>

              {/* Materials */}
              {selectedSession?.materials?.length > 0 && (
                <div>
                  <h3 className="text-lg font-medium text-foreground mb-4">
                    Session Materials
                  </h3>
                  <div className="space-y-2">
                    {selectedSession?.materials?.map((material, index) => (
                      <div
                        key={index}
                        className="flex items-center justify-between p-3 bg-muted/30 rounded-lg"
                      >
                        <div className="flex items-center space-x-2">
                          <Icon
                            name="FileText"
                            size={16}
                            className="text-muted-foreground"
                          />
                          <span className="text-sm text-foreground">
                            {material}
                          </span>
                        </div>
                        <Button variant="ghost" size="xs" iconName="Download">
                          Download
                        </Button>
                      </div>
                    ))}
                  </div>
                  <Button
                    variant="outline"
                    size="sm"
                    iconName="Share"
                    className="mt-3"
                    onClick={() => handleShareMaterials(selectedSession?.id)}
                  >
                    Share Additional Materials
                  </Button>
                </div>
              )}

              {/* Attendance & Feedback */}
              {selectedSession?.status === "completed" && (
                <div className="space-y-4">
                  <div>
                    <h3 className="text-lg font-medium text-foreground mb-4">
                      Session Summary
                    </h3>
                    <div className="space-y-3">
                      <div>
                        <label className="text-sm font-medium text-foreground">
                          Attendance
                        </label>
                        <p className="text-sm text-muted-foreground capitalize">
                          {selectedSession?.attendance}
                        </p>
                      </div>

                      {selectedSession?.feedback && (
                        <div>
                          <label className="text-sm font-medium text-foreground">
                            Feedback
                          </label>
                          <p className="text-sm text-muted-foreground">
                            {selectedSession?.feedback}
                          </p>
                        </div>
                      )}

                      {selectedSession?.rating && (
                        <div>
                          <label className="text-sm font-medium text-foreground">
                            Rating
                          </label>
                          <div className="flex items-center space-x-1 mt-1">
                            {Array.from({ length: 5 }, (_, i) => (
                              <Icon
                                key={i}
                                name="Star"
                                size={16}
                                className={
                                  i < selectedSession?.rating
                                    ? "text-accent fill-current"
                                    : "text-muted"
                                }
                              />
                            ))}
                            <span className="text-sm text-muted-foreground ml-2">
                              ({selectedSession?.rating}/5)
                            </span>
                          </div>
                        </div>
                      )}
                    </div>
                  </div>
                </div>
              )}
            </div>
          </div>
        </div>
      )}
    </div>
  );
};

export default UpcomingSessionsCard;
