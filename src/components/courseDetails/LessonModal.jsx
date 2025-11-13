import React, { useEffect, useState } from "react";
import Button from "../ui/Button";
import Select from "../ui/Select";
import Icon from "../ui/Icon";

const LessonModal = ({ isOpen, onClose, lessons, onTrial, teachers }) => {
  const [filteredLessons, setFilteredLessons] = useState(lessons);
  const [selectedLesson, setSelectedLesson] = useState(lessons[0]);
  const [filterType, setFilterType] = useState("all");

  useEffect(() => {
    setFilteredLessons(
      lessons.filter((lesson) => lesson.isTrialAvailable === true)
    );
  }, [lessons]);

  const handleFilterChange = (value) => {
    setFilterType(value);
    const filtered = lessons.filter((lesson) => (lesson.teacherId === value && lesson.isTrialAvailable === true));
    setFilteredLessons(filtered);
  };

  if (!isOpen) return null;

  // -------------------- UI --------------------
  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/50 p-4">
      <div className="bg-card rounded-lg shadow-large max-w-2xl w-full mx-4 max-h-[90vh] overflow-scroll">
        {/* Header */}
        <div className="flex items-center justify-between p-6 border-b border-border">
          <div>
            <h2 className="text-xl font-semibold text-card-foreground">
              {"Trial Lessons"}
            </h2>
          </div>
          <div className="flex flex-row">
            <div className="mr-3">
              <Select
                placeholder="Select Teachers"
                options={teachers.map((teacher) => ({
                  value: teacher._id,
                  label: teacher.name,
                }))}
                value={filterType}
                onChange={(value) => handleFilterChange(value)}
                className="w-full"
              />
            </div>
            <Button
              variant="ghost"
              size="sm"
              iconName="X"
              iconSize={20}
              onClick={onClose}
            />
          </div>
        </div>

        {/* Body */}
        <div className="p-6 space-y-6">
          {/* Basic Information */}
          <div className="space-y-3">
            {filteredLessons.map((lesson, index) => (
              <div
                key={lesson._id}
                className={`border border-border rounded-lg overflow-hidden transition-all duration-200 ${
                  selectedLesson?._id === lesson._id
                    ? "ring-2 ring-primary relative"
                    : ""
                }`}
              >
                {selectedLesson?._id === lesson._id ? (
                  <div className="absolute top-2 right-2 bg-blue-500 rounded-full p-1 flex items-center justify-center">
                    <Icon name="Check" size={14} className="text-white" />
                  </div>
                ) : null}
                {/* Lesson Header */}
                <div
                  className="p-4 cursor-pointer hover:bg-muted/50 transition-colors"
                  onClick={() => setSelectedLesson(lesson)}
                >
                  <div className="flex items-center justify-between">
                    <div className="flex items-center space-x-4 flex-1">
                      <div className="flex items-center justify-center w-8 h-8 bg-primary/10 rounded-full text-primary text-sm font-medium">
                        {index + 1}
                      </div>

                      <div className="flex items-center space-x-3 flex-1">
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
                  </div>
                </div>
              </div>
            ))}
          </div>
        </div>

        {/* Footer */}
        <div className="flex items-center justify-end space-x-3 p-6 border-t border-border bg-muted/30">
          <Button
            type="button"
            variant="outline"
            onClick={() => {
              onClose();
              setFilterType("");
            }}
          >
            Cancel
          </Button>
          <Button type="submit" onClick={onTrial}>
            {"Enroll Now"}
          </Button>
        </div>
      </div>
    </div>
  );
};

export default LessonModal;
