import React, { useState } from "react";
import Button from "../ui/Button";
import Select from "../ui/Select";
import Icon from "../ui/Icon";

const LessonModal = ({
  isOpen,
  onClose,
  lessons,
  onTrial,
}) => {
  const [selectedLesson, setSelectedLesson] = useState(lessons[0]);
  const [filterType, setFilterType] = useState('all');

  const teacherOptions = [
    { value: "sarah-johnson", label: "Sarah Johnson" },
    { value: "michael-chen", label: "Michael Chen" },
    { value: "emma-rodriguez", label: "Emma Rodriguez" },
    { value: "david-kim", label: "David Kim" },
    { value: "lisa-anderson", label: "Lisa Anderson" },
  ];

  if (!isOpen) return null;

  // -------------------- UI --------------------
  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/50">
      <div className="bg-card rounded-lg shadow-large max-w-2xl w-full mx-4 max-h-[90vh] overflow-hidden">
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
                options={teacherOptions}
                value={filterType}
                onChange={(value) => setFilterType(value)}
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
            {lessons.map((lesson, index) => (
              <div
                key={lesson.id}
                className={`border border-border rounded-lg overflow-hidden transition-all duration-200 ${selectedLesson?.id === lesson.id ? "ring-2 ring-primary relative" : ""
                  }`}
              >
                {selectedLesson?.id === lesson.id ?
                  <div className="absolute top-2 right-2 bg-blue-500 rounded-full p-1 flex items-center justify-center">
                    <Icon name="Check" size={14} className="text-white" />
                  </div>
                  : null
                }
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
          <Button type="button" variant="outline" onClick={() => {
            onClose()
            setFilterType('')
          }} >
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
