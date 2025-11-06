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

  const getTypeIcon = () => (courseItem?.type === "1-on-1" ? "User" : "Users");

  const getTypeBadgeColor = () =>
    courseItem?.type === "1-on-1"
      ? "bg-primary text-primary-foreground"
      : "bg-accent text-accent-foreground";

  const formatSchedule = () => {
    if (courseItem?.type === "1-on-1") return "Flexible scheduling available";
    return `${courseItem?.schedule?.days?.join(", ")} at ${
      courseItem?.schedule?.time
    }`;
  };

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
            <span>{courseItem?.duration} minutes</span>
          </div>
          <div className="flex items-center gap-2 text-sm text-text-secondary">
            <Icon name="Calendar" size={16} />
            <span>{formatSchedule()}</span>
          </div>
          {courseItem?.type === "Group" && courseItem?.location && (
            <div className="flex items-center gap-2 text-sm text-text-secondary">
              <Icon name="MapPin" size={16} />
              <span>{courseItem?.location}</span>
            </div>
          )}
          <div className="flex items-center gap-2 text-sm text-text-secondary">
            <Icon name="Users" size={16} />
            <span>
              {courseItem?.type === "1-on-1"
                ? "Individual session"
                : `${courseItem?.enrolledStudents}/${courseItem?.maxStudents} students enrolled`}
            </span>
          </div>
        </div>
      </div>

      <div>
        <div className="flex items-center justify-between pt-4 border-t border-border">
          <div className="flex flex-col">
            <span className="text-2xl font-bold text-foreground">
              ${courseItem?.price}
            </span>
          </div>
          <div className="flex items-center gap-2">
            {courseItem?.type === "Group" &&
            courseItem?.enrolledStudents &&
            courseItem?.maxStudents &&
            courseItem.enrolledStudents >= courseItem.maxStudents ? (
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

        <div className="mt-6 bg-warning/10">
          <span
            className={`inline-flex items-center gap-1 px-2 py-1 rounded-full text-xs font-medium ${getTypeBadgeColor()}`}
          >
            <Icon name={getTypeIcon()} size={12} />
            {courseItem?.type}
          </span>
        </div>
      </div>
    </div>
  );
};

export default CourseCard;
