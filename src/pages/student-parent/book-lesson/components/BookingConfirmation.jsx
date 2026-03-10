import React, { useMemo } from "react";
import { useSelector } from "react-redux";
import Icon from "../../../../components/AppIcon";
import Image from "../../../../components/AppImage";
import { selectSelectedTeacher } from "reducers/teachers/teachersSlice";
import {
  formatDateLong,
  formatTimeShort,
  minutesBetween,
  pickNextUpcomingLesson,
  safeNum,
  safeStr,
} from "./BookLessonHelper";
import { toDate } from "date-fns";

const BookingConfirmation = ({
  courseData,
  selectedPaymentMethod,
  selectedStudent,
  type = "enroll",
}) => {
  const selectedTeacher = useSelector(selectSelectedTeacher);
  /**
   * Pick next lesson from courseData.lessons
   */
  const nextLesson = useMemo(() => {
    return pickNextUpcomingLesson(courseData?.lessons || []);
  }, [courseData?.lessons]);

  const nextLessonStart = nextLesson?.start || null;
  const nextLessonEnd = nextLesson?.end || null;

  const scheduleDateText = formatDateLong(nextLessonStart);
  const scheduleTimeText = formatTimeShort(nextLessonStart);

  const durationMinutes =
    minutesBetween(nextLessonStart, nextLessonEnd) ??
    safeNum(nextLesson?.raw?.schedule?.duration, null);

  const scheduleDurationText = durationMinutes ? `${durationMinutes} min` : "-";

  /**
   * Badge: supports lessonType + mode
   */
  const getBadge = (value) => {
    const v = safeStr(value);

    if (!v) return null;

    const isMode = v === "online" || v === "in-person";
    const isOneOnOne = v === "1-on-1";
    const isGroup = v === "group";

    const baseCls =
      "inline-flex items-center px-2.5 py-1 rounded-full text-xs font-medium";

    // Mode badge (online/in-person)
    if (isMode) {
      return (
        <span
          className={`${baseCls} ${
            v === "online"
              ? "bg-green-100 text-green-800"
              : "bg-blue-100 text-blue-800"
          }`}
        >
          {v === "online" ? (
            <Image
              src={"/assets/images/video-camera.svg"}
              className="mr-1 w-4 h-4"
            />
          ) : (
            <Icon name="MapPin" size={12} className="mr-1" />
          )}
          {v}
        </span>
      );
    }

    // Lesson type badge (group / 1-on-1)
    return (
      <span
        className={`${baseCls} ${
          isOneOnOne
            ? "bg-blue-100 text-blue-800"
            : "bg-green-100 text-green-800"
        }`}
      >
        <Icon name={isOneOnOne ? "User" : "Users"} size={12} className="mr-1" />
        {isGroup || isOneOnOne ? v : v}
      </span>
    );
  };

  const courseStart = toDate(courseData?.startDate);
  const courseEnd = toDate(courseData?.endDate);

  return (
    <div className="bg-card border border-border rounded-lg p-6 shadow-elevation-1">
      <div className="flex items-center space-x-3 mb-6">
        <Icon name="CheckCircle" size={24} className="text-success" />
        <h3 className="text-xl font-semibold text-foreground">
          Confirm Your Booking
        </h3>
      </div>

      {/* Class Details */}
      {type === "enroll" && (
        <div className="mb-6">
          <h4 className="font-medium text-foreground mb-3">Class Details</h4>
          <div className="bg-muted rounded-lg p-4">
            <div className="flex flex-col gap-5 md:gap-0 md:flex-row md:justify-between">
              <div className="flex items-start space-x-4">
                <Image
                  src={courseData?.introImageRef?.url}
                  alt={courseData?.title || "Course image"}
                  className="w-12 h-12 rounded-full object-cover flex-shrink-0"
                />
                <div className="flex-1">
                  <h5 className="font-medium text-foreground">
                    {courseData?.title || "-"}
                  </h5>
                  <p className="text-sm text-muted-foreground mb-2">
                    with {selectedTeacher?.name || "-"}
                  </p>

                  <div className="flex items-center space-x-4 text-sm text-muted-foreground">
                    <div className="flex items-center space-x-1">
                      <Icon name="Clock" size={14} />
                      <span>
                        {courseStart
                          ? courseStart.toISOString().slice(0, 10)
                          : "-"}{" "}
                        {courseEnd
                          ? `- ${courseEnd.toISOString().slice(0, 10)}`
                          : ""}
                      </span>
                    </div>
                  </div>
                </div>
              </div>

              <div className="flex flex-col md:items-end gap-5">
                {selectedTeacher?.school && (
                  <div className="flex items-center">
                    <Icon name="SchoolIcon" size={22} className="mr-2" />
                    {selectedTeacher?.schoolName && (
                      <span className="text-body2 text-brand-gray-500">
                        {selectedTeacher?.schoolName}
                      </span>
                    )}
                  </div>
                )}

                <div className="flex items-center gap-2 flex-wrap">
                  {getBadge(courseData?.lessonType)}
                  {getBadge(courseData?.mode)}
                </div>
              </div>
            </div>
          </div>
        </div>
      )}

      {/* Schedule Details */}
      <div className="mb-6">
        <h4 className="font-medium text-foreground mb-3">Schedule</h4>

        {!nextLessonStart ? (
          <div className="bg-muted rounded-lg p-4 text-sm text-muted-foreground">
            Schedule not available yet.
          </div>
        ) : (
          <div className="space-y-2 text-sm">
            <div className="flex justify-between">
              <span className="text-muted-foreground">First lesson date:</span>
              <span className="font-medium text-foreground">
                {scheduleDateText}
              </span>
            </div>
            <div className="flex justify-between">
              <span className="text-muted-foreground">Time:</span>
              <span className="font-medium text-foreground">
                {scheduleTimeText}
              </span>
            </div>
            <div className="flex justify-between">
              <span className="text-muted-foreground">Duration:</span>
              <span className="font-medium text-foreground">
                {scheduleDurationText}
              </span>
            </div>
          </div>
        )}
      </div>

      {/* Student Information */}
      <div className="mb-6">
        <h4 className="font-medium text-foreground mb-3">
          Student Information
        </h4>
        <div className="space-y-2 text-sm">
          <div className="flex justify-between">
            <span className="text-muted-foreground">Name:</span>
            <span className="font-medium text-foreground">
              {selectedStudent?.name || "-"}
            </span>
          </div>
          <div className="flex justify-between">
            <span className="text-muted-foreground">Email:</span>
            <span className="font-medium text-foreground">
              {selectedStudent?.email || "-"}
            </span>
          </div>
          <div className="flex justify-between">
            <span className="text-muted-foreground">Phone:</span>
            <span className="font-medium text-foreground">
              {selectedStudent?.phone || "-"}
            </span>
          </div>
          {selectedStudent?.grade && (
            <div className="flex justify-between">
              <span className="text-muted-foreground">Grade:</span>
              <span className="font-medium text-foreground">
                {selectedStudent?.grade}
              </span>
            </div>
          )}
        </div>
      </div>

      {/* Payment Summary */}
      {type === "enroll" && (
        <>
          <div className="mb-6">
            <h4 className="font-medium text-foreground mb-3">
              Payment Summary
            </h4>
            <div className="flex justify-between text-sm">
              <span className="text-muted-foreground">Course Fee:</span>
              <span className="font-medium text-foreground">
                $
                {safeNum(
                  courseData?.pricing?.effectivePrice ?? courseData?.price,
                  0,
                ).toFixed(2)}
              </span>
            </div>
            {Number(courseData?.pricing?.completedLessons || 0) > 0 && (
              <div className="mt-2 text-xs text-muted-foreground">
                Adjusted for {courseData?.pricing?.completedLessons} completed
                lesson(s).
              </div>
            )}
          </div>

          {/* Payment Method */}
          <div className="mb-6">
            <h4 className="font-medium text-foreground mb-3">Payment Method</h4>
            <div className="flex justify-between p-3 bg-muted rounded-lg text-[16px]">
              <div className="flex items-center space-x-3">
                <Icon name="CreditCard" size={20} className="text-primary" />
                <span className="text-foreground font-medium">Card</span>
              </div>
              <span className="text-brand-gray-800 font-medium">
                {selectedPaymentMethod?.data?.last4 || "****"}
              </span>
            </div>
          </div>
        </>
      )}
    </div>
  );
};

export default BookingConfirmation;
