import React, { useState } from "react";
import Icon from "../../../../components/AppIcon";
import Image from "../../../../components/AppImage";
import Button from "../../../../components/ui/Button";
import Modal from "../../../../components/ui/Modal";
import LessonDetailsModal from "./LessonDetailsModal";

const COMPLETE_WINDOW_BEFORE_MINUTES = 30;
const COMPLETE_WINDOW_AFTER_MINUTES = 12 * 60;

const buildLessonModalData = (session) => ({
  id: session?.id,
  subject: session?.lesson?.title || "N/A",
  title: session?.lesson?.title || "N/A",
  description: session?.course?.description || "N/A",
  teacher: {
    name: session?.course?.title || "N/A",
    avatar: session?.course?.introImageRef?.url || "",
  },
  startTime: session?.startTime,
  endTime: session?.endTime,
  date: session?.lesson?.schedule?.date,
  duration: session?.lesson?.schedule?.duration || 0,
  status: session?.status?.toLowerCase() || "pending",
  lessonDescription: session?.lesson?.description || "",
  tags: [
    ...(session?.course?.mode
      ? [
          session.course.mode.charAt(0).toUpperCase() +
            session.course.mode.slice(1),
        ]
      : []),
    ...(session?.lesson?.isTrialAvailable ? ["Trial Session"] : []),
    ...(session?.course?.lessonType
      ? [
          session.course.lessonType.charAt(0).toUpperCase() +
            session.course.lessonType.slice(1),
        ]
      : []),
  ],
  address:
    session?.lesson?.address ||
    session?.lesson?.location?.address ||
    session?.course?.address ||
    session?.location?.address ||
    session?.address ||
    null,
});

const getSessionAddress = (session) =>
  session?.lesson?.address ||
  session?.lesson?.location?.address ||
  session?.course?.address ||
  session?.location?.address ||
  session?.address ||
  null;

const normalizeAddress = (address) => {
  if (!address) return null;
  if (typeof address === "string") return address.trim() || null;
  if (typeof address !== "object") return null;

  const { line1, line2, city, state, postalCode, zip, country } = address;

  const parts = [line1, line2, city, state, postalCode || zip, country]
    .map((part) => (typeof part === "string" ? part.trim() : ""))
    .filter(Boolean);

  return parts.length ? parts.join(", ") : null;
};

const getSessionStatus = (session) => {
  const sessionTime = new Date(session?.start);
  const endTime = new Date(session?.end);
  const now = new Date();

  if (session?.status === "COMPLETED") {
    return { key: "completed", label: "Completed" };
  }

  if (session?.status === "CANCELLED") {
    return { key: "cancelled", label: "Cancelled" };
  }

  if (now < sessionTime) {
    const minutesUntil = Math.floor((sessionTime - now) / (1000 * 60));
    if (minutesUntil <= 15) {
      return { key: "starting-soon", label: `Starts in ${minutesUntil}m` };
    }
    return { key: "upcoming", label: "Scheduled" };
  }

  if (now >= sessionTime && now <= endTime) {
    return { key: "ongoing", label: "In Progress" };
  }

  return { key: "completed", label: "Completed" };
};

const getCardClass = (statusKey) => {
  if (statusKey === "starting-soon") return "border-warning";
  if (statusKey === "ongoing") return "border-success/40";
  if (statusKey === "cancelled") return "border-destructive/30";
  return "border-border";
};

const getStatusTextClass = (statusKey, sessionStatus) => {
  if (statusKey === "starting-soon") return "text-warning";
  if (statusKey === "ongoing") return "text-success";
  if (statusKey === "completed") return "text-muted-foreground";
  if (statusKey === "cancelled") return "text-destructive";

  switch (sessionStatus) {
    case "SCHEDULED":
      return "text-warning";
    case "IN_PROGRESS":
      return "text-success";
    case "COMPLETED":
      return "text-muted-foreground";
    case "CANCELLED":
      return "text-destructive";
    default:
      return "text-primary";
  }
};

const getModeTag = (session) => {
  const mode = String(session?.course?.mode || "").toLowerCase();
  if (mode === "online") {
    return {
      label: "Online Course",
      icon: "Video",
      className: "bg-emerald-100 text-emerald-700",
    };
  }
  if (mode === "in-person") {
    return {
      label: "In-Person",
      icon: "MapPin",
      className: "bg-orange-100 text-orange-700",
    };
  }
  return null;
};

