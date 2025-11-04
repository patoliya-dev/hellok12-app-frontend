import React from "react";
import Icon from "../ui/Icon";
import Button from "../ui/Button";

const EnrollmentSection = ({ course, onEnroll, onTrial }) => {
  if (!course) return null;

  return (
    <div className="bg-card rounded-lg border border-border shadow-soft overflow-hidden">
      {/* Price Header */}
      <div className="p-6 border-b border-border">
        <div className="text-center">
          <div className="flex items-center justify-center space-x-2 mb-2">
            <span className="text-3xl font-bold text-foreground">
              ${course?.price}
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
              {course?.totalLessons} comprehensive lessons
            </span>
          </div>
          <div className="flex items-center space-x-3">
            <Icon
              name="Clock"
              size={16}
              className="text-secondary flex-shrink-0"
            />
            <span className="text-sm text-muted-foreground">
              {course?.duration} of content
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
          <Button size="lg" onClick={onEnroll} className="w-full">
            <Icon name="ShoppingCart" size={16} className="mr-2" />
            Enroll Now
          </Button>

          {course?.hasTrialLesson && (
            <Button
              variant="outline"
              size="lg"
              onClick={onTrial}
              className="w-full"
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
