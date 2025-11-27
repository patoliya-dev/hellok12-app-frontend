import React, { useState } from "react";
import Icon from "../../../../components/AppIcon";
import Image from "../../../../components/AppImage";
import Button from "../../../../components/ui/Button";
import LessonDetailsModal from "./LessonDetailsModal";

const TodaySchedule = ({
  sessions,
  onJoinSession,
  onCancelSession,
  onViewAllSchedules,
  onMessage,
}) => {
  const [selectedSession, setSelectedSession] = useState(null);
  const [isModalOpen, setIsModalOpen] = useState(false);

  const getSessionStatus = (session) => {
    // Remove 'Z' to treat as local time instead of UTC
    const localTimeString = session.startTime.replace('Z', '');
    const sessionTime = new Date(localTimeString);
    const endTime = new Date(sessionTime.getTime() + session.lesson.schedule.duration * 60000);
    const now = new Date();

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
      case "SCHEDULED":
        return "text-warning";
      case "ONGOING":
        return "text-success";
      case "COMPLETED":
        return "text-muted-foreground";
      default:
        return "text-primary";
    }
  };

  const getStatusBgColor = (status) => {
    switch (status) {
      case "SCHEDULED":
        return "bg-warning/10";
      case "ONGOING":
        return "bg-success/10";
      case "COMPLETED":
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
        <Button variant="ghost" size="sm" onClick={onViewAllSchedules}>
          View All
        </Button>
      </div>

      {sortedSessions.length === 0 ? (
        <div className="text-center py-8 flex items-center justify-center flex-col gap-5">
          <Icon
            name="Calendar"
            size={48}
            color="var(--color-muted-foreground)"
          />
          <div className='flex flex-col gap-2'>
            <p className="text-muted-foreground mt-2">
              No sessions scheduled for today
            </p>
            <p className="text-sm text-muted-foreground">Enjoy your free day!</p>
          </div>
        </div>
      ) : (
        <div className="space-y-4">
          {sortedSessions.map((session) => {
            const sessionStatus = getSessionStatus(session);
            return (
              <div
                key={session._id}
                className={`p-4 rounded-lg border transition-micro ${getStatusBgColor(
                  sessionStatus.status
                )}`}
              >
                <div className="flex items-start justify-between mb-3">
                  <div className="flex items-center space-x-3">
                    <Image
                      src={session?.course?.introImageRef?.url}
                      alt={session?.course?.title}
                      className="w-10 h-10 rounded-full object-cover"
                    />
                    <div>
                      <h4 className="font-medium text-foreground">
                        {session?.course?.title}
                      </h4>
                      <p className="text-sm text-muted-foreground">
                        {session?.lesson?.title}
                      </p>
                    </div>
                  </div>
                  <div className="text-right">
                    <div
                      className={`text-sm font-medium ${getStatusColor(
                        session.status
                      )}`}
                    >
                      {session?.status?.charAt(0).toUpperCase() + session?.status?.slice(1).toLowerCase()}
                    </div>
                    <div className="text-xs text-muted-foreground">
                      {session.lesson.schedule.duration} minutes
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
                        {new Date(session.startTime.replace('Z', '')).toLocaleTimeString([], {
                          hour: "2-digit",
                          minute: "2-digit",
                        })}{" "}
                        -{" "}
                        {new Date(
                          new Date(session.startTime.replace('Z', '')).getTime() +
                          session.lesson.schedule.duration * 60000
                        ).toLocaleTimeString([], {
                          hour: "2-digit",
                          minute: "2-digit",
                        })}
                      </span>
                    </div>
                    <div className="flex items-center space-x-1 inline-flex items-center gap-1.5 px-2.5 py-1 rounded-full text-xs font-medium border bg-blue-100 text-blue-700 border-blue-200">
                      <Icon
                        name="Video"
                        size={14}
                      />
                      <span className="">
                        {session.course.mode}
                      </span>
                    </div>
                  </div>
                  {/* <span className="text-success font-medium">
                    ${session.earnings}
                  </span> */}
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
                      className="flex-1 cursor-pointer"
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
                        onClick={onMessage}
                      >
                        Message Student
                      </Button>
                      {/* <Button
                        variant="outline"
                        size="sm"
                        iconName="X"
                        iconPosition="left"
                        iconSize={16}
                        onClick={() => onCancelSession(session)}
                        className="text-destructive hover:text-destructive"
                      >
                        Cancel
                      </Button> */}
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
                        // Transform session data to match LessonDetailsModal format
                        const lessonData = {
                          id: session?.id,
                          subject: session?.lesson?.title || "N/A",
                          title: session?.lesson?.title || "N/A",
                          description: session?.course?.description || "N/A",
                          teacher: {
                            name: session?.course.title || "N/A",
                            avatar: session?.course.introImageRef.url || "",
                          },
                          startTime: session?.lesson?.schedule?.time,
                          date: session?.lesson?.schedule?.date,
                          duration: session?.lesson?.schedule?.duration || 0,
                          status: session?.status?.toLowerCase() || "pending",
                          lessonDescription: session?.lesson?.description || "",
                          tags: [
                            ...(session?.course?.mode ? [session.course.mode.charAt(0).toUpperCase() + session.course.mode.slice(1)] : []),
                            ...(session?.lesson?.isTrialAvailable ? ['Trial Session'] : []),
                            ...(session?.course?.lessonType ? [session.course.lessonType.charAt(0).toUpperCase() + session.course.lessonType.slice(1)] : [])
                          ],
                          address: session?.lesson?.address || null,
                        };
                        setSelectedSession(lessonData);
                        setIsModalOpen(true);
                      }}
                    >
                      View Details
                    </Button>
                  )}
                </div>
              </div>
            );
          })}
        </div>
      )}

      {/* Lesson Details Modal */}
      {isModalOpen && selectedSession && (
        <LessonDetailsModal
          lesson={selectedSession}
          onClose={() => {
            setIsModalOpen(false);
            setSelectedSession(null);
          }}
        />
      )}
    </div>
  );
};

export default TodaySchedule;
