import React from "react";
import {
  formatLessonTime,
  getCountdown,
  formatLessonDate,
} from "../../utils/formatters";
import {
  Clock,
  CheckCircle,
  XCircle,
  Users,
  User,
  Gift,
  Gamepad2,
} from "lucide-react";
import Badge from "./Badge";
import { CourseIcon, VideoIcon } from "components/icons";
import Button from "./Button";

const LessonCard = ({ lesson }) => {
  const renderTimeInfo = () => {
    if (lesson.status === "Upcoming") {
      // If the date is far in the future, show the date. Otherwise, show countdown.
      const isFarFuture =
        new Date(lesson.startTime).getTime() - new Date().getTime() >
        2 * 24 * 60 * 60 * 1000; // More than 2 days
      if (isFarFuture) {
        return (
          <div className="text-right">
            <div className="text-lg font-bold text-brand-blue">
              {formatLessonDate(lesson.startTime)}
            </div>
            <div className="text-sm text-gray-500">
              {formatLessonTime(lesson.startTime)}
            </div>
          </div>
        );
      }
      return (
        <div className="text-right">
          <div className="text-lg font-bold text-brand-blue">
            {getCountdown(lesson.startTime)}
          </div>
          <div className="text-sm text-gray-500">
            {formatLessonTime(lesson.startTime)}
          </div>
        </div>
      );
    }
    // For History tab
    return (
      <div className="text-right">
        <div
          className={`flex items-center justify-end gap-2 mb-1 font-semibold ${
            lesson.status === "Completed" ? "text-green-600" : "text-red-600"
          }`}
        >
          {lesson.status === "Completed" ? (
            <CheckCircle size={18} />
          ) : (
            <XCircle size={18} />
          )}
          <span>{lesson.status}</span>
        </div>
        <div className="text-md font-bold text-gray-700">
          {formatLessonDate(lesson.startTime)}
        </div>
        <div className="text-sm text-gray-500">
          {formatLessonTime(lesson.startTime)}
        </div>
      </div>
    );
  };

  return (
    <div className="p-5 rounded-lg border border-gray-200 shadow-sm flex flex-col md:flex-row items-start md:items-center justify-between gap-4">
      <div>
        <div className="flex gap-4 w-full md:w-auto">
          <img
            src={lesson.teacherImage}
            alt={lesson.teacherName}
            className="w-16 h-16 rounded-full object-cover"
          />
          <div className="flex-grow">
            <h3 className="text-lg font-semibold text-brand-gray-800">
              {lesson.courseName}
            </h3>
            <p className="text-sm text-brand-gray-600">{lesson.teacherName}</p>
          </div>
        </div>

        <div className="flex items-center gap-4 mt-2 text-sm text-brand-gray-400">
          <span className="flex items-center gap-1.5">
            <Clock size={14} /> {lesson.duration} min
          </span>
          <div className="flex items-center space-x-1">
            <CourseIcon selected={false} />
            <span className="text-muted-foreground">{lesson.courseName}</span>
          </div>
        </div>

        <div className="mt-3 flex flex-wrap gap-2">
          {lesson.type && (
            <Badge
              text={lesson.type}
              icon={
                lesson.type === "Group" ? (
                  <Users size={14} />
                ) : (
                  <User size={14} />
                )
              }
              color="blue"
            />
          )}
          <Badge
            text={lesson.modality}
            icon={
              <VideoIcon
                size={14}
                className="w-[12px] h-[10px]"
                selected={true}
              />
            }
            color="green"
          />
          {lesson.tags.map((tag) => (
            <Badge
              key={tag}
              text={tag}
              icon={
                tag.includes("Trial") ? (
                  <Gift size={14} />
                ) : (
                  <Gamepad2 size={14} />
                )
              }
              color={tag.includes("Trial") ? "sky" : "orange"}
            />
          ))}
        </div>
      </div>
      <div className="flex flex-col justify-between self-stretch w-full md:w-auto mt-4 md:mt-0">
        {renderTimeInfo()}
        <div className="flex items-center gap-6 text-sm text-brand-gray-600 self-start md:self-end mt-2">
          <Button variant="outline" size="sm" iconName="FileText">
            View Details
          </Button>
          <Button variant="outline" size="sm" iconName="MessageSquare">
            Message
          </Button>
        </div>
      </div>
    </div>
  );
};

export default LessonCard;
