import React, { useMemo } from 'react';
import { ChevronLeft, ChevronRight } from 'lucide-react';

// A mapping from color names to Tailwind CSS classes
const colorMap = {
  blue: { dot: 'bg-blue-500' },
  green: { dot: 'bg-green-500' },
  purple: { dot: 'bg-purple-500' },
};

const Calendar = ({ currentDate, setCurrentDate, lessons, today, selectedDate, setSelectedDate }) => {
  const daysOfWeek = ['Sun', 'Mon', 'Tue', 'Wed', 'Thu', 'Fri', 'Sat'];

  const firstDayOfMonth = new Date(currentDate.getFullYear(), currentDate.getMonth(), 1);
  const lastDayOfMonth = new Date(currentDate.getFullYear(), currentDate.getMonth() + 1, 0);
  const startingDay = firstDayOfMonth.getDay();
  const totalDays = lastDayOfMonth.getDate();

  const lessonsByDate = useMemo(() => {
    const grouped = {};
    lessons.forEach(lesson => {
      const dateKey = new Date(lesson.date).toDateString();
      if (!grouped[dateKey]) {
        grouped[dateKey] = [];
      }
      grouped[dateKey].push(lesson);
    });
    return grouped;
  }, [lessons]);

  const navigateMonth = (direction) => {
    setCurrentDate(prevDate => {
      const newDate = new Date(prevDate);
      newDate.setMonth(newDate.getMonth() + direction);
      return newDate;
    });
  };

  const renderCalendarGrid = () => {
    const cells = [];
    for (let i = 0; i < startingDay; i++) {
      cells.push(<div key={`empty-${i}`} className="border-r border-b border-border"></div>);
    }

    for (let day = 1; day <= totalDays; day++) {
      const cellDate = new Date(currentDate.getFullYear(), currentDate.getMonth(), day);
      const isToday = cellDate.toDateString() === today.toDateString();
      // NEW: Check if the current cell is the selected one
      const isSelected = cellDate.toDateString() === selectedDate.toDateString();
      const lessonsForDay = lessonsByDate[cellDate.toDateString()] || [];

      cells.push(
        <div
          key={day}
          // NEW: Add click handler to update the selected date
          onClick={() => setSelectedDate(cellDate)}
          // NEW: Add classes for hover, cursor, and selection highlight
          className={`relative p-2 border-r border-b border-border min-h-[120px] cursor-pointer transition-colors duration-200 hover:bg-muted/50 
            ${isSelected ? 'ring-2 ring-brand-blue ring-inset' : ''}`}
        >
          <div className={`flex items-center justify-center h-7 w-7 text-sm ${isToday ? 'bg-brand-blue text-white rounded-full' : ''}`}>
            {day}
          </div>
          <div className="mt-1 space-y-1">
            {lessonsForDay.map(lesson => (
              <div key={lesson.id} className="flex items-center">
                <span className={`w-1.5 h-1.5 rounded-full mr-2 ${colorMap[lesson.color]?.dot}`}></span>
                <p className="text-xs text-foreground truncate">{lesson.title}</p>
              </div>
            ))}
          </div>
        </div>
      );
    }
    return cells;
  };

  return (
    <div className="bg-card rounded-lg border border-border">
      <div className="flex items-center justify-between p-4 border-b border-border">
        <button onClick={() => navigateMonth(-1)} className="p-1 text-muted-foreground hover:text-foreground">
          <ChevronLeft size={20} />
        </button>
        <h2 className="text-lg font-semibold text-foreground">
          {currentDate.toLocaleString('default', { month: 'long', year: 'numeric' })}
        </h2>
        <button onClick={() => navigateMonth(1)} className="p-1 text-muted-foreground hover:text-foreground">
          <ChevronRight size={20} />
        </button>
      </div>

      <div className="grid grid-cols-7">
        {daysOfWeek.map(day => (
          <div key={day} className="p-3 text-center text-sm font-medium text-muted-foreground border-b border-r border-border">
            {day}
          </div>
        ))}
        {renderCalendarGrid()}
      </div>
    </div>
  );
};

export default Calendar;
