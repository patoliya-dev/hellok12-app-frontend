import React, { useState, useEffect } from "react";
import { useNavigate } from "react-router-dom";
import { useSelector } from "react-redux";
import Icon from "../../../../components/AppIcon";
import Button from "../../../../components/ui/Button";
import { selectAuthUser } from "reducers/auth/authSelectors";
import { getRolePath } from "../../../../utils/rolePath";
import { studentService } from "../../../../services/students/student.service";
import { formatUtcToLocal, isSameLocalDay, parseServerUtc } from "../../../../utils/datetime";
import { formatTimeToTZ, getUserTimezone } from "../../../../utils/timezone";

const ScheduleWidget = () => {
  const [viewMode, setViewMode] = useState("week"); // 'week' or 'month'
  const [weeklySchedule, setWeeklySchedule] = useState([]);
  const [loading, setLoading] = useState(true);
  const [totalSessions, setTotalSessions] = useState(0);
  const navigate = useNavigate();
  const authUser = useSelector(selectAuthUser);
  const userTimezone = getUserTimezone();
  const selectedChildId = useSelector((state) => state.profile.selectedChildId);

  // Color mapping for different sessions
  const getSessionColor = (index) => {
    const colors = [
      "bg-blue-500",
      "bg-green-500",
      "bg-purple-500",
      "bg-orange-500",
      "bg-pink-500",
      "bg-indigo-500",
    ];
    return colors[index % colors.length];
  };

  // Format time from ISO string to readable format
  const formatTime = (isoString) => {
    return formatTimeToTZ(isoString, userTimezone, { hour: 'numeric', minute: '2-digit', hour12: true });
  };

  useEffect(() => {
    const fetchWeeklySchedule = async () => {
      try {
        setLoading(true);
        // Determine which student ID to use based on role
        const isParent = authUser?.role === "parent";
        const studentId = isParent ? selectedChildId : authUser?.id;
        // Don't fetch if we don't have a valid student ID
        if (!studentId) {
          setWeeklySchedule([]);
          setLoading(false);
          return;
        }

        const response = await studentService.getWeeklySchedule({ studentId });

        if (response.success && response.data) {
          setTotalSessions(response.data.totalSessions);
          const transformedSchedule = response.data.days.map((day, dayIndex) => {
            const utcDayDate = parseServerUtc(day.date) || new Date();
            return {
              id: dayIndex + 1,
              day: day.dayName,
              date: utcDayDate,
              sessions: (day.sessions || []).map((session, sessionIndex) => ({
                id: session.sessionId,
                subject: session.lessonName,
                startTime: parseServerUtc(session.startTime),
                time: formatTime(session.startTime),
                duration: session.duration,
                teacher: session.teacherName,
                type: "video-call",
                color: getSessionColor(sessionIndex),
                status: session.status,
              }))
            };
          });

          setWeeklySchedule(transformedSchedule);
        }
      } catch (error) {
        console.error("Error fetching weekly schedule:", error);
        // Keep empty schedule on error
        setWeeklySchedule([]);
      } finally {
        setLoading(false);
      }
    };

    fetchWeeklySchedule();
  }, [authUser, selectedChildId]);

  const isToday = (date) => {
    return isSameLocalDay(date, new Date());
  };

  const getTotalSessionsToday = () => {
    const today = weeklySchedule.find((day) => isToday(day.date));
    return today ? today.sessions.length : 0;
  };

  const getUpcomingSessionsCount = () => {
    const now = new Date();
    let count = 0;
    weeklySchedule.forEach((day) => {
      if (day.date >= now) {
        count += day.sessions.length;
      }
    });

    return count;
  };

  const handleViewFullSchedule = () => {
    navigate(getRolePath(authUser?.role || "student", "lesson-calendar"));
  };

  return (
    <div className="bg-card rounded-lg border border-border p-6">
      <div className="flex items-center justify-between mb-6">
        <div className="flex items-center space-x-2">
          <Icon name="Calendar" size={24} color="var(--color-primary)" />
          <h2 className="text-xl font-semibold text-foreground">
            This Week's Schedule
          </h2>
        </div>

        <div className="flex items-center space-x-2">
          <div className="bg-muted/50 rounded-lg p-4 flex items-center space-x-3">
            <div className="text-2xl font-bold text-primary">
              {getTotalSessionsToday()}
            </div>
            <div className="text-sm text-muted-foreground">Sessions Today</div>
          </div>
          <div className="bg-muted/50 rounded-lg p-4 flex items-center space-x-3">
            <div className="text-2xl font-bold text-success">
              {totalSessions}
            </div>
            <div className="text-sm text-muted-foreground">This Week</div>
          </div>
          <Button
            variant={viewMode === "week" ? "default" : "ghost"}
            size="sm"
            onClick={() => setViewMode("week")}
          >
            Week
          </Button>
          <Button
            variant="outline"
            size="sm"
            iconName="ExternalLink"
            iconPosition="left"
            iconSize={16}
            onClick={handleViewFullSchedule}
          >
            Full View
          </Button>
        </div>
      </div>

      {/* Schedule Stats */}
      {/* <div className="grid grid-cols-2 gap-4 mb-6">
        <div className="bg-muted/50 rounded-lg p-4 text-center">
          <div className="text-2xl font-bold text-primary">{getTotalSessionsToday()}</div>
          <div className="text-sm text-muted-foreground">Sessions Today</div>
        </div>
        <div className="bg-muted/50 rounded-lg p-4 text-center">
          <div className="text-2xl font-bold text-success">{getUpcomingSessionsCount()}</div>
          <div className="text-sm text-muted-foreground">This Week</div>
        </div>
      </div> */}

      {/* Weekly Calendar View */}
      {/* Weekly Calendar View */}
      <div className="flex space-x-3 overflow-x-auto pb-2">
        {weeklySchedule.map((day) => (
          <div
            key={day.id}
            className={`min-w-[230px] flex-shrink-0 p-4 rounded-lg border transition-micro ${isToday(day.date)
              ? "border-primary bg-primary/5"
              : "border-border bg-muted/30"
              }`}
          >
            <div className="flex items-center justify-between mb-3">
              <div className="flex items-center space-x-3">
                <div
                  className={`w-10 h-10 rounded-full flex items-center justify-center ${isToday(day.date)
                    ? "bg-primary text-white"
                    : "bg-muted text-muted-foreground"
                    }`}
                >
                  <span className="text-sm font-medium">
                    {day.date.getDate()}
                  </span>
                </div>
                <div>
                  <h3
                    className={`font-medium ${isToday(day.date) ? "text-primary" : "text-foreground"
                      }`}
                  >
                    {day.day}
                  </h3>
                  <p className="text-sm text-muted-foreground">
                    {formatUtcToLocal(day.date, { month: 'short', day: 'numeric' })}
                  </p>
                </div>
              </div>

              <div className="text-right">
                <div className="text-sm font-medium text-foreground">
                  {day.sessions.length} session
                  {day.sessions.length !== 1 ? "s" : ""}
                </div>
                {isToday(day.date) && (
                  <div className="text-xs text-primary font-medium">Today</div>
                )}
              </div>
            </div>

            {/* Sessions for the day */}
            {day.sessions.length > 0 ? (
              <div className="space-y-2">
                {day.sessions.map((session) => (
                  <div
                    key={session.id}
                    className="flex items-center justify-between p-3 bg-card rounded-lg border border-border"
                  >
                    <div className="flex items-center space-x-3">
                      <div
                        className={`w-3 h-3 rounded-full ${session.color}`}
                      />
                      <div>
                        <div className="w-[130px] font-medium text-foreground text-sm truncate">
                          {session.subject}
                        </div>
                        <div className="w-[130px] text-xs text-muted-foreground truncate">
                          {session.teacher}
                        </div>
                      </div>
                    </div>

                    <div className="text-right">
                      <div className="text-sm font-medium text-foreground">
                        {session.time}
                      </div>
                      <div className="text-xs text-muted-foreground">
                        {session.duration} min
                      </div>
                    </div>
                  </div>
                ))}
              </div>
            ) : (
              <div className="flex flex-col items-center justify-center py-4">
                <Icon
                  name="Calendar"
                  size={32}
                  color="var(--color-muted-foreground)"
                />
                <p className="text-sm text-muted-foreground mt-2">
                  No sessions scheduled
                </p>
              </div>
            )}
          </div>
        ))}
      </div>

      {/* Quick Actions */}
      {/* <div className="mt-6 pt-6 border-t border-border">
        <div className="flex flex-col sm:flex-row gap-3">
          <Button
            variant="default"
            size="sm"
            iconName="Plus"
            iconPosition="left"
            iconSize={16}
            onClick={handleViewFullSchedule}
            className="flex-1"
          >
            Book Session
          </Button>
          
          <Button
            variant="outline"
            size="sm"
            iconName="Download"
            iconPosition="left"
            iconSize={16}
            className="flex-1"
          >
            Export Schedule
          </Button>
        </div>
      </div> */}
    </div>
  );
};

export default ScheduleWidget;
