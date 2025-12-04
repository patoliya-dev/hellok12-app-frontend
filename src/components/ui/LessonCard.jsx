import React, { useState } from "react";
import { useNavigate } from "react-router-dom";
import { useSelector } from "react-redux";
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
import LessonDetailsModal from "../../pages/student-parent/dashboard/components/LessonDetailsModal";
import { getRolePath } from "../../utils/rolePath";

const LessonCard = ({ lesson, onRefresh }) => {
  const [selectedLesson, setSelectedLesson] = useState(null);
  const navigate = useNavigate();
  const authUser = useSelector((state) => state.auth.user);

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

  const handleViewDetails = () => {
    const tags = [
      ...(lesson.modality ? [lesson.modality] : []),
      ...(lesson.tags?.includes("Trial Lesson") ? ["Trial Lessons"] : []),
      ...(lesson.type ? [lesson.type] : []),
    ];
    console.log(lesson);
    const modalLesson = {
      id: lesson._id,
      title: lesson.title,
      subject: lesson.courseTitle,
      teacher: {
        _id: lesson.teacherId,
        name: lesson.teacherName,
        avatar: lesson?.teacherImage?.url || "/default-avatar.png",
      },
      startTime: formatLessonTime(lesson.startTime),
      date: formatLessonDate(lesson.startTime),
      duration: lesson.duration,
      status:
        lesson.status === "Upcoming"
          ? "scheduled"
          : lesson.status.toLowerCase(),
      tags: tags,
      description: lesson.description || "",
      address: lesson.address || null,
      averageRating: lesson.ratings.averageRating || 0,
      totalRating: lesson.ratings.totalRatings || 0,
    };
    setSelectedLesson(modalLesson);
  };

  const handleMessage = () => {
    navigate(getRolePath(authUser?.role || "student", "messages"));
  };

  const handleFeedbackSubmitted = () => {
    setSelectedLesson(null);
    if (onRefresh) {
      onRefresh();
    }
  };

  return (
    <>
      <div className="p-5 rounded-lg border border-gray-200 shadow-sm flex flex-col md:flex-row items-start md:items-center justify-between gap-4">
        <div>
          <div className="flex gap-4 w-full md:w-auto">
            <img
              src={lesson?.teacherImage?.url || "/default-avatar.png"}
              alt={lesson.teacherName}
              className="w-16 h-16 rounded-full object-cover"
            />
            <div className="flex-grow">
              <h3 className="text-lg font-semibold text-brand-gray-800">
                {lesson.title}
              </h3>
              <p className="text-sm text-brand-gray-600">
                {lesson.teacherName}
              </p>
            </div>
          </div>

          <div className="flex items-center gap-4 mt-2 text-sm text-brand-gray-400">
            <span className="flex items-center gap-1.5">
              <Clock size={14} /> {lesson.duration} min
            </span>
            <div className="flex items-center space-x-1">
              <CourseIcon selected={false} />
              <span className="text-muted-foreground">
                {lesson.courseTitle}
              </span>
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
                lesson.modality === "Online Course" ? (
                  <VideoIcon
                    size={14}
                    className="w-[12px] h-[10px]"
                    selected={true}
                  />
                ) : (
                  <Users size={14} />
                )
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
            <Button
              variant="outline"
              size="sm"
              iconName="FileText"
              onClick={handleViewDetails}
            >
              View Details
            </Button>
            <Button
              variant="outline"
              size="sm"
              iconName="MessageSquare"
              onClick={handleMessage}
            >
              Message
            </Button>
          </div>
        </div>
      </div>

      {/* Lesson Details Modal */}
      {selectedLesson && (
        <LessonDetailsModal
          lesson={selectedLesson}
          onClose={() => setSelectedLesson(null)}
          onFeedbackSubmitted={handleFeedbackSubmitted}
        />
      )}
    </>
  );
};

export default LessonCard;
