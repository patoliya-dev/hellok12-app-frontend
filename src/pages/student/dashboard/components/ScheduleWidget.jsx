import React, { useState, useEffect } from "react";
import { useNavigate } from "react-router-dom";
import Icon from "../../../../components/AppIcon";
import Button from "../../../../components/ui/Button";

const ScheduleWidget = () => {
  const [currentDate, setCurrentDate] = useState(new Date());
  const [viewMode, setViewMode] = useState("week"); // 'week' or 'month'
  const [weeklySchedule, setWeeklySchedule] = useState([]);
  const navigate = useNavigate();

  useEffect(() => {
    // Mock weekly schedule data
    const mockSchedule = [
      {
        id: 1,
        day: "Monday",
        date: new Date(2025, 6, 28), // July 28, 2025
        sessions: [
          {
            id: 1,
            subject: "English Literature",
            time: "10:00 AM",
            duration: 60,
            teacher: "Ms. Johnson",
            type: "video-call",
            color: "bg-blue-500",
          },
          {
            id: 2,
            subject: "Spanish Conversation",
            time: "2:00 PM",
            duration: 45,
            teacher: "Mr. Rodriguez",
            type: "video-call",
            color: "bg-green-500",
          },
        ],
      },
      {
        id: 2,
        day: "Tuesday",
        date: new Date(2025, 6, 29), // July 29, 2025
        sessions: [
          {
            id: 3,
            subject: "Japanese Writing",
            time: "11:00 AM",
            duration: 90,
            teacher: "Ms. Tanaka",
            type: "video-call",
            color: "bg-purple-500",
          },
        ],
      },
      {
        id: 3,
        day: "Wednesday",
        date: new Date(2025, 6, 30), // July 30, 2025 (today)
        sessions: [
          {
            id: 4,
            subject: "English Grammar",
            time: "9:00 AM",
            duration: 60,
            teacher: "Ms. Johnson",
            type: "video-call",
            color: "bg-blue-500",
          },
          {
            id: 5,
            subject: "Spanish Reading",
            time: "3:00 PM",
            duration: 45,
            teacher: "Mr. Rodriguez",
            type: "video-call",
            color: "bg-green-500",
          },
        ],
      },
      {
        id: 4,
        day: "Thursday",
        date: new Date(2025, 6, 31), // July 31, 2025
        sessions: [
          {
            id: 6,
            subject: "Japanese Speaking",
            time: "10:30 AM",
            duration: 60,
            teacher: "Ms. Tanaka",
            type: "video-call",
            color: "bg-purple-500",
          },
        ],
      },
      {
        id: 5,
        day: "Friday",
        date: new Date(2025, 7, 1), // August 1, 2025
        sessions: [
          {
            id: 7,
            subject: "English Literature",
            time: "10:00 AM",
            duration: 60,
            teacher: "Ms. Johnson",
            type: "video-call",
            color: "bg-blue-500",
          },
        ],
      },
      // {
      //   id: 6,
      //   day: 'Saturday',
      //   date: new Date(2025, 7, 2), // August 2, 2025
      //   sessions: []
      // },
      // {
      //   id: 7,
      //   day: 'Sunday',
      //   date: new Date(2025, 7, 3), // August 3, 2025
      //   sessions: []
      // }
    ];

    setWeeklySchedule(mockSchedule);
  }, []);

  const isToday = (date) => {
    const today = new Date();
    return date.toDateString() === today.toDateString();
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
    navigate("/student/lesson-calendar");
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
              {getUpcomingSessionsCount()}
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
                    {day.date.toLocaleDateString("en-US", {
                      month: "short",
                      day: "numeric",
                    })}
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
                        <div className="font-medium text-foreground text-sm">
                          {session.subject}
                        </div>
                        <div className="text-xs text-muted-foreground">
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
              <div className="text-center py-4">
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
