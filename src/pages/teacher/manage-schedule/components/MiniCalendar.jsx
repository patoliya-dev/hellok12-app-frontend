import { useState } from "react";
import Icon from "components/AppIcon";
import TimeSlots from "./TimeSlots";
import Button from "components/ui/Button";

const Minicalendar = ({ currentDate, onDateSelect }) => {
  const [miniCalendarDate, setMiniCalendarDate] = useState(
    new Date(currentDate)
  );

  const handleMiniCalendarPrevious = () => {
    const newDate = new Date(miniCalendarDate);
    newDate?.setMonth(newDate?.getMonth() - 1);
    setMiniCalendarDate(newDate);
  };

  const handleMiniCalendarNext = () => {
    const newDate = new Date(miniCalendarDate);
    newDate?.setMonth(newDate?.getMonth() + 1);
    setMiniCalendarDate(newDate);
  };

  const generateMiniCalendar = () => {
    const year = miniCalendarDate?.getFullYear();
    const month = miniCalendarDate?.getMonth();
    const firstDay = new Date(year, month, 1);
    const lastDay = new Date(year, month + 1, 0);
    const startDate = new Date(firstDay);
    startDate?.setDate(startDate?.getDate() - firstDay?.getDay());

    const days = [];
    const current = new Date(startDate);

    for (let i = 0; i < 42; i++) {
      days?.push(new Date(current));
      current?.setDate(current?.getDate() + 1);
    }

    return days;
  };

  const calendarDays = generateMiniCalendar();

  const isToday = (date) => {
    const today = new Date();
    return date?.toDateString() === today?.toDateString();
  };

  const isSelected = (date) => {
    return date?.toDateString() === currentDate?.toDateString();
  };

  const isCurrentMonth = (date) => {
    return date?.getMonth() === miniCalendarDate?.getMonth();
  };

  const isPastDate = (date) => {
    const today = new Date();
    today.setHours(0, 0, 0, 0); // normalize to midnight
    return date < today;
  };

  return (
    <div className="space-y-4 bg-card rounded-lg border border-border p-6">
      <h4 className="text-lg font-semibold text-foreground">Select Date</h4>
      <div className="flex items-center justify-between mb-4">
        <Button
          variant="ghost"
          size="icon"
          onClick={handleMiniCalendarPrevious}
        >
          <Icon name="ChevronLeft" size={20} />
        </Button>
        <h4 className="text-lg font-medium text-foreground">
          {miniCalendarDate?.toLocaleDateString("en-US", {
            month: "long",
            year: "numeric",
          })}
        </h4>
        <Button variant="ghost" size="icon" onClick={handleMiniCalendarNext}>
          <Icon name="ChevronRight" size={20} />
        </Button>
      </div>

      <div className="grid grid-cols-7 gap-1">
        {["Su", "Mo", "Tu", "We", "Th", "Fr", "Sa"]?.map((day) => (
          <div
            key={day}
            className="w-9 sm:w-12 text-xs font-medium text-muted-foreground text-center py-2"
          >
            {day}
          </div>
        ))}
        {calendarDays?.map((date, index) => {
          const disabled = isPastDate(date);
          return (
            <button
              key={index}
              onClick={() => !disabled && onDateSelect(date)}
              disabled={disabled}
              className={`w-9 h-9 sm:w-12 sm:h-12 text-sm p-2 rounded-full transition-colors duration-200 
                ${
                  disabled
                    ? "text-muted-foreground opacity-50 cursor-not-allowed"
                    : isSelected(date)
                    ? "bg-primary text-primary-foreground"
                    : isToday(date)
                    ? "bg-accent text-accent-foreground"
                    : isCurrentMonth(date)
                    ? "text-foreground hover:bg-muted"
                    : "text-muted-foreground hover:bg-muted"
                }`}
            >
              {date?.getDate()}
            </button>
          );
        })}
      </div>
    </div>
  );
};

export default Minicalendar;
