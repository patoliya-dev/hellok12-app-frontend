import React from "react";
import Icon from "../../../../components/AppIcon";
import Image from "../../../../components/AppImage";
import { useSelector } from "react-redux";
import { selectSelectedTeacher } from "../../../../reducers/teachers/teachersSlice";

const ClassDetails = ({ courseData, type = "enroll" }) => {
  // Always read current teacher from Redux (selectedTeacher) per your requirements
  const teacher = useSelector(selectSelectedTeacher) || {};

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

  const getClassTypeBadge = (type) => {
    const isOneOnOne = type === "1-on-1";
    return (
      <span
        className={`inline-flex items-center px-2.5 py-0.5 rounded-full text-xs font-medium ${isOneOnOne
          ? "bg-blue-100 text-blue-800"
          : "bg-green-100 text-green-800"
          }`}
      >
        <Icon name={isOneOnOne ? "User" : "Users"} size={12} className="mr-1" />
        {type}
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
              src={teacher?.profileImage || courseData?.teacher?.profileImage}
              alt={"No Image"}
              className="w-12 h-12 rounded-full object-cover"
            />
            <div className="absolute -bottom-1 -right-1 w-4 h-4 bg-green-500 border-2 border-white rounded-full"></div>
          </div>
          <div className="flex-1">
            <p className="font-medium text-foreground">
              {teacher?.name || courseData?.teacher?.name}
            </p>
            <p className="text-sm text-text-secondary">Instructor</p>
          </div>
          <div className="space-y-1 flex flex-col items-end gap-2">
            {getClassTypeBadge(courseData?.mode)}
            {courseData?.ownerType === 'school' && <div className="flex items-center">
              <Icon name="SchoolIcon" size={22} className="mr-2" />
              <span className="text-body2 text-text-secondary">
                {teacher?.school || courseData?.teacher?.school}
              </span>
            </div>}
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
          <div className="space-y-1">
            <div className="flex items-center text-text-secondary text-sm">
              <Icon name="Clock" size={16} className="mr-2" />
              Duration
            </div>
            <p className="font-medium text-foreground">
              {formatDuration(courseData?.duration)}
            </p>
          </div>

          {type === "enroll" && (
            <div className="space-y-1">
              <div className="flex items-center text-text-secondary text-sm">
                <Icon name="DollarSign" size={16} className="mr-2" />
                Price
              </div>
              <p className="font-medium text-foreground">${courseData?.price}</p>
            </div>
          )}

          {courseData?.type === "Group" && (
            <>
              <div className="space-y-1">
                <div className="flex items-center text-text-secondary text-sm">
                  <Icon name="MapPin" size={16} className="mr-2" />
                  Location
                </div>
                <p className="font-medium text-foreground text-sm">
                  {courseData?.location}
                </p>
              </div>

              <div className="space-y-1">
                <div className="flex items-center text-text-secondary text-sm">
                  <Icon name="Users" size={16} className="mr-2" />
                  Enrollment
                </div>
                <p className="font-medium text-foreground">
                  {courseData?.enrolledStudents}/{courseData?.maxStudents}{" "}
                  students
                </p>
              </div>
            </>
          )}

          {type === "trial" && (
            <div className="space-y-1">
              <span className="inline-flex items-center px-3.5 py-1.5 rounded-full text-xs font-medium bg-[#DDF2FF] text-[#009DFF]">
                <Icon name={"Gift"} size={16} className="mr-1" />
                Trial Lessons
              </span>
            </div>
          )}

          {courseData?.type === "1-on-1" && (
            <div className="col-span-2 space-y-1">
              <div className="flex items-center text-text-secondary text-sm">
                <Icon name="Globe" size={16} className="mr-2" />
                Teacher Timezone
              </div>
              <p className="font-medium text-foreground">
                {(teacher?.timezone || courseData?.teacher?.timezone)
                  ?.replace("_", " ")
                  ?.replace("America/", "")}
              </p>
            </div>
          )}
        </div>

        {/* Group Class Schedule */}
        {courseData?.type === "Group" && courseData?.groupSchedule && (
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
        {courseData?.type === "Group" && (
          <div className="bg-primary/10 border border-primary/20 rounded-lg p-3">
            <div className="flex items-center space-x-2">
              <Icon name="Users" size={16} className="text-primary" />
              <span className="text-sm font-medium text-primary">
                {courseData?.maxStudents - courseData?.enrolledStudents} spots
                remaining
              </span>
            </div>
          </div>
        )}
      </div>
    </div>
  );
};

export default ClassDetails;
