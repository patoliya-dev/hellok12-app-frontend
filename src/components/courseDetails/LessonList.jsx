import React, { useState } from "react";
import Icon from "../ui/Icon";

const LessonList = ({ lessons, selectedLesson }) => {
  const [expandedLessons, setExpandedLessons] = useState(new Set(["lesson-1"]));

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
          {lessons.length} lessons •{" "}
          {lessons.reduce(
            (total, lesson) => total + parseInt(lesson?.duration || "0"),
            0
          )}{" "}
          minutes total
        </span>
      </div>

      {/* Lessons */}
      <div className="space-y-3">
        {lessons.map((lesson, index) => (
          <div
            key={lesson.id}
            className={`border border-border rounded-lg overflow-hidden transition-all duration-200 ${
              selectedLesson?.id === lesson.id ? "ring-2 ring-primary" : ""
            }`}
          >
            {/* Lesson Header */}
            <div
              className="p-4 cursor-pointer hover:bg-muted/50 transition-colors"
              onClick={() => toggleLessonExpansion(lesson.id)}
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
                        {lesson.duration}
                      </p>
                    </div>
                  </div>
                </div>

                <div className="flex items-center space-x-2">
                  <Icon
                    name={
                      expandedLessons.has(lesson.id)
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
            {expandedLessons.has(lesson.id) && (
              <div className="border-t border-border p-4 bg-muted/20">
                {lesson.description && (
                  <p className="text-muted-foreground mb-4">
                    {lesson.description}
                  </p>
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
