import React from "react";
import Icon from "../ui/Icon";
import Button from "../ui/Button";

const EnrollmentSection = ({
  course,
  onEnroll,
  onTrial,
  isAlreadyPurchased = false,
}) => {
  if (!course) return null;

  const asNumber = (value) => {
    const n = Number(value);
    return Number.isFinite(n) ? n : 0;
  };

  const totalCoursePrice = asNumber(
    course?.pricing?.totalPrice ?? course?.price,
  );
  const effectivePrice = asNumber(
    course?.pricing?.effectivePrice ?? course?.price,
  );
  const outdatedDeductionFromApi = asNumber(
    course?.pricing?.outdatedLessonsDeduction ??
      course?.pricing?.outdatedDeduction ??
      course?.pricing?.deductedForOutdatedLessons ??
      course?.pricing?.deductedAmount,
  );
  const outdatedLessonsDeduction =
    outdatedDeductionFromApi > 0
      ? outdatedDeductionFromApi
      : Math.max(totalCoursePrice - effectivePrice, 0);

  const formatPrice = (value) => `$${asNumber(value).toFixed(2)}`;

  return (
    <div className="bg-card rounded-lg border border-border shadow-soft overflow-hidden">
      {/* Price Header */}
      <div className="p-6 border-b border-border">
        <div className="text-center">
          <div className="flex items-center justify-center space-x-2 mb-2">
            <span className="text-3xl font-bold text-foreground">
              {formatPrice(effectivePrice)}
            </span>
            {course?.originalPrice && course?.originalPrice > course?.price && (
              <span className="text-lg text-muted-foreground line-through">
                ${course?.originalPrice}
              </span>
            )}
          </div>
          {course?.originalPrice && course?.originalPrice > course?.price && (
            <div className="bg-success/10 text-success px-3 py-1 rounded-full text-sm font-medium inline-block">
              Save ${course?.originalPrice - course?.price}
            </div>
          )}
          {outdatedLessonsDeduction ? (
            <div className="mt-3 border border-border rounded-md p-3 text-left bg-muted/20">
              <div className="flex items-center justify-between text-sm text-muted-foreground">
                <span>Total Course Price</span>
                <span className="font-medium text-foreground">
                  {formatPrice(totalCoursePrice)}
                </span>
              </div>
              <div className="flex items-center justify-between text-sm mt-1 text-muted-foreground">
                <span>Deduction (Outdated Lessons)</span>
                <span className="font-medium text-red-700">
                  -{formatPrice(outdatedLessonsDeduction)}
                </span>
              </div>
              <div className="flex items-center justify-between text-sm mt-2 pt-2 border-t border-border">
                <span className="font-medium text-foreground">You Pay</span>
                <span className="font-semibold text-foreground">
                  {formatPrice(effectivePrice)}
                </span>
              </div>
            </div>
          ) : (
            <></>
          )}
        </div>
      </div>

      {/* Course Highlights */}
      <div className="p-6 space-y-4">
        <h3 className="font-semibold text-foreground">This course includes:</h3>

        <div className="space-y-3">
          <div className="flex items-center space-x-3">
            <Icon
              name="BookOpen"
              size={16}
              className="text-primary flex-shrink-0"
            />
            <span className="text-sm text-muted-foreground">
              {course?.lessons?.length} comprehensive lessons
            </span>
          </div>
          <div className="flex items-center space-x-3">
            <Icon
              name="Clock"
              size={16}
              className="text-purple-700 flex-shrink-0"
            />
            <span className="text-sm text-muted-foreground">
              {course?.lessons?.reduce(
                (total, lesson) =>
                  total + parseInt(lesson?.schedule.duration || "0"),
                0,
              )}{" "}
              minutes of content
            </span>
          </div>
          <div className="flex items-center space-x-3">
            <Icon
              name="Smartphone"
              size={16}
              className="text-accent flex-shrink-0"
            />
            <span className="text-sm text-muted-foreground">
              Mobile and desktop access
            </span>
          </div>
          <div className="flex items-center space-x-3">
            <Icon
              name="Award"
              size={16}
              className="text-warning flex-shrink-0"
            />
            <span className="text-sm text-muted-foreground">
              Certificate of completion
            </span>
          </div>
          <div className="flex items-center space-x-3">
            <Icon
              name="MessageCircle"
              size={16}
              className="text-primary flex-shrink-0"
            />
            <span className="text-sm text-muted-foreground">
              Direct instructor support
            </span>
          </div>
        </div>

        {/* Enrollment Buttons */}
        <div className="space-y-3 pt-4">
          <Button
            size="lg"
            onClick={onEnroll}
            className="w-full"
            disabled={isAlreadyPurchased}
          >
            <Icon name="ShoppingCart" size={16} className="mr-2" />
            {isAlreadyPurchased ? "Already Purchased" : "Enroll Now"}
          </Button>

          {course?.isTrialAvailable && (
            <Button
              variant="outline"
              size="lg"
              onClick={onTrial}
              className="w-full"
              disabled={isAlreadyPurchased}
            >
              <Icon name="Play" size={16} className="mr-2" />
              Start Free Trial
            </Button>
          )}
        </div>
      </div>
    </div>
  );
};

export default EnrollmentSection;