const isInPersonSession = (session) => {
  const mode = String(session?.course?.mode || "")
    .trim()
    .toLowerCase();
  return mode === "in-person" || mode === "in_person" || mode === "inperson";
};

const isCompletableSession = (session) => {
  const status = String(session?.status || "");
  if (!["SCHEDULED", "IN_PROGRESS"].includes(status)) return false;

  const now = new Date();
  const start = new Date(session?.start);
  const end = new Date(session?.end);
  if (Number.isNaN(start.getTime()) || Number.isNaN(end.getTime()))
    return false;

  const windowStart = new Date(
    start.getTime() - COMPLETE_WINDOW_BEFORE_MINUTES * 60 * 1000,
  );
  const windowEnd = new Date(
    end.getTime() + COMPLETE_WINDOW_AFTER_MINUTES * 60 * 1000,
  );
  return now >= windowStart && now <= windowEnd;
};

const TodaySchedule = ({
  sessions,
  onJoinSession,
  onViewAllSchedules,
  onMessage,
  onCompleteSession,
}) => {
  const [selectedSession, setSelectedSession] = useState(null);
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [confirmSession, setConfirmSession] = useState(null);
  const [isCompleting, setIsCompleting] = useState(false);

  const sortedSessions = [...sessions].sort(
    (a, b) => new Date(a.start) - new Date(b.start),
  );

  const confirmCompleteSession = async () => {
    if (!confirmSession || !onCompleteSession) return;

    setIsCompleting(true);
    try {
      await onCompleteSession(confirmSession);
      setConfirmSession(null);
    } finally {
      setIsCompleting(false);
    }
  };

  return (
    <div className="rounded-lg border border-border bg-card p-4 sm:p-6">
      <div className="mb-4 flex items-center justify-between">
        <div className="inline-flex items-center gap-2">
          <Icon name="CalendarClock" size={20} color="var(--color-primary)" />
          <h3 className="text-lg font-semibold text-foreground">
            Today&apos;s Schedule
          </h3>
        </div>
        <button
          onClick={onViewAllSchedules}
          className="text-sm font-medium text-foreground hover:text-primary"
        >
          View All
        </button>
      </div>

      {sortedSessions.length === 0 ? (
        <div className="flex flex-col items-center justify-center gap-3 py-8 text-center">
          <Icon
            name="Calendar"
            size={44}
            color="var(--color-muted-foreground)"
          />
          <p className="text-muted-foreground">
            No sessions scheduled for today
          </p>
        </div>
      ) : (
        <div className="space-y-3">
          {sortedSessions.map((session) => {
            const uiStatus = getSessionStatus(session);
            const modeTag = getModeTag(session);
            const sessionAddress = normalizeAddress(getSessionAddress(session));
            const canJoinByTime =
              uiStatus.key === "starting-soon" || uiStatus.key === "ongoing";
            const showJoin =
              canJoinByTime &&
              !isInPersonSession(session) &&
              !!session?.joinUrl;
            const showDetails =
              uiStatus.key === "upcoming" || uiStatus.key === "completed";

            return (
              <div
                key={session?._id || session?.id}
                className={`rounded-lg border bg-white p-4 transition-micro ${getCardClass(uiStatus.key)}`}
              >
                <div className="mb-3 flex flex-col gap-2 sm:flex-row sm:items-start sm:justify-between">
                  <div className="flex min-w-0 items-center gap-3">
                    <Image
                      src={session?.course?.introImageRef?.url}
                      alt={session?.course?.title}
                      className="h-10 w-10 rounded-full object-cover"
                    />
                    <div className="min-w-0">
                      <h4 className="truncate text-base font-medium text-foreground">
                        {session?.course?.title}
                      </h4>
                      <p className="truncate text-sm text-muted-foreground">
                        {session?.lesson?.title}
                      </p>
                    </div>
                  </div>

                  <div className="text-left sm:text-right">
                    <div
                      className={`text-sm font-medium ${getStatusTextClass(uiStatus.key, session?.status)}`}
                    >
                      {uiStatus.label}
                    </div>
                    <div className="text-xs text-muted-foreground">
                      {session?.lesson?.schedule?.duration || 0} minutes
                    </div>
                  </div>
                </div>

                <div className="mb-3 flex flex-wrap items-center gap-3 text-sm">
                  <div className="inline-flex items-center gap-1 text-muted-foreground">
                    <Icon
                      name="Clock"
                      size={14}
                      color="var(--color-muted-foreground)"
                    />
                    <span>
                      {session.startTime} - {session.endTime}
                    </span>
                  </div>

                  <span className="inline-flex items-center gap-1 rounded-full bg-blue-100 px-2.5 py-1 text-xs font-medium text-blue-700">
                    <Icon name="Users" size={12} />
                    {session?.course?.lessonType === "group"
                      ? "Group"
                      : "1-on-1"}
                  </span>

                  {modeTag && (
                    <span
                      className={`inline-flex items-center gap-1 rounded-full px-2.5 py-1 text-xs font-medium ${modeTag.className}`}
                    >
                      <Icon name={modeTag.icon} size={12} />
                      {modeTag.label}
                    </span>
                  )}
                </div>

                {sessionAddress && (
                  <div className="mb-3 inline-flex max-w-full items-center gap-1 text-sm text-muted-foreground">
                    <Icon
                      name="MapPin"
                      size={14}
                      color="var(--color-muted-foreground)"
                    />
                    <span className="truncate">{sessionAddress}</span>
                  </div>
                )}

                <div className="flex flex-col gap-2 sm:flex-row sm:flex-wrap sm:items-center">
                  {showJoin ? (
                    <Button
                      variant="default"
                      size="sm"
                      iconName="Video"
                      iconPosition="left"
                      iconSize={16}
                      onClick={() => onJoinSession(session)}
                      className="h-9 w-full sm:min-w-[220px] sm:flex-1 bg-primary text-primary-foreground"
                    >
                      Join lesson
                    </Button>
                  ) : (
                    <div className="hidden sm:block sm:flex-1" />
                  )}

                  {/* {showDetails && ( */}
                  <Button
                    variant="ghost"
                    size="sm"
                    iconName="FileText"
                    iconPosition="left"
                    iconSize={15}
                    className="w-full justify-center text-foreground sm:w-auto"
                    onClick={() => {
                      setSelectedSession(buildLessonModalData(session));
                      setIsModalOpen(true);
                    }}
                  >
                    View Details
                  </Button>
                  {/* )} */}

                  <Button
                    variant="ghost"
                    size="sm"
                    iconName="MessageCircle"
                    iconPosition="left"
                    iconSize={15}
                    className="w-full justify-center text-foreground sm:w-auto"
                    onClick={onMessage}
                  >
                    Message
                  </Button>

                  {isCompletableSession(session) && (
                    <Button
                      variant="outline"
                      size="sm"
                      iconName="CheckCircle"
                      iconPosition="left"
                      iconSize={15}
                      onClick={() => setConfirmSession(session)}
                      className="w-full justify-center border-success/40 text-success hover:text-white hover:bg-success sm:w-auto"
                    >
                      Mark as completed
                    </Button>
                  )}
                </div>
              </div>
            );
          })}
        </div>
      )}

      {isModalOpen && selectedSession && (
        <LessonDetailsModal
          lesson={selectedSession}
          onClose={() => {
            setIsModalOpen(false);
            setSelectedSession(null);
          }}
        />
      )}

      {confirmSession && (
        <Modal
          title="Mark Session Complete"
          onClose={() => setConfirmSession(null)}
          width="max-w-md w-full"
        >
          <div className="space-y-4 p-4">
            <p className="text-sm text-muted-foreground">
              Mark this session as completed? This action moves it out of
              Today/Upcoming and into history.
            </p>
            <div className="flex justify-end gap-2">
              <Button
                variant="outline"
                size="sm"
                onClick={() => setConfirmSession(null)}
                disabled={isCompleting}
              >
                Keep as scheduled
              </Button>
              <Button
                variant="success"
                size="sm"
                iconName="CheckCircle"
                iconPosition="left"
                iconSize={16}
                onClick={confirmCompleteSession}
                disabled={isCompleting}
              >
                {isCompleting ? "Marking..." : "Mark as completed"}
              </Button>
            </div>
          </div>
        </Modal>
      )}
    </div>
  );
};

export default TodaySchedule;
