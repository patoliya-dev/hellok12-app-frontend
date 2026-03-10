import React from "react";
import Icon from "../ui/Icon";
import Image from "../AppImage";
import Button from "../ui/Button";

const CourseHero = ({ course, onEnroll, onTrial, isAlreadyPurchased = false }) => {
  if (!course) return null;
  const getTypeIcon = () => (course?.type === "1-on-1" ? "User" : "Users");

  return (
    <section className="border-b border-border">
      <div className="max-w-6xl mx-auto px-6 py-12">
        <div className="grid grid-cols-1 lg:grid-cols-2 gap-8 items-center">
          {/* Course Info */}
          <div className="order-2 lg:order-1">
            <h1 className="text-3xl md:text-4xl font-bold text-foreground mb-4">
              {course?.title}
            </h1>

            <p className="text-lg text-muted-foreground mb-6">
              {course?.description}
            </p>

            {/* Course Stats */}
            <div className="flex flex-wrap items-center gap-6 mb-6">
              <div className="flex items-center space-x-2">
                <Icon
                  name="Star"
                  size={20}
                  className="text-accent fill-current"
                />
                <span className="font-semibold text-foreground">
                  {Math.round(course?.averageRating * 10) / 10}
                </span>
                <span className="text-muted-foreground">
                  ({course?.reviewsCount} reviews)
                </span>
              </div>

              <div className="flex items-center space-x-2">
                <Icon name="Users" size={20} className="text-primary" />
                <span className="text-muted-foreground">
                  {course?.enrolledCount} students
                </span>
              </div>

              <div className="flex items-center space-x-2">
                <Icon name="BookOpen" size={20} className="text-accent" />
                <span className="text-muted-foreground">
                  {course?.lessons.length} lessons
                </span>
              </div>

              <div className="w-full flex gap-2">
                {course?.lessonType && (
                  <div className="">
                    <span
                      className={`inline-flex items-center gap-1 px-2 py-1 rounded-full text-xs bg-[#2563eb]/5 text-[#2563eb]`}
                    >
                      <Icon name={getTypeIcon()} size={12} />
                      {course?.lessonType === "1-on-1" ? "1-on-1" : "Group"}
                    </span>
                  </div>
                )}
                {course?.mode === "online" && (
                  <div>
                    <span className="inline-flex items-center gap-1 px-2 py-1 rounded-full text-xs bg-[#10b981]/5 text-[#10b981]">
                      <Icon name="Video" size={12} />
                      Online
                    </span>
                  </div>
                )}
                {course?.mode === "in-person" && (
                  <div>
                    <span className="inline-flex items-center gap-1 px-2 py-1 rounded-full text-xs bg-[#10b981]/5 text-[#10b981]">
                      <Icon name="MapPin" size={12} />
                      In-Person
                    </span>
                  </div>
                )}
                {course?.isTrialAvailable && (
                  <div>
                    <span className="inline-flex items-center gap-1 px-2 py-1 rounded-full text-xs bg-[#0ea5e9]/5 text-[#0ea5e9]">
                      <Icon name="Gift" size={12} />
                      Trial Lesson
                    </span>
                  </div>
                )}
              </div>
            </div>

            {/* CTA Buttons */}
            <div className="flex flex-col sm:flex-row gap-4">
              <Button
                size="lg"
                onClick={onEnroll}
                className="flex-1 sm:flex-none"
                disabled={isAlreadyPurchased}
              >
                <Icon name="ShoppingCart" size={20} className="mr-2" />
                {isAlreadyPurchased
                  ? "Already Purchased"
                  : `Enroll Now - $${course?.pricing?.effectivePrice ?? course?.price}`}
              </Button>

              {course?.isTrialAvailable && (
                <Button
                  variant="outline"
                  size="lg"
                  onClick={onTrial}
                  className="flex-1 sm:flex-none"
                  disabled={isAlreadyPurchased}
                >
                  <Icon name="Play" size={20} className="mr-2" />
                  Try Free Lesson
                </Button>
              )}
            </div>
          </div>

          {/* Course Image */}
          <div className="order-1 lg:order-2">
            <div className="relative">
              <Image
                src={
                  course?.introImageRef?.url || "/assets/images/no_image.png"
                }
                alt={course?.title}
                className="w-full h-64 lg:h-80 object-cover rounded-lg shadow-medium"
              />
              <div className="absolute inset-0 bg-gradient-to-t from-black/20 to-transparent rounded-lg"></div>
            </div>
          </div>
        </div>
      </div>
    </section>
  );
};

export default CourseHero;
