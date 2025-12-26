import React, { useMemo } from "react";
import Icon from "../../../../components/AppIcon";
import Image from "../../../../components/AppImage";
import { useSelector } from "react-redux";
import { selectSelectedTeacher } from "../../../../reducers/teachers/teachersSlice";
import { formatLessonDate } from "../../../../utils/formatters";
import { formatAddressOneLine } from "../../../../utils/utils";

const ClassDetails = ({ courseData, type = "enroll", address = "" }) => {
  // Always read current teacher from Redux (selectedTeacher) per your requirements
  const teacher = useSelector(selectSelectedTeacher) || {};

  // --- Derived values (stable, readable, no logic changes) ---
  const lessonType = courseData?.lessonType; // "1-on-1" | "group"
  const mode = courseData?.mode; // "online" | "in-person"
  const isGroup = lessonType === "group";
  const isOneOnOne = lessonType === "1-on-1";
  const isInPerson = mode === "in-person";
  const isOnline = mode === "online";

  const isInPersonOneOnOne = useMemo(
    () => isInPerson && isOneOnOne,
    [isInPerson, isOneOnOne]
  );

  const teacherName = teacher?.name || courseData?.teacher?.name;
  const teacherImage =
    teacher?.profileImage || courseData?.teacher?.profileImage;
  const teacherSchool = teacher?.school || courseData?.teacher?.school;

  const startDateLabel = courseData?.startDate
    ? formatLessonDate(courseData.startDate.slice(0, 10))
    : "";
  const endDateLabel = courseData?.endDate
    ? formatLessonDate(courseData.endDate.slice(0, 10))
    : "";

  const durationText =
    startDateLabel && endDateLabel
      ? `(${startDateLabel}) to (${endDateLabel})`
      : startDateLabel
      ? `(${startDateLabel})`
      : endDateLabel
      ? `(${endDateLabel})`
      : "";

  const hasEnrollNumbers =
    (courseData?.enrolledCount === 0 || courseData?.enrolledCount) &&
    courseData?.studentCapacity;

  const enrollmentText = hasEnrollNumbers
    ? `${courseData.enrolledCount / courseData.studentCapacity} students`
    : "";

  const remainingSpots =
    typeof courseData?.studentCapacity === "number" &&
    typeof courseData?.enrolledCount === "number"
      ? courseData.studentCapacity - courseData.enrolledCount
      : null;

  // Location display rules (keep existing behaviour)
  const showOneOnOneLocation = isInPersonOneOnOne && address?.line1;
  const showGroupLocation = isGroup && isInPerson;

  const resolvedGroupAddress =
    formatAddressOneLine(courseData?.address) || formatAddressOneLine(address);

  const getClassTypeBadge = (value) => {
    const oneOnOne = value === "1-on-1";
    return (
      <span className="inline-flex items-center rounded-full bg-blue-100 px-2.5 py-0.5 text-xs font-medium text-blue-800">
        <Icon name={oneOnOne ? "User" : "Users"} size={12} className="mr-1" />
        {value}
      </span>
    );
  };

  return (
    <div className="bg-card border border-border rounded-lg p-6">
      <div className="space-y-4">
        {/* Teacher Info */}
        <div className="flex items-center space-x-3 p-3 bg-muted rounded-lg">
          <div className="relative">
            <Image
              src={teacherImage}
              alt="No Image"
              className="w-12 h-12 rounded-full object-cover"
            />
            <div className="absolute -bottom-1 -right-1 w-4 h-4 bg-green-500 border-2 border-white rounded-full" />
          </div>

          <div className="flex-1 min-w-0">
            <p className="font-medium text-foreground truncate">
              {teacherName}
            </p>
            <p className="text-sm text-text-secondary">Instructor</p>
          </div>

          <div className="space-y-1 flex flex-col items-end gap-2">
            {getClassTypeBadge(lessonType)}
            {courseData?.ownerType === "school" && (
              <div className="flex items-center">
                <Icon name="SchoolIcon" size={22} className="mr-2" />
                <span className="text-body2 text-text-secondary truncate max-w-[180px]">
                  {teacherSchool}
                </span>
              </div>
            )}
          </div>
        </div>

        {/* Class Title & Type */}
        <div className="space-y-2">
          <h1 className="text-h5 font-semibold text-foreground">
            {courseData?.title}
          </h1>
          <p className="text-text-secondary text-body2 leading-relaxed">
            {courseData?.description}
          </p>
        </div>

        {/* Class Details Grid */}
        <div className="grid grid-cols-2 gap-4">
          {/* Duration */}
          <div className="space-y-1">
            <div className="flex items-center text-text-secondary text-sm">
              <Icon name="Clock" size={16} className="mr-2" />
              Duration
            </div>
            <p className="font-medium text-foreground">
              <span>{durationText}</span>
            </p>
          </div>

          {/* Price */}
          {type === "enroll" && (
            <div className="space-y-1">
              <div className="flex items-center text-text-secondary text-sm">
                <Icon name="DollarSign" size={16} className="mr-2" />
                Price
              </div>
              <p className="font-medium text-foreground">
                ${courseData?.price}
              </p>
            </div>
          )}

          {/* Location for in-person 1-on-1 (address prop) */}
          {showOneOnOneLocation && (
            <div className="space-y-1">
              <div className="flex items-center text-text-secondary text-sm">
                <Icon name="MapPin" size={16} className="mr-2" />
                Location
              </div>
              <p className="font-medium text-foreground text-sm">
                {formatAddressOneLine(address)}
              </p>
            </div>
          )}

          {/* Group mode blocks */}
          {isGroup && (
            <>
              {/* Location for in-person group */}
              {showGroupLocation && (
                <div className="space-y-1">
                  <div className="flex items-center text-text-secondary text-sm">
                    <Icon name="MapPin" size={16} className="mr-2" />
                    Location
                  </div>
                  <p className="font-medium text-foreground text-sm">
                    {resolvedGroupAddress}
                  </p>
                </div>
              )}

              {/* Enrollment */}
              <div className="space-y-1">
                <div className="flex items-center text-text-secondary text-sm">
                  <Icon name="Users" size={16} className="mr-2" />
                  Enrollment
                </div>
                <p className="font-medium text-foreground">{enrollmentText}</p>
              </div>
            </>
          )}

          {/* Mode badge */}
          {isOnline && (
            <div>
              <span className="inline-flex items-center gap-1 px-2 py-1 rounded-full text-xs bg-[#10b981]/5 text-[#10b981]">
                <Icon name="Video" size={12} />
                Online
              </span>
            </div>
          )}

          {isInPerson && (
            <div>
              <span className="inline-flex items-center gap-1 px-2 py-1 rounded-full text-xs bg-[#10b981]/5 text-[#10b981]">
                <Icon name="MapPin" size={12} />
                In-Person
              </span>
            </div>
          )}

          {/* Trial */}
          {type === "trial" && (
            <div className="space-y-1">
              <span className="inline-flex items-center px-3.5 py-1.5 rounded-full text-xs font-medium bg-[#DDF2FF] text-[#009DFF]">
                <Icon name="Gift" size={16} className="mr-1" />
                Trial Lessons
              </span>
            </div>
          )}
        </div>

        {/* Group Class Schedule */}
        {isGroup && courseData?.groupSchedule && (
          <div className="border-t border-border pt-4">
            <h3 className="font-medium text-foreground mb-3">Class Schedule</h3>
            <div className="space-y-2">
              <div className="flex items-start space-x-3">
                <Icon
                  name="Calendar"
                  size={16}
                  className="text-text-secondary mt-0.5"
                />
                <div>
                  <p className="font-medium text-foreground">
                    {courseData?.groupSchedule?.days?.join(", ")}
                  </p>
                  <p className="text-sm text-text-secondary">
                    {courseData?.groupSchedule?.time}
                  </p>
                </div>
              </div>
              <div className="flex items-start space-x-3">
                <Icon
                  name="Clock"
                  size={16}
                  className="text-text-secondary mt-0.5"
                />
                <div>
                  <p className="text-sm text-text-secondary">Next Session</p>
                  <p className="font-medium text-foreground">
                    {courseData?.groupSchedule?.nextSession}
                  </p>
                </div>
              </div>
            </div>
          </div>
        )}

        {/* Enrollment Status for Group Classes */}
        {isGroup && remainingSpots !== null && (
          <div className="bg-primary/10 border border-primary/20 rounded-lg p-3">
            <div className="flex items-center space-x-2">
              <Icon name="Users" size={16} className="text-primary" />
              <span className="text-sm font-medium text-primary">
                {remainingSpots} spots remaining
              </span>
            </div>
          </div>
        )}
      </div>
    </div>
  );
};

export default ClassDetails;
