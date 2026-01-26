import React, { useState, useEffect } from "react";
import { useNavigate } from "react-router-dom";
import { useSelector } from "react-redux";
import Icon from "../../../../components/AppIcon";
import Image from "../../../../components/AppImage";
import Button from "../../../../components/ui/Button";
import { CourseIcon } from "components/icons";
import LessonDetailsModal from "./LessonDetailsModal";
import { selectAuthUser } from "reducers/auth/authSelectors";
import { getRolePath } from "../../../../utils/rolePath";
import { getLessonsForStudent } from "../../../../services/lessons/lesson.service";
import Loader from "components/ui/Loader";
import { formatTimeToTZ, getUserTimezone } from "../../../../utils/timezone";

const UpcomingSessionsCard = ({ role }) => {
  const [upcomingSessions, setUpcomingSessions] = useState([]);
  const [currentTime, setCurrentTime] = useState(new Date());
  const [selectedSession, setSelectedSession] = useState(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);
  const navigate = useNavigate();
  const authUser = useSelector(selectAuthUser);
  const userTimezone = getUserTimezone();
  const selectedChildId = useSelector((state) => state.profile.selectedChildId);

  useEffect(() => {
    // Update current time every minute
    const timer = setInterval(() => {
      setCurrentTime(new Date());
    }, 60000);

    return () => clearInterval(timer);
  }, []);

  useEffect(() => {
    const fetchLessons = async () => {
      try {
        setLoading(true);
        setError(null);

        // Determine which student ID to use based on role
        const isParent = authUser?.role === "parent";
        const studentId = isParent ? selectedChildId : authUser?.id;

        // Don't fetch if we don't have a valid student ID
        if (!studentId) {
          setUpcomingSessions([]);
          setLoading(false);
          return;
        }

        const response = await getLessonsForStudent({ studentId });

        // Transform API response to match component's expected format
        const transformedSessions = (response?.data || []).map((session) => {
          // session.start is expected to be an ISO UTC string from API, e.g. "2025-12-03T11:30:00.000Z"
          const sessionIso =
            session?.start ||
            session?.startAt ||
            session?.startTime ||
            session?.start; // defensive
          const sessionTime = sessionIso ? new Date(sessionIso) : null;

          // compute minutesUntil using instants (no timezone math) — Date.getTime() is epoch ms
          const now = Date.now();
          const minutesUntil = sessionTime
            ? Math.floor((sessionTime.getTime() - now) / (1000 * 60))
            : null;

          let status = "scheduled";
          if (minutesUntil !== null && minutesUntil <= 15 && minutesUntil > 0) {
            status = "starting-soon";
          }

          const formattedTime = sessionTime.toLocaleTimeString("en-US", {
            hour: "numeric",
            minute: "2-digit",
            hour12: true,
          });

          return {
            id: session._id,
            subject: session?.course?.title || "N/A",
            teacher: {
              _id: session?.lesson?.teacherId?._id || "N/A",
              name: session?.lesson?.teacherId?.name || "N/A",
              avatar:
                session?.teacher?.profileImageRef?.url ||
                session?.course?.introImageRef?.url ||
                "",
            },
            startTime: formattedTime,
            date: sessionTime.toLocaleDateString("en-US", {
              year: "numeric",
              month: "long",
              day: "numeric",
            }),
            startTimeIso: sessionIso,
            duration: session?.lesson?.schedule?.duration || 0,
            type: session?.course?.mode || "video-call",
            meetingLink: session?.joinUrl || "",
            status: status,
            title: session?.lesson?.title || "N/A",
            tags: [
              ...(session?.course?.mode === "online"
                ? ["Online Course"]
                : ["In-Person"]),
              ...(session?.lesson?.isTrialAvailable ? ["Trial Lessons"] : []),
              ...(session?.course?.lessonType
                ? [
                    session.course.lessonType.charAt(0).toUpperCase() +
                      session.course.lessonType.slice(1),
                  ]
                : []),
            ],
            description:
              session?.lesson?.description ||
              session?.course?.description ||
              "",
            address: session?.lesson?.address || null,
            averageRating: parseFloat(
              session?.lesson?.teacherId?.rating?.averageRating || 0,
            ).toFixed(2),
            totalRating: session?.lesson?.teacherId?.rating?.totalRatings || 0,
          };
        });

        setUpcomingSessions(transformedSessions);
      } catch (err) {
        console.error("Failed to fetch student lessons:", err);
        setError(err.message || "Failed to load upcoming lessons");
      } finally {
        setLoading(false);
      }
    };

    fetchLessons();
  }, [authUser, selectedChildId]);

  // Separate function to refresh lessons data
  const refreshLessons = async () => {
    try {
      setSelectedSession(null);
      const isParent = authUser?.role === "parent";
      const studentId = isParent ? selectedChildId : authUser?.id;

      if (!studentId) return;

      const response = await getLessonsForStudent({ studentId });

      const transformedSessions = (response?.data || []).map((session) => {
        const localTimeString = session?.start?.replace("Z", "");
        const sessionTime = new Date(localTimeString);
        const now = new Date();
        const minutesUntil = Math.floor((sessionTime - now) / (1000 * 60));

        let status = "scheduled";
        if (minutesUntil <= 15 && minutesUntil > 0) {
          status = "starting-soon";
        }

        const formattedTime = sessionTime.toLocaleTimeString("en-US", {
          hour: "numeric",
          minute: "2-digit",
          hour12: true,
        });

        return {
          id: session._id,
          subject: session?.course?.title || "N/A",
          teacher: {
            _id: session?.lesson?.teacherId?._id || "N/A",
            name: session?.lesson?.teacherId?.name || "N/A",
            avatar:
              session?.teacher?.profileImageRef?.url ||
              session?.course?.introImageRef?.url ||
              "",
          },
          startTime: formattedTime,
          date: sessionTime.toLocaleDateString("en-US", {
            year: "numeric",
            month: "long",
            day: "numeric",
          }),
          duration: session?.lesson?.schedule?.duration || 0,
          type: session?.course?.mode || "video-call",
          meetingLink: session?.joinUrl || "",
          status: status,
          title: session?.lesson?.title || "N/A",
          tags: [
            ...(session?.course?.mode === "online"
              ? ["Online Course"]
              : ["In-Person"]),
            ...(session?.lesson?.isTrialAvailable ? ["Trial Lessons"] : []),
            ...(session?.course?.lessonType
              ? [
                  session.course.lessonType.charAt(0).toUpperCase() +
                    session.course.lessonType.slice(1),
                ]
              : []),
          ],
          description:
            session?.lesson?.description || session?.course?.description || "",
          address: session?.lesson?.address || null,
          averageRating: parseFloat(
            session?.lesson?.teacherId?.rating?.averageRating || 0,
          ).toFixed(2),
          totalRating: session?.lesson?.teacherId?.rating?.totalRatings || 0,
        };
      });

      setUpcomingSessions(transformedSessions);
    } catch (err) {
      console.error("Failed to refresh student lessons:", err);
    }
  };

  const handleMessages = () => {
    navigate(getRolePath(authUser?.role || "student", "messages"));
  };

  const getTimeUntilSession = (startTime, duration) => {
    const now = currentTime.getTime();
    const sessionStart = startTime.getTime();
    const sessionEnd = sessionStart + duration * 60 * 1000; // duration is in minutes
    // If session has ended, show "Completed"
    if (now > sessionEnd) {
      return "Completed";
    }

    // If session is currently ongoing
    if (now >= sessionStart && now <= sessionEnd) {
      return "In Progress";
    }

    // Calculate time difference from now to session start
    const diff = sessionStart - now;
    const minutes = Math.floor(diff / (1000 * 60));
    const hours = Math.floor(minutes / 60);
    const days = Math.floor(hours / 24);

    // Show countdown for upcoming sessions
    if (days > 0) return `${days}d ${hours % 24}h`;
    if (hours > 0) return `${hours}h ${minutes % 60}m`;
    if (minutes > 0) return `${minutes}m`;
    return "Starting Soon";
  };

  const handleJoinSession = (session) => {
    if (session.meetingLink) {
      window.open(session.meetingLink, "_blank");
    }
  };

  const handleViewSchedule = () => {
    navigate(getRolePath(authUser?.role || "student", "lessons"));
  };

  const handleSessionClick = (session) => {
    setSelectedSession(session);
  };

  return (
    <div className="bg-card rounded-lg border border-border p-6">
      <div className="flex items-center justify-between mb-6">
        <div className="flex items-center space-x-2">
          <Icon name="CalendarClock" size={24} color="var(--color-primary) " />
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

      {loading ? (
        <Loader />
      ) : error ? (
        <div className="bg-card rounded-lg border border-destructive/50 p-8 text-center">
          <p className="text-destructive mb-2">
            Failed to load upcoming lessons
          </p>
          <p className="text-sm text-muted-foreground">{error}</p>
        </div>
      ) : upcomingSessions.length === 0 ? (
        <div className="text-center py-8">
          <div className="flex items-center justify-center">
            <Icon
              name="Calendar"
              size={48}
              color="var(--color-muted-foreground)"
            />
          </div>
          <p className="text-muted-foreground mt-4">No upcoming sessions</p>
          {role !== "school" && (
            <>
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
            </>
          )}
        </div>
      ) : (
        <div className="space-y-4">
          {upcomingSessions.slice(0, 3).map((session) => (
            <div
              key={session.id}
              className={`p-4 rounded-lg border transition-micro ${
                session.status === "starting-soon"
                  ? "border-warning bg-warning/5"
                  : "border-border bg-muted/30"
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
                      {session.title}
                    </h3>
                    <p className="text-sm text-muted-foreground">
                      {session.teacher.name}
                    </p>
                  </div>
                </div>

                <div className="text-right">
                  <div
                    className={`text-sm font-medium ${
                      session.status === "starting-soon"
                        ? "text-warning"
                        : "text-primary"
                    }`}
                  >
                    {session?.status?.charAt(0).toUpperCase() +
                      session?.status?.slice(1).toLowerCase()}
                  </div>
                  <div className="text-xs text-muted-foreground">
                    {session.startTimeIso
                      ? formatTimeToTZ(session.startTimeIso, userTimezone)
                      : ""}
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
                    <span className="text-muted-foreground">
                      {session.subject}
                    </span>
                  </div>
                </div>

                {session.status === "starting-soon" && (
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
                  <div className="flex-1"></div>
                )}
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
                  onClick={handleMessages}
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
          onFeedbackSubmitted={refreshLessons}
        />
      )}
    </div>
  );
};

export default UpcomingSessionsCard;
