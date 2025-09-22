import React, { useState } from "react";
import Icon from "../../../../components/AppIcon";
import Image from "../../../../components/AppImage";
import Button from "../../../../components/ui/Button";

const TodaySchedule = ({ sessions, onJoinSession, onCancelSession }) => {
  const [currentTime] = useState(new Date());

  const getSessionStatus = (session) => {
    const sessionTime = new Date(session.startTime);
    const endTime = new Date(sessionTime.getTime() + session.duration * 60000);
    const now = currentTime;

    if (now < sessionTime) {
      const minutesUntil = Math.floor((sessionTime - now) / (1000 * 60));
      if (minutesUntil <= 15)
        return { status: "starting-soon", text: `Starts in ${minutesUntil}m` };
      return {
        status: "upcoming",
        text: sessionTime.toLocaleTimeString([], {
          hour: "2-digit",
          minute: "2-digit",
        }),
      };
    } else if (now >= sessionTime && now <= endTime) {
      return { status: "ongoing", text: "In Progress" };
    } else {
      return { status: "completed", text: "Completed" };
    }
  };

  const getStatusColor = (status) => {
    switch (status) {
      case "starting-soon":
        return "text-warning";
      case "ongoing":
        return "text-success";
      case "completed":
        return "text-muted-foreground";
      default:
        return "text-primary";
    }
  };

  const getStatusBgColor = (status) => {
    switch (status) {
      case "starting-soon":
        return "bg-warning/10";
      case "ongoing":
        return "bg-success/10";
      case "completed":
        return "bg-muted/50";
      default:
        return "bg-primary/10";
    }
  };

  const sortedSessions = [...sessions].sort(
    (a, b) => new Date(a.startTime) - new Date(b.startTime)
  );

  return (
    <div className="bg-card rounded-lg border border-border p-6">
      <div className="flex items-center justify-between mb-4">
        <h3 className="text-lg font-semibold text-foreground">
          Today's Schedule
        </h3>
        <Button variant="ghost" size="sm">
          View All
        </Button>
      </div>

      {sortedSessions.length === 0 ? (
        <div className="text-center py-8">
          <Icon
            name="Calendar"
            size={48}
            color="var(--color-muted-foreground)"
          />
          <p className="text-muted-foreground mt-2">
            No sessions scheduled for today
          </p>
          <p className="text-sm text-muted-foreground">Enjoy your free day!</p>
        </div>
      ) : (
        <div className="space-y-4">
          {sortedSessions.map((session) => {
            const sessionStatus = getSessionStatus(session);

            return (
              <div
                key={session.id}
                className={`p-4 rounded-lg border transition-micro ${getStatusBgColor(
                  sessionStatus.status
                )}`}
              >
                <div className="flex items-start justify-between mb-3">
                  <div className="flex items-center space-x-3">
                    <Image
                      src={session.student.avatar}
                      alt={session.student.name}
                      className="w-10 h-10 rounded-full object-cover"
                    />
                    <div>
                      <h4 className="font-medium text-foreground">
                        {session.student.name}
                      </h4>
                      <p className="text-sm text-muted-foreground">
                        {session.subject}
                      </p>
                    </div>
                  </div>
                  <div className="text-right">
                    <div
                      className={`text-sm font-medium ${getStatusColor(
                        sessionStatus.status
                      )}`}
                    >
                      {sessionStatus.text}
                    </div>
                    <div className="text-xs text-muted-foreground">
                      {session.duration} minutes
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
                        {new Date(session.startTime).toLocaleTimeString([], {
                          hour: "2-digit",
                          minute: "2-digit",
                        })}{" "}
                        -{" "}
                        {new Date(
                          new Date(session.startTime).getTime() +
                            session.duration * 60000
                        ).toLocaleTimeString([], {
                          hour: "2-digit",
                          minute: "2-digit",
                        })}
                      </span>
                    </div>
                    <div className="flex items-center space-x-1">
                      <Icon
                        name="Video"
                        size={14}
                        color="var(--color-muted-foreground)"
                      />
                      <span className="text-muted-foreground">
                        {session.type}
                      </span>
                    </div>
                  </div>
                  <span className="text-success font-medium">
                    ${session.earnings}
                  </span>
                </div>

                <div className="flex space-x-2">
                  {sessionStatus.status === "starting-soon" && (
                    <Button
                      variant="default"
                      size="sm"
                      iconName="Video"
                      iconPosition="left"
                      iconSize={16}
                      onClick={() => onJoinSession(session)}
                      className="flex-1"
                    >
                      Join Session
                    </Button>
                  )}

                  {sessionStatus.status === "ongoing" && (
                    <Button
                      variant="success"
                      size="sm"
                      iconName="Video"
                      iconPosition="left"
                      iconSize={16}
                      onClick={() => onJoinSession(session)}
                      className="flex-1"
                    >
                      Rejoin Session
                    </Button>
                  )}

                  {sessionStatus.status === "upcoming" && (
                    <>
                      <Button
                        variant="outline"
                        size="sm"
                        iconName="MessageCircle"
                        iconPosition="left"
                        iconSize={16}
                        className="flex-1"
                      >
                        Message Student
                      </Button>
                      <Button
                        variant="outline"
                        size="sm"
                        iconName="X"
                        iconPosition="left"
                        iconSize={16}
                        onClick={() => onCancelSession(session)}
                        className="text-destructive hover:text-destructive"
                      >
                        Cancel
                      </Button>
                    </>
                  )}

                  {sessionStatus.status === "completed" && (
                    <Button
                      variant="outline"
                      size="sm"
                      iconName="FileText"
                      iconPosition="left"
                      iconSize={16}
                      className="flex-1"
                      onClick={() => {
                        alert("Feedback added successfully!");
                      }}
                    >
                      Add Feedback
                    </Button>
                  )}
                </div>
              </div>
            );
          })}
        </div>
      )}
    </div>
  );
};

export default TodaySchedule;
