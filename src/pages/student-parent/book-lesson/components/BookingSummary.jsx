import React from "react";
import { useSelector } from "react-redux";
import { format } from "date-fns";
import Icon from "components/AppIcon";
import { selectSelectedTeacher } from "reducers/teachers/teachersSlice";
import { formatLessonDate } from "../../../../utils/formatters";
import Image from "components/AppImage";

const BookingSummary = ({ courseData, selectedStudent, total }) => {
  const selectedTeacher = useSelector(selectSelectedTeacher);

  const formatDuration = (minutes) => {
    if (minutes < 60) {
      return `${minutes} min`;
    }
    const hours = Math.floor(minutes / 60);
    const remainingMinutes = minutes % 60;
    return remainingMinutes > 0
      ? `${hours}h ${remainingMinutes}m`
      : `${hours}h`;
  };

  return (
    <div className="bg-card border border-border rounded-lg p-6">
      <h2 className="text-lg font-semibold text-foreground mb-4">
        Booking Summary
      </h2>

      <div className="space-y-6">
        {/* Class Info */}
        <div className="space-y-3">
          <div className="flex justify-between items-start">
            <div className="flex-1">
              <h3 className="font-medium text-foreground">
                {courseData?.title}
              </h3>
              <p className="text-sm text-text-secondary">
                with {selectedTeacher?.name}
              </p>
            </div>
            <div className="text-right">
              <p className="font-semibold text-foreground">
                ${courseData?.pricing?.effectivePrice ?? courseData?.price}
              </p>
              {Number(courseData?.pricing?.completedLessons || 0) > 0 && (
                <p className="text-xs text-muted-foreground">
                  {courseData?.pricing?.completedLessons} completed lesson(s)
                  excluded
                </p>
              )}
              <p className="text-xs text-text-secondary">
                <span>
                  (
                  {courseData?.startDate &&
                    formatLessonDate(courseData?.startDate?.slice(0, 10))}
                  ){" "}
                  {courseData?.endDate &&
                    `to (${formatLessonDate(
                      courseData?.endDate?.slice(0, 10),
                    )})`}
                </span>
              </p>
            </div>
          </div>
        </div>

        {courseData?.ownerType === "school" && (
          <div className="flex items-center">
            <Icon name="SchoolIcon" size={22} className="mr-2" />
            <span className="text-body2 text-text-secondary">
              {courseData?.teacher?.school}
            </span>
          </div>
        )}

        <div className="border-t border-border pt-4">
          <div className="space-y-3">
            {/* Date & Time for 1-on-1 classes */}
            {courseData?.lessonType === "1-on-1" &&
              courseData?.nextLessonDate && (
                <div className="flex items-center space-x-3">
                  <Icon
                    name="Calendar"
                    size={16}
                    className="text-text-secondary"
                  />
                  <div>
                    <p className="text-sm font-medium text-foreground">
                      Next lesson scheduled for{" "}
                      {format(courseData?.nextLessonDate, "EEEE, MMMM d, yyyy")}
                    </p>
                  </div>
                </div>
              )}

            {/* Group Class Schedule */}
            {courseData?.lessonType === "group" &&
              courseData?.nextLessonDate && (
                <div className="flex items-center space-x-3">
                  <Icon
                    name="Calendar"
                    size={16}
                    className="text-text-secondary"
                  />
                  <div>
                    <p className="text-sm font-medium text-foreground">
                      Next lesson scheduled for{" "}
                      {format(courseData?.nextLessonDate, "EEEE, MMMM d, yyyy")}
                    </p>
                  </div>
                </div>
              )}

            {/* Location for Group Classes */}
            {courseData?.lessonType === "group" && courseData?.location && (
              <div className="flex items-center space-x-3">
                <Icon name="MapPin" size={16} className="text-text-secondary" />
                <div>
                  <p className="text-sm font-medium text-foreground">
                    {(courseData?.mode).toUpperCase()} class
                  </p>
                  <p className="text-sm text-text-secondary">
                    {courseData?.location}
                  </p>
                </div>
              </div>
            )}

            {/* Student */}
            {selectedStudent && (
              <div className="pl-6">
                <div className="flex items-center space-x-2">
                  <Image
                    src={selectedStudent?.profileImage?.url}
                    alt={selectedStudent?.name}
                    className="w-8 h-8 rounded-full object-cover"
                  />
                  <div>
                    <p className="text-body2 font-medium text-foreground">
                      {selectedStudent?.name}
                    </p>
                  </div>
                </div>
              </div>
            )}
          </div>
        </div>

        {/* Total */}
        <div className="border-y border-border py-4 !mt-4">
          <div className="flex justify-between items-center">
            <span className="text-lg font-semibold text-foreground">Total</span>
            <span className="text-xl font-bold text-primary">${total}</span>
          </div>
        </div>
      </div>
    </div>
  );
};

export default BookingSummary;
