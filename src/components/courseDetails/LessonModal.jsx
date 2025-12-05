import React, { useEffect, useState } from "react";
import Button from "../ui/Button";
import Select from "../ui/Select";
import Icon from "../ui/Icon";

const LessonModal = ({ isOpen, onClose, lessons = [], onTrial, teachers = [] }) => {
  // Ensure lessons is always an array
  const [filteredLessons, setFilteredLessons] = useState(Array.isArray(lessons) ? lessons.filter(l => l.isTrialAvailable) : []);
  const [selectedLesson, setSelectedLesson] = useState(null);
  const [filterType, setFilterType] = useState("");

  useEffect(() => {
    // guard: lessons may be undefined initially
    const trialLessons = Array.isArray(lessons) ? lessons.filter((lesson) => lesson.isTrialAvailable === true) : [];
    setFilteredLessons(trialLessons);

    // default selection -> first trial lesson if exists
    if (trialLessons.length > 0) {
      setSelectedLesson(prev => prev ? prev : trialLessons[0]);
    } else {
      setSelectedLesson(null);
    }
  }, [lessons]);

  const handleFilterChange = (value) => {
    setFilterType(value);
    if (!value) {
      const all = Array.isArray(lessons) ? lessons.filter((lesson) => lesson.isTrialAvailable === true) : [];
      setFilteredLessons(all);
      // default select first
      if (all.length > 0) setSelectedLesson(all[0]);
      return;
    }
    const filtered = Array.isArray(lessons)
      ? lessons.filter((lesson) => String(lesson.teacherId) === String(value) && lesson.isTrialAvailable === true)
      : [];
    setFilteredLessons(filtered);
    if (filtered.length > 0) setSelectedLesson(filtered[0]);
    else setSelectedLesson(null);
  };

  if (!isOpen) return null;

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/50 p-4">
      <div className="bg-card rounded-lg shadow-large max-w-2xl w-full mx-4 max-h-[90vh] overflow-scroll">
        {/* Header */}
        <div className="flex items-center justify-between p-6 border-b border-border">
          <div>
            <h2 className="text-xl font-semibold text-card-foreground">Trial Lessons</h2>
          </div>
          <div className="flex flex-row">
            <div className="mr-3">
              <Select
                placeholder="Select Teachers"
                options={(teachers || []).map((teacher) => ({
                  value: teacher._id,
                  label: teacher.name,
                }))}
                value={filterType || ""}
                onChange={(value) => handleFilterChange(value)}
                className="w-full"
                allowClear
              />
            </div>
            <Button variant="ghost" size="sm" iconName="X" iconSize={20} onClick={onClose} />
          </div>
        </div>

        {/* Body */}
        <div className="p-6 space-y-6">
          {filteredLessons.length === 0 ? (
            <div className="text-center text-muted-foreground">No trial lessons available.</div>
          ) : (
            filteredLessons.map((lesson, index) => (
              <div
                key={lesson._id || lesson.id || index}
                className={`border border-border rounded-lg overflow-hidden transition-all duration-200 ${selectedLesson && String(selectedLesson._id) === String(lesson._id) ? "ring-2 ring-primary relative" : ""}`}
              >
                {selectedLesson && String(selectedLesson._id) === String(lesson._id) ? (
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

                      <div className="flex items-center space-x-3 flex-1 min-w-0">
                        <div className="min-w-0 flex-1">
                          <h3 className="font-medium text-foreground truncate">{lesson.title}</h3>
                          <p className="text-sm text-muted-foreground">
                            {lesson.duration ? `${lesson.duration} min` : ""}
                          </p>
                        </div>
                        <div className="text-sm text-muted-foreground">
                          Spots: {typeof lesson.trialCapacity !== "undefined" ? lesson.trialCapacity : "—"}
                        </div>
                      </div>
                    </div>
                  </div>
                </div>
              </div>
            ))
          )}
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
          <Button
            type="button"
            onClick={() => {
              // call parent with selected lesson id (if present)
              if (typeof onTrial === "function") {
                if (!selectedLesson) {
                  // no selection, keep modal open and show a basic alert (or ideally, emit nicer UI state)
                  // we keep it simple here
                  alert("Please select a trial lesson first.");
                  return;
                }
                onTrial(String(selectedLesson._id || selectedLesson.id));
              }
            }}
            disabled={!selectedLesson}
          >
            Enroll Now
          </Button>
        </div>
      </div>
    </div>
  );
};

export default LessonModal;
