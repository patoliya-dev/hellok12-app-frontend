import React, { useState } from "react";
import Icon from "../ui/Icon";

const LessonList = ({ lessons, selectedLesson }) => {
  const [expandedLessons, setExpandedLessons] = useState(new Set(["lesson-1"]));

  const toDate = (value) => {
    if (!value) return null;
    const d = new Date(value);
    return Number.isNaN(d.getTime()) ? null : d;
  };

  const parseScheduleDate = (lesson) => {
    const datePart = lesson?.schedule?.date;
    const timePart = lesson?.schedule?.time;
    if (!datePart) return null;
    const combined = timePart ? `${datePart}T${timePart}` : datePart;
    return toDate(combined) || toDate(datePart);
  };

  const isLessonOutdated = (lesson) => {
    if (!lesson) return false;

    if (lesson?.isOutdated === true || lesson?.outdated === true) return true;

    const status = String(lesson?.status || lesson?.lessonStatus || "")
      .trim()
      .toLowerCase();

    if (status === "outdated" || status === "expired") return true;
    if (status === "completed" || status === "active" || status === "upcoming")
      return false;

    const now = Date.now();
    const expiresAt = toDate(lesson?.expiresAt);
    if (expiresAt && expiresAt.getTime() < now) return true;

    const startAt =
      toDate(lesson?.startAt) ||
      toDate(lesson?.startTime) ||
      parseScheduleDate(lesson);
    if (startAt && startAt.getTime() < now) return true;

    return false;
  };

  const getLessonDateLabel = (lesson) => {
    const dateValue =
      lesson?.startAt ||
      lesson?.startTime ||
      lesson?.schedule?.date ||
      lesson?.date;
    const parsed = toDate(dateValue) || parseScheduleDate(lesson);
    if (!parsed) return "Date not available";
    return parsed.toLocaleDateString(undefined, {
      year: "numeric",
      month: "short",
      day: "numeric",
    });
  };

  const toggleLessonExpansion = (lessonId) => {
    const newExpanded = new Set(expandedLessons);
    if (newExpanded.has(lessonId)) {
      newExpanded.delete(lessonId);
    } else {
      newExpanded.add(lessonId);
    }
    setExpandedLessons(newExpanded);
  };

  const getLessonIcon = (type) => {
    switch (type) {
      case "video":
        return "Play";
      case "interactive":
        return "MousePointer";
      case "quiz":
        return "HelpCircle";
      case "assignment":
        return "FileText";
      default:
        return "BookOpen";
    }
  };

  if (!lessons?.length) return null;

  return (
    <section className="bg-card rounded-lg border border-border p-6">
      {/* Header */}
      <div className="flex items-center justify-between mb-6">
        <h2 className="text-2xl font-semibold text-foreground">Lessons</h2>
        <span className="text-sm text-muted-foreground">
          {lessons?.length} lessons •{" "}
          {lessons?.reduce(
            (total, lesson) =>
              total + parseInt(lesson?.schedule.duration || "0"),
            0,
          )}{" "}
          minutes total
        </span>
      </div>

      {/* Lessons */}
      <div className="space-y-3">
        {lessons?.map((lesson, index) => (
          <div
            key={lesson._id}
            className={`border border-border rounded-lg overflow-hidden transition-all duration-200 ${
              selectedLesson?._id === lesson._id ? "ring-2 ring-primary" : ""
            }`}
          >
            {/* Lesson Header */}
            <div
              className="p-4 cursor-pointer hover:bg-muted/50 transition-colors"
              onClick={() => toggleLessonExpansion(lesson._id)}
            >
              <div className="flex items-center justify-between">
                <div className="flex items-center space-x-4 flex-1">
                  <div className="flex items-center justify-center w-8 h-8 bg-primary/10 rounded-full text-primary text-sm font-medium">
                    {index + 1}
                  </div>

                  <div className="flex items-center space-x-3 flex-1">
                    <Icon
                      name={getLessonIcon(lesson.type)}
                      size={16}
                      className="text-muted-foreground flex-shrink-0"
                    />
                    <div className="min-w-0 flex-1">
                      <h3 className="font-medium text-foreground truncate">
                        {lesson.title}
                      </h3>
                      <p className="text-sm text-muted-foreground">
                        {lesson?.schedule.duration} minutes
                      </p>
                      <p className="text-sm text-muted-foreground">
                        {getLessonDateLabel(lesson)}
                      </p>
                    </div>
                  </div>
                </div>
                <div className="flex items-end  ">
                  {isLessonOutdated(lesson) && (
                    <div className="mr-2">
                      <span className="inline-flex items-center gap-1 px-2 py-1 rounded-full text-xs bg-red-50 text-red-700">
                        <Icon name="AlertCircle" size={12} />
                        Outdated
                      </span>
                    </div>
                  )}
                  {lesson?.isTrialAvailable && (
                    <div>
                      <span className="inline-flex items-center gap-1 px-2 py-1 rounded-full text-xs bg-[#0ea5e9]/5 text-[#0ea5e9]">
                        <Icon name="Gift" size={12} />
                        Trial Lesson
                      </span>
                    </div>
                  )}
                </div>

                <div className="flex items-center space-x-2">
                  <Icon
                    name={
                      expandedLessons.has(lesson._id)
                        ? "ChevronUp"
                        : "ChevronDown"
                    }
                    size={16}
                    className="text-muted-foreground"
                  />
                </div>
              </div>
            </div>

            {/* Lesson Details */}
            {expandedLessons.has(lesson._id) && (
              <div className="border-t border-border p-4 bg-muted/20">
                {lesson.description && (
                  <p className="text-muted-foreground mb-4">
                    {lesson.description}
                  </p>
                )}
                {isLessonOutdated(lesson) && (
                  <div className="flex items-start gap-2 rounded-md border border-red-200 bg-red-50 p-3 text-sm text-red-700">
                    <Icon name="Info" size={14} className="mt-0.5" />
                    <span>
                      This lesson is outdated and is not counted as an available
                      remaining lesson.
                    </span>
                  </div>
                )}
              </div>
            )}
          </div>
        ))}
      </div>
    </section>
  );
};

export default LessonList;
