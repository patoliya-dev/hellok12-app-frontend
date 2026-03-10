import React, { useEffect, useMemo, useState } from "react";
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
import {
  formatDateToTZ,
  formatTimeToTZ,
  getUserTimezone,
} from "../../../../utils/timezone";

const formatAddress = (address) => {
  if (!address) return "";
  if (typeof address === "string") return address.trim();
  if (Array.isArray(address)) return address.filter(Boolean).join(", ");
  if (typeof address === "object") {
    const parts = [
      address.line1,
      address.line2,
      address.city,
      address.state,
      address.country,
      address.postalCode || address.zip || address.zipCode,
    ]
      .map((part) => String(part || "").trim())
      .filter(Boolean);
    return parts.join(", ");
  }
  return String(address).trim();
};

const getCardState = (session, nowMs = Date.now(), userTimezone = "UTC") => {
  const startMs = new Date(session.startTimeIso).getTime();
  const endMs = new Date(session.endTimeIso).getTime();

  if (!Number.isFinite(startMs) || !Number.isFinite(endMs)) {
    return { key: "scheduled", label: "Scheduled", countdown: "" };
  }

  if (nowMs >= startMs && nowMs <= endMs) {
    return { key: "in-progress", label: "In Progress", countdown: "Now" };
  }

  const diffMin = Math.floor((startMs - nowMs) / (1000 * 60));
  if (diffMin <= 15 && diffMin > 0) {
    return {
      key: "starting-soon",
      label: "Starting Soon",
      countdown: `${diffMin}m`,
    };
  }

  if (diffMin > 0) {
    if (diffMin >= 24 * 60) {
      return {
        key: "scheduled",
        label: "Scheduled",
        countdown: formatDateToTZ(session.startTimeIso, userTimezone, {
          month: "short",
          day: "numeric",
        }),
      };
    }

    const hours = Math.floor(diffMin / 60);
    const mins = diffMin % 60;
    return {
      key: "scheduled",
      label: "Scheduled",
      countdown: hours > 0 ? `${hours}h ${mins}m` : `${mins}m`,
    };
  }

  return { key: "completed", label: "Completed", countdown: "" };
};

const mapSessions = (sessions = [], userTimezone = "UTC") =>
  sessions.map((session) => ({
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
    startTimeIso: session?.start,
    endTimeIso: session?.end,
    date: formatDateToTZ(session?.start, userTimezone),
    startTime: formatTimeToTZ(session?.start, userTimezone),
    duration: session?.lesson?.schedule?.duration || 0,
    meetingLink: session?.joinUrl || "",
    title: session?.lesson?.title || "N/A",
    tags: [
      ...(session?.course?.lessonType
        ? [
            {
              key: "lesson-type",
              label: session.course.lessonType === "group" ? "Group" : "1-on-1",
              icon: session.course.lessonType === "group" ? "Users" : "User",
            },
          ]
        : []),
      ...(session?.lesson?.isTrialAvailable
        ? [{ key: "trial", label: "Trial Lessons", icon: "Gift" }]
        : []),
      // Phase-1: not implemented yet, so keep hidden.
      // ...(session?.course?.mode === "online"
      //   ? [
      //       {
      //         key: "curriculum-games",
      //         label: "Curriculum-Aligned Games",
      //         icon: "Gamepad2",
      //       },
      //     ]
      //   : []),
    ],
    description:
      session?.lesson?.description || session?.course?.description || "",
    address: formatAddress(
      session?.address || session?.lesson?.address || session?.course?.address,
    ),
    averageRating: parseFloat(
      session?.lesson?.teacherId?.rating?.averageRating || 0,
    ).toFixed(2),
    totalRating: session?.lesson?.teacherId?.rating?.totalRatings || 0,
  }));

const getTagClass = (tagLabel) => {
  const t = String(tagLabel || "").toLowerCase();
  if (t.includes("group")) return "bg-blue-100 text-blue-700";
  if (t.includes("1-on-1")) return "bg-blue-100 text-blue-700";
  if (t.includes("trial")) return "bg-sky-100 text-sky-700";
  return "bg-orange-100 text-orange-700";
};

