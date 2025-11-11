import React from "react";
import { useNavigate } from "react-router-dom";
import { useSelector } from "react-redux";
import Icon from "../../components/ui/Icon";
import Button from "../../components/ui/Button";
import { selectAuthUser } from "reducers/auth/authSelectors";
import { getRolePath } from "../../utils/rolePath";

const CourseCard = ({ courseItem, teacherId }) => {
  const navigate = useNavigate();
  const authUser = useSelector(selectAuthUser);

  const handleBookNow = () => {
    // router.push({
    //   pathname: "/class-booking-flow",
    //   query: {
    //     classId: courseItem?.id,
    //     teacherId: teacherId,
    //     classType: courseItem?.type,
    //     className: courseItem?.title,
    //     price: courseItem?.price
    //   } as any
    // });

    const params = new URLSearchParams({
      classId: courseItem.id,
      teacherId: teacherId,
      classType: courseItem.type,
      className: courseItem.title,
      price: courseItem.price.toString(),
    });

    navigate(
      getRolePath(
        authUser?.role || "student",
        `course-details/${courseItem.id}`
      )
    );
  };

  const getTypeIcon = () =>
    courseItem?.lessonType === "1-on-1" ? "User" : "Users";

  return (
    <div className="bg-card border border-border rounded-lg p-6 hover:shadow-interactive transition-smooth flex flex-col justify-between">
      <div>
        <div className="flex items-start justify-between mb-4">
          <div className="flex-1">
            <div className="flex items-center gap-2 mb-2">
              <h3 className="text-lg font-semibold text-foreground">
                {courseItem?.title}
              </h3>
            </div>
            <p className="text-text-secondary text-sm mb-3 line-clamp-2">
              {courseItem?.description}
            </p>
          </div>
        </div>

        <div className="space-y-3 mb-4">
          <div className="flex items-center gap-2 text-sm text-text-secondary">
            <Icon name="Clock" size={16} />
            <span>
              {courseItem?.startDate.slice(0, 10)}{" "}
              {courseItem?.endDate && `- ${courseItem?.endDate.slice(0, 10)}`}
            </span>
          </div>
          {courseItem?.lessonType === "group" && courseItem?.location && (
            <div className="flex items-center gap-2 text-sm text-text-secondary">
              <Icon name="MapPin" size={16} />
              <span>{courseItem?.location}</span>
            </div>
          )}
          <div className="flex items-center gap-2 text-sm text-text-secondary">
            <Icon name="Users" size={16} />
            <span>
              {courseItem?.lessonType === "1-on-1"
                ? "Individual session"
                : `${courseItem?.enrolledCount}/${courseItem?.studentCapacity} students enrolled`}
            </span>
          </div>
        </div>
      </div>

      <div className="mt-10">
        <div className="flex items-center justify-between pt-4 border-t border-border">
          <div className="flex flex-col">
            <span className="text-2xl font-bold text-foreground">
              ${courseItem?.price}
            </span>
          </div>
          <div className="flex items-center gap-2">
            {courseItem?.lessonType === "group" &&
            courseItem?.enrolledCount &&
            courseItem?.studentCapacity &&
            courseItem.enrolledCount >= courseItem.studentCapacity ? (
              <Button variant="secondary" disabled>
                Class Full
              </Button>
            ) : (
              <Button
                variant="default"
                iconName="Calendar"
                iconPosition="left"
                onClick={handleBookNow}
              >
                Book Now
              </Button>
            )}
          </div>
        </div>

        <div className="mt-6 bg-warning/10 flex gap-3">
          <span
            className={`inline-flex items-center gap-1 px-2 py-1 rounded-full text-xs bg-[#2563eb]/5 text-[#2563eb]`}
          >
            <Icon name={getTypeIcon()} size={12} />
            {courseItem?.lessonType.charAt(0).toUpperCase() +
              courseItem?.lessonType.slice(1)}
          </span>
          {courseItem.mode === "online" && (
            <span className="inline-flex items-center gap-1 px-2 py-1 rounded-full text-xs bg-[#10b981]/10 text-[#10b981]">
              <Icon name="Video" size={12} />
              Online
            </span>
          )}
          {courseItem.mode === "in-person" && (
            <span className="inline-flex items-center gap-1 px-2 py-1 rounded-full text-xs bg-[#10b981]/10 text-[#10b981]">
              <Icon name="MapPin" size={12} />
              In-Person
            </span>
          )}
          {courseItem?.isTrialAvailable && (
            <span className="inline-flex items-center gap-1 px-2 py-1 rounded-full text-xs bg-[#0ea5e9]/10 text-[#0ea5e9]">
              <Icon name="Gift" size={12} />
              Trial Lesson
            </span>
          )}
        </div>
      </div>
    </div>
  );
};

export default CourseCard;
