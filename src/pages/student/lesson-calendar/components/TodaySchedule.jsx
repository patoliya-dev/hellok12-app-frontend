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
    <div className="bg-card p-6 rounded-lg border border-border">
      <h3 className="font-semibold text-foreground">{getTitle()}</h3>
      <div className="mt-4 space-y-4">
        {lessons.length > 0 ? (
          lessons.map((lesson) => (
            <div key={lesson.id} className="flex items-center">
              <span className={`w-1.5 h-1.5 rounded-full mr-3 ${colorMap[lesson.color]}`}></span>
              <p className="text-sm text-foreground">{lesson.title}</p>
            </div>
          ))
        ) : (
          <p className="text-sm text-muted-foreground">No lessons scheduled for {`${selectedDate.toDateString() === today.toDateString() ? 'today' : 'this day'}`}.</p>
        )}
      </div>
    </div>
  );
};

export default TodaySchedule;
