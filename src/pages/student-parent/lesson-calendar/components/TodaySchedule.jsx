import React from 'react';

const colorMap = {
  blue: 'bg-blue-500',
  green: 'bg-green-500',
  purple: 'bg-purple-500',
};

const TodaySchedule = ({ lessons, selectedDate, today }) => {
  // NEW: Dynamically generate the title based on the selected date
  const getTitle = () => {
    if (selectedDate.toDateString() === today.toDateString()) {
      return "Today's Schedule";
    }
    return `Schedule for ${selectedDate.toLocaleString('default', { month: 'long', day: 'numeric' })}`;
  };

  return (
    <div className="bg-card p-6 rounded-lg border border-border max-w-md">
      <h3 className="font-semibold text-foreground">{getTitle()}</h3>
      <div className="mt-4 space-y-4">
        {lessons.length > 0 ? (
          lessons.map((lesson, index) => (
            <div
              key={lesson.id}
              className={`flex items-center space-x-2 py-3 ${
                index >= 1 && "border-t border-border !m-0"
              }`}
            >
              {/* Number instead of dot */}
              <span className="text-sm text-secondary">{index + 1}.</span>

              {/* Lesson Title + Time */}
              <div className="flex justify-between items-center w-full min-w-0">
                <p className="text-secondary text-sm truncate mr-2">{lesson.title}</p>
                <span className="text-brand-gray-800 text-sm whitespace-nowrap flex-shrink-0">
                  {lesson.time}
                </span>
              </div>
            </div>
          ))
        ) : (
          <p className="text-sm text-muted-foreground">
            No lessons scheduled for{" "}
            {selectedDate.toDateString() === today.toDateString()
              ? "today"
              : "this day"}
            .
          </p>
        )}
      </div>
    </div>
  );
};

export default TodaySchedule;