const UpcomingSessionsCard = () => {
  const [upcomingSessions, setUpcomingSessions] = useState([]);
  const [currentTime, setCurrentTime] = useState(new Date());
  const [selectedSession, setSelectedSession] = useState(null);
  const [activeTab, setActiveTab] = useState("all");
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
      setUpcomingSessions(mapSessions(response?.data || [], userTimezone));
    } catch (err) {
      console.error("Failed to fetch student lessons:", err);
      setError(err.message || "Failed to load upcoming lessons");
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchLessons();
  }, [authUser, selectedChildId]);

  // Separate function to refresh lessons data
  const refreshLessons = async () => {
    setSelectedSession(null);
    await fetchLessons();
  };

  const handleMessages = () => {
    navigate(getRolePath(authUser?.role || "student", "messages"));
  };

  const handleJoinSession = (session) => {
    if (session.meetingLink) {
      window.open(session.meetingLink, "_blank");
    }
  };

  const handleViewSchedule = () => {
    navigate(getRolePath(authUser?.role || "student", "lessons"));
  };

  const visibleSessions = useMemo(() => {
    const nowMs = currentTime.getTime();
    const base = upcomingSessions
      .map((s) => ({ ...s, uiState: getCardState(s, nowMs, userTimezone) }))
      .filter((s) => s.uiState.key !== "completed");

    if (activeTab === "game") {
      return base.filter((s) =>
        (s.tags || []).some((t) =>
          String(t?.label || "")
            .toLowerCase()
            .includes("game"),
        ),
      );
    }

    return base;
  }, [upcomingSessions, activeTab, currentTime]);

  return (
    <div className="rounded-xl border border-[#d9dee7] bg-[#f7f8fa] p-5 lg:p-6">
      <div className="mb-4 flex items-center justify-between gap-3">
        <div className="flex items-center gap-2 rounded-lg bg-[#e9eaee] p-1">
          <button
            className={`rounded-md px-4 py-2 text-sm font-semibold transition ${
              activeTab === "all" ? "bg-white text-[#1f2d3d]" : "text-[#4b5563]"
            }`}
            onClick={() => setActiveTab("all")}
          >
            <span className="inline-flex items-center gap-2">
              <Icon name="CalendarDays" size={14} />
              Upcoming Lessons
            </span>
          </button>
          {/* <button
            className={`rounded-md px-4 py-2 text-sm font-semibold transition ${
              activeTab === "game" ? "bg-white text-[#1f2d3d]" : "text-[#4b5563]"
            }`}
            onClick={() => setActiveTab("game")}
          >
            <span className="inline-flex items-center gap-2">
              <Icon name="Gamepad2" size={14} />
              Game Lesson
            </span>
          </button> */}
        </div>

        <button
          onClick={handleViewSchedule}
          className="inline-flex items-center gap-2 text-sm font-semibold text-[#1f2d3d] hover:text-primary"
        >
          <Icon name="Calendar" size={15} />
          <span>View All</span>
        </button>
      </div>

      {loading ? (
        <Loader />
      ) : error ? (
        <div className="rounded-lg border border-destructive/40 bg-white p-6 text-center">
          <p className="text-destructive">{error}</p>
        </div>
      ) : visibleSessions.length === 0 ? (
        <div className="rounded-lg border border-[#e1e4eb] bg-white p-8 text-center text-muted-foreground">
          No upcoming sessions
        </div>
      ) : (
        <div className="space-y-3">
          {visibleSessions.slice(0, 2).map((session) => {
            const highlight =
              session.uiState.key === "starting-soon" ||
              session.uiState.key === "in-progress";

            return (
              <div
                key={session.id}
                className={`rounded-xl border bg-white p-4 ${
                  highlight ? "border-accent" : "border-[#e1e4eb]"
                }`}
              >
                <div className="flex items-start justify-between gap-3">
                  <div className="flex min-w-0 items-center gap-3">
                    <Image
                      src={session.teacher.avatar}
                      alt={session.teacher.name}
                      className="h-12 w-12 rounded-full object-cover"
                    />
                    <div className="min-w-0">
                      <h3 className="truncate font-medium text-brand-gray-800">
                        {session.title}
                      </h3>
                      <p className="truncate text-base text-brand-gray-500">
                        {session.teacher.name}
                      </p>
                    </div>
                  </div>

                  <div className="text-right">
                    <div
                      className={`text-lg font-semibold ${
                        highlight ? "text-accent" : "text-brand-blue"
                      }`}
                    >
                      {session.uiState.countdown || "-"}
                    </div>
                    <div className="text-xs text-brand-gray-500">
                      {session.startTimeIso
                        ? formatTimeToTZ(session.startTimeIso, userTimezone)
                        : ""}
                    </div>
                  </div>
                </div>

                <div className="mt-2 flex flex-wrap items-center gap-4 text-sm text-[#667085]">
                  <span className="inline-flex items-center gap-1.5">
                    <Icon name="Clock3" size={14} />
                    {session.duration} min
                  </span>
                  <span className="inline-flex items-center gap-1.5">
                    <CourseIcon selected={false} />
                    {session.subject}
                  </span>

                  {(session.tags || []).slice(0, 2).map((tag) => (
                    <span
                      key={tag?.key || tag?.label}
                      className={`inline-flex items-center gap-1 rounded-full px-2.5 py-1 text-xs font-medium ${getTagClass(tag?.label)}`}
                    >
                      {tag?.icon ? <Icon name={tag.icon} size={12} /> : null}
                      <span>{tag?.label}</span>
                    </span>
                  ))}

                  {highlight && (
                    <span className="ml-auto inline-flex items-center gap-1.5 text-xs font-medium text-[#f59e0b]">
                      <Icon name="AlertCircle" size={14} />
                      {session.uiState.label}
                    </span>
                  )}
                </div>

                {session.address ? (
                  <div className="mt-2 inline-flex max-w-full items-start gap-1.5 text-sm text-[#667085]">
                    <Icon name="MapPin" size={14} className="mt-0.5 shrink-0" />
                    <span className="break-words">{session.address}</span>
                  </div>
                ) : null}

                <div className="mt-3 flex flex-col gap-2 sm:flex-row sm:items-center">
                  {session.uiState.key === "starting-soon" ||
                  session.uiState.key === "in-progress" ? (
                    <Button
                      variant="default"
                      size="sm"
                      iconName="Video"
                      iconPosition="left"
                      iconSize={16}
                      onClick={() => handleJoinSession(session)}
                      className="h-9 w-full bg-brand-blue text-white hover:bg-brand-blue sm:flex-1"
                    >
                      Join Now
                    </Button>
                  ) : (
                    <div className="hidden sm:block sm:flex-1" />
                  )}
                  <Button
                    variant="ghost"
                    size="sm"
                    iconName="ReceiptText"
                    iconPosition="left"
                    iconSize={16}
                    onClick={() => setSelectedSession(session)}
                    className="w-full justify-center text-sm text-[#27384b] sm:w-auto"
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
                    className="w-full justify-center text-sm text-[#27384b] sm:w-auto"
                  >
                    Message
                  </Button>
                </div>
              </div>
            );
          })}
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
