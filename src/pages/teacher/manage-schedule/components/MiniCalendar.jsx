import { useMemo, useState } from "react";
import Icon from "components/AppIcon";
import Button from "components/ui/Button";
import { weekdayKeys } from "../../../../utils/time12h";

const isSameDay = (a, b) => a?.toDateString() === b?.toDateString();
const startOfDay = (d) => { const x = new Date(d); x.setHours(0, 0, 0, 0); return x; };
const today = startOfDay(new Date());

const Minicalendar = ({ currentDate, onDateSelect, onWeekdaySelect, selectedWeekday }) => {
  const [miniCalendarDate, setMiniCalendarDate] = useState(new Date(currentDate));

  const handleMiniCalendarPrevious = () => {
    const newDate = new Date(miniCalendarDate);
    newDate.setMonth(newDate.getMonth() - 1);
    setMiniCalendarDate(newDate);
  };

  const handleMiniCalendarNext = () => {
    const newDate = new Date(miniCalendarDate);
    newDate.setMonth(newDate.getMonth() + 1);
    setMiniCalendarDate(newDate);
  };

  const calendarDays = useMemo(() => {
    const year = miniCalendarDate.getFullYear();
    const month = miniCalendarDate.getMonth();
    const firstDay = new Date(year, month, 1);
    const startDate = new Date(firstDay);
    startDate.setDate(startDate.getDate() - firstDay.getDay());

    const days = [];
    const current = new Date(startDate);
    for (let i = 0; i < 42; i++) {
      days.push(new Date(current));
      current.setDate(current.getDate() + 1);
    }
    return days;
  }, [miniCalendarDate]);

  const isToday = (date) => isSameDay(date, new Date());
  const isSelected = (date) => isSameDay(date, currentDate);
  const isCurrentMonth = (date) => date.getMonth() === miniCalendarDate.getMonth();

  const weekdays = ["Su", "Mo", "Tu", "We", "Th", "Fr", "Sa"];

  return (
    <div className="space-y-4 bg-card rounded-lg border border-border p-6">
      <h4 className="text-lg font-semibold text-foreground">Select Date or Weekday</h4>

      {/* Header */}
      <div className="flex items-center justify-between mb-4">
        <Button variant="ghost" size="icon" onClick={handleMiniCalendarPrevious}>
          <Icon name="ChevronLeft" size={20} />
        </Button>
        <h4 className="text-lg font-medium text-foreground">
          {miniCalendarDate.toLocaleDateString("en-US", { month: "long", year: "numeric" })}
        </h4>
        <Button variant="ghost" size="icon" onClick={handleMiniCalendarNext}>
          <Icon name="ChevronRight" size={20} />
        </Button>
      </div>

      <div className="grid grid-cols-7 gap-1">
      </div>

      {/* Mini calendar grid */}
      <div className="grid grid-cols-7 gap-1">
        {/* Weekdays for weekly edit */}
        {weekdays.map((day, i) => (
          <button
            key={day}
            onClick={() => onWeekdaySelect(weekdayKeys[i])}
            className={`w-9 sm:w-12 text-xs font-medium rounded-full py-2 text-center transition-colors
                ${selectedWeekday === weekdayKeys[i]
                ? "bg-primary text-primary-foreground"
                : "text-muted-foreground hover:bg-muted"
              }`}
          >
            {day}
          </button>
        ))}
        {calendarDays.map((date, index) => (
          <button
            key={index}
            onClick={() => {
              const day = startOfDay(date);
              if (day < today) return; // disabled
              onDateSelect(new Date(date)); // parent will toggle select/deselect if same day
            }}
            disabled={startOfDay(date) < today}
            className={`w-9 h-9 sm:w-12 sm:h-12 text-sm p-2 rounded-full transition-colors disabled:opacity-50
              ${isSelected(date)
                ? "bg-primary text-primary-foreground"
                : isToday(date)
                  ? "bg-accent text-accent-foreground"
                  : isCurrentMonth(date)
                    ? "text-foreground hover:bg-muted"
                    : "text-muted-foreground hover:bg-muted"}`}
          >
            {date.getDate()}
          </button>
        ))}
      </div>
    </div>
  );
};

export default Minicalendar;
