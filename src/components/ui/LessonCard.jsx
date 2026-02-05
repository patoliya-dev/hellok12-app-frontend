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
  MapPin,
} from "lucide-react";
import Badge from "./Badge";
import { CourseIcon, VideoIcon } from "components/icons";
import Button from "./Button";
import LessonDetailsModal from "../../pages/student-parent/dashboard/components/LessonDetailsModal";
import { getRolePath } from "../../utils/rolePath";
import Image from "components/AppImage";

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
          className={`flex items-end gap-2 mb-1 font-semibold md:justify-end ${
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
      tags,
      description: lesson.description || "",
      address: lesson.address || null,
      averageRating: lesson.ratings?.averageRating || 0,
      totalRating: lesson.ratings?.totalRatings || 0,
    };
    setSelectedLesson(modalLesson);
  };

  const handleMessage = () => {
    navigate(getRolePath(authUser?.role || "student", "messages"));
  };

  const handleFeedbackSubmitted = () => {
    setSelectedLesson(null);
    onRefresh?.();
  };

  return (
    <>
      {/* Card container */}
      <div className="p-5 rounded-lg border border-gray-200 shadow-sm flex flex-col md:flex-row md:items-center md:justify-between gap-4">
        {/* LEFT */}
        <div className="min-w-0 flex-1">
          {/* Header row: avatar + name */}
          <div className="flex gap-4 w-full">
            <Image
              src={lesson?.teacherImage?.url}
              alt={lesson.teacherName}
              className="w-14 h-14 sm:w-16 sm:h-16 rounded-full object-cover flex-shrink-0"
            />

            <div className="min-w-0 flex-1">
              <h3 className="text-lg font-semibold text-brand-gray-800 break-words">
                {lesson.title}
              </h3>
              <p className="text-sm text-brand-gray-600 truncate">
                {lesson.teacherName}
              </p>
            </div>
          </div>
          {/* Meta row: duration + course */}
          <div className="mt-2 flex flex-col sm:flex-row sm:items-center sm:gap-4 gap-2 text-sm text-brand-gray-400">
            <span className="flex items-center gap-1.5 whitespace-nowrap">
              <Clock size={14} /> {lesson.duration} min
            </span>

            <div className="flex items-center space-x-1 min-w-0">
              <CourseIcon selected={false} />
              <span className="text-muted-foreground truncate">
                {lesson.courseTitle}
              </span>
            </div>
          </div>

          {/* Badges */}
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

            {lesson.modality && (
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
                    <MapPin size={14} />
                  )
                }
                color="green"
              />
            )}

            {(lesson.tags || []).map((tag) => (
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

          {/* Address line (mobile/laptop safe) */}
          {lesson.address && (
            <div className="mt-3 text-sm text-brand-gray-400">
              <div className="flex items-start space-x-2">
                <MapPin size={14} className="mt-0.5 flex-shrink-0" />
                <span className="text-muted-foreground break-words">
                  {lesson.address}
                </span>
              </div>
            </div>
          )}
        </div>

        {/* RIGHT */}
        <div className="w-full md:w-auto flex flex-col items-end md:items-end md:justify-between">
          {renderTimeInfo()}

          <div className="mt-3 flex flex-col sm:flex-row sm:items-end gap-2 sm:gap-3 md:gap-6 md:justify-end w-full sm:w-auto">
            <Button
              variant="outline"
              size="sm"
              iconName="FileText"
              onClick={handleViewDetails}
              className="w-full sm:w-auto"
            >
              View Details
            </Button>
            <Button
              variant="outline"
              size="sm"
              iconName="MessageSquare"
              onClick={handleMessage}
              className="w-full sm:w-auto"
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
