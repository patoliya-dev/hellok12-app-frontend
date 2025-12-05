import React, { useEffect, useState } from "react";
import { formatLessonTime } from "../../../../utils/formatters";
import Button from "components/ui/Button";
import Icon from "components/AppIcon";
import { TAG_CONFIG } from "../../../../pages/school/dashboard/data";
import Image from "components/AppImage";
import LessonDetailsModal from "../../../../pages/school/dashboard/components/LessonDetailsModal";

const LessonCard = ({ lesson }) => {
  const [currentTime, setCurrentTime] = useState(new Date());
  const [selectedLesson, setSelectedLesson] = useState(null);

  useEffect(() => {
    // Update current time every minute
    const timer = setInterval(() => {
      setCurrentTime(new Date());
    }, 60000);

    return () => clearInterval(timer);
  }, []);

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

  return (
    <div className="p-5 rounded-lg border border-gray-200 shadow-sm">
      <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between mb-3 gap-2 sm:gap-0">
        <div className="flex items-center space-x-3">
          <div className="w-14 h-14 rounded-full overflow-hidden bg-muted">
            <Image
              src={lesson.teacher.avatar}
              alt={lesson.teacher.name}
              className="w-full h-full object-cover"
            />
          </div>
          <div>
            <h3 className="font-medium text-brand-gray-800 text-h5">
              {lesson.title}
            </h3>
            <p className="text-body1 text-brand-gray-500">
              {lesson.teacher.name}
            </p>
          </div>
        </div>

        <div className="sm:text-right">
          <div
            className={`text-lg font-medium ${
              lesson.status === "starting-soon"
                ? "text-warning"
                : "text-primary"
            }`}
          >
            {getTimeUntilSession(lesson.startTime)}
          </div>
          <div className="text-[16px] text-brand-gray-500">
            {formatLessonTime(lesson.startTime)}
          </div>
        </div>
      </div>

      <div className="flex items-center space-x-1 mb-3">
        <Icon name="Clock" size={14} color="var(--color-muted-foreground)" />
        <span className="text-sm text-brand-gray-500">
          {formatLessonTime(lesson.startTime)} -{" "}
          {formatLessonTime(lesson.endTime)}
        </span>
      </div>

      <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-4 sm:gap-0">
        <div className="flex items-center gap-2 sm:space-x-4 flex-wrap">
          {getLessonTags(lesson.lessonType)}
          {getLessonTags(lesson.lessonMode)}
          {lesson.isTrailAvailable && getLessonTags("TrailAvailable")}
          {lesson.isCurriculumGames && getLessonTags("CurriculumGames")}
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

export default LessonCard;
