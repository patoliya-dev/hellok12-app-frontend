import React from "react";
import Icon from "../../../../components/AppIcon";
import Image from "../../../../components/AppImage";

const BookingConfirmation = ({
  courseData,
  selectedPaymentMethod,
  teacherData,
  selectedStudent,
  type = "enroll",
}) => {
  const formatDate = (date) => {
    return date.toLocaleDateString("en-US", {
      weekday: "long",
      year: "numeric",
      month: "long",
      day: "numeric",
    });
  };

  const getClassTypeBadge = (type) => {
    const isOneOnOne = type === "1-on-1";
    const isOnlineCourse = type === "Online Course";
    return (
      <span
        className={`inline-flex items-center px-2.5 py-1 rounded-full text-xs font-medium ${isOneOnOne
            ? "bg-blue-100 text-blue-800"
            : "bg-green-100 text-green-800"
          }`}
      >
        {isOnlineCourse ? (
          <Image
            src={"/assets/images/video-camera.svg"}
            className="mr-1 w-4 h-4"
          />
        ) : (
          <Icon
            name={isOneOnOne ? "User" : "Users"}
            size={12}
            className="mr-1"
          />
        )}
        {type}
      </span>
    );
  };

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
                  src={teacherData?.profileImage}
                  alt={teacherData?.name}
                  className="w-12 h-12 rounded-full object-cover flex-shrink-0"
                />
                <div className="flex-1">
                  <h5 className="font-medium text-foreground">
                    {courseData?.title}
                  </h5>
                  <p className="text-sm text-muted-foreground mb-2">
                    with {teacherData?.name}
                  </p>
                  <div className="flex items-center space-x-4 text-sm text-muted-foreground">
                    <div className="flex items-center space-x-1">
                      <Icon name="Clock" size={14} />
                      <span>{courseData?.duration} minutes</span>
                    </div>
                  </div>
                </div>
              </div>
              <div className="flex flex-col md:items-end gap-5">
                <div className="flex items-center">
                  <Icon name="SchoolIcon" size={22} className="mr-2" />
                  <span className="text-body2 text-brand-gray-500">
                    {teacherData?.school}
                  </span>
                </div>
                <div className="flex items-center gap-2 flex-wrap">
                  {getClassTypeBadge(courseData?.type)}
                  {getClassTypeBadge(courseData?.courseType)}
                </div>
              </div>
            </div>
          </div>
        </div>
      )}

      {/* Schedule Details */}
      <div className="mb-6">
        <h4 className="font-medium text-foreground mb-3">Schedule</h4>
        <div className="space-y-2 text-sm">
          <div className="flex justify-between">
            <span className="text-muted-foreground">Date:</span>
            <span className="font-medium text-foreground">
              {formatDate(new Date(Date.now()))}
            </span>
          </div>
          <div className="flex justify-between">
            <span className="text-muted-foreground">Time:</span>
            <span className="font-medium text-foreground">
              {courseData?.groupSchedule?.time}
            </span>
          </div>
        </div>
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
              {selectedStudent?.name}
            </span>
          </div>
          <div className="flex justify-between">
            <span className="text-muted-foreground">Email:</span>
            <span className="font-medium text-foreground">
              {selectedStudent?.email}
            </span>
          </div>
          <div className="flex justify-between">
            <span className="text-muted-foreground">Phone:</span>
            <span className="font-medium text-foreground">
              {selectedStudent?.phone}
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
          {/* Payment Summary */}
          <div className="mb-6">
            <h4 className="font-medium text-foreground mb-3">
              Payment Summary
            </h4>
            <div className="flex justify-between text-sm">
              <span className="text-muted-foreground">Lesson Fee:</span>
              <span className="font-medium text-foreground">
                ${courseData?.price.toFixed(2)}
              </span>
            </div>
          </div>

          {/* Payment Method */}
          <div className="mb-6">
            <h4 className="font-medium text-foreground mb-3">Payment Method</h4>
            <div className="flex justify-between p-3 bg-muted rounded-lg text-[16px]">
              <div className="flex items-center space-x-3 ">
                <Icon name="CreditCard" size={20} className="text-primary" />
                <span className="text-foreground font-medium">Card</span>
              </div>
              <span className="text-brand-gray-800 font-medium">
                {selectedPaymentMethod?.data?.last4}
              </span>
            </div>
          </div>
        </>
      )}
    </div>
  );
};

export default BookingConfirmation;
