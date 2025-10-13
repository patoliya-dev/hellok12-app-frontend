import React, { useState, useEffect } from "react";
import { useNavigate } from "react-router-dom";
import Icon from "../../../../components/AppIcon";
import Image from "../../../../components/AppImage";
import Button from "../../../../components/ui/Button";
import LessonDetailsModal from "./LessonDetailsModal";
import { mockLessons, TAG_CONFIG } from "../data";
import { formatLessonTime } from "../../../../utils/formatters";

const UpcomingLessonCard = () => {
  const [upcomingLessons, setUpcomingLessons] = useState([]);
  const [currentTime, setCurrentTime] = useState(new Date());
  const [selectedLesson, setSelectedLesson] = useState(null);

  const navigate = useNavigate();

  useEffect(() => {
    // Update current time every minute
    const timer = setInterval(() => {
      setCurrentTime(new Date());
    }, 60000);

    return () => clearInterval(timer);
  }, []);

  useEffect(() => {
    // Mock upcoming lessons data

    setUpcomingLessons(mockLessons);
  }, []);

  const getTimeUntilSession = (startTime) => {
    const diff = startTime.getTime() - currentTime.getTime();
    const minutes = Math.floor(diff / (1000 * 60));
    const hours = Math.floor(minutes / 60);
    const days = Math.floor(hours / 24);

    if (days > 0)
      return `${new Date(startTime).toLocaleDateString("en-US", {
        year: "numeric",
        month: "long",
        day: "numeric",
      })}`;
    if (hours > 0) return `${hours}h ${minutes % 60}m`;
    if (minutes > 0) return `Start in ${minutes}m`;
    return "Starting now";
  };

  const handleViewSchedule = () => {
    navigate("/school/upcoming-lessons");
  };

  const handleLessonClick = (lesson) => {
    setSelectedLesson(lesson);
  };

  const getLessonTags = (tag) => {
    const badge = TAG_CONFIG[tag];

    // If tag not found, return null (avoids runtime error)
    if (!badge) return null;

    const { text, icon, image, color } = badge;

    return (
      <span
        className={`inline-flex items-center px-2.5 py-1 rounded-full text-xs font-medium ${color}`}
      >
        {icon ? (
          <Icon name={icon} size={12} className="mr-1" />
        ) : (
          image && <Image src={image} alt={text} className="mr-1 w-4 h-4" />
        )}
        {text}
      </span>
    );
  };

  return (
    <div className="bg-card rounded-lg border border-border p-6">
      <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-2 sm:gap-0 mb-6">
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

      {upcomingLessons.length === 0 ? (
        <div className="text-center py-8">
          <Icon
            name="Calendar"
            size={48}
            color="var(--color-muted-foreground)"
          />
          <p className="text-muted-foreground mt-4">No upcoming lessons</p>
        </div>
      ) : (
        <div className="space-y-4">
          {upcomingLessons.slice(0, 4).map((lesson) => (
            <div
              key={lesson.id}
              className={`p-4 rounded-lg border transition-micro ${
                lesson.status === "starting-soon"
                  ? "border-warning bg-warning/5"
                  : "border-border bg-muted/30"
              }`}
            >
              <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between mb-3 gap-2 sm:gap-0">
                <div className="flex items-center space-x-3">
                  <div className="w-12 h-12 rounded-full overflow-hidden bg-muted">
                    <Image
                      src={lesson.studentImage}
                      alt={lesson.studentName}
                      className="w-full h-full object-cover"
                    />
                  </div>
                  <div>
                    <h3 className="font-medium text-foreground">
                      {lesson.studentName}
                    </h3>
                  </div>
                </div>

                <div className="sm:text-right">
                  <div
                    className={`text-sm font-medium ${
                      lesson.status === "starting-soon"
                        ? "text-warning"
                        : "text-primary"
                    }`}
                  >
                    {getTimeUntilSession(lesson.startTime)}
                  </div>
                  <div className="text-xs text-brand-gray-500">
                    {lesson.duration} minutes
                  </div>
                </div>
              </div>

              <div className="flex flex-col sm:flex-row sm:items-center sm:space-x-1 mb-2 gap-2 sm:gap-0">
                <div className="flex items-center space-x-1">
                  <Icon
                    name="Clock"
                    size={14}
                    color="var(--color-muted-foreground)"
                  />
                  <span className="text-sm text-brand-gray-500">
                    {formatLessonTime(lesson.startTime)} -{" "}
                    {formatLessonTime(lesson.endTime)}
                  </span>
                </div>

                {lesson.lessonMode === "in-person" && (
                  <div className="sm:pl-4">
                    {getLessonTags(lesson.lessonType)}
                  </div>
                )}
              </div>

              <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-4 sm:gap-0">
                <div className="flex items-center space-x-2 sm:space-x-4 flex-wrap">
                  {lesson.lessonMode === "in-person" ? (
                    <div className="flex items-center space-x-1">
                      <Icon name="MapPin" size={14} />
                      <span className="text-sm text-brand-gray-800">
                        {lesson.address}
                      </span>
                    </div>
                  ) : (
                    <>
                      {getLessonTags(lesson.lessonType)}
                      {getLessonTags(lesson.lessonMode)}
                    </>
                  )}
                </div>

                <Button
                  variant="ghost"
                  size="sm"
                  iconName="ReceiptText"
                  iconPosition="left"
                  iconSize={16}
                  onClick={() => handleLessonClick(lesson)}
                >
                  View Details
                </Button>
              </div>
            </div>
          ))}
        </div>
      )}

      {/* Session Detail Modal */}
      {selectedLesson && (
        <LessonDetailsModal
          lesson={selectedLesson}
          onClose={() => setSelectedLesson(null)}
          getLessonTags={getLessonTags}
        />
      )}
    </div>
  );
};

export default UpcomingLessonCard;
