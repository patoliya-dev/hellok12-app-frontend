import { useMemo, useState } from "react";
import Icon from "components/AppIcon";
import Button from "components/ui/Button";

const isSameDay = (a, b) => a?.toDateString() === b?.toDateString();
const startOfDay = (d) => { const x = new Date(d); x.setHours(0, 0, 0, 0); return x; };

const today = startOfDay(new Date());

const Minicalendar = ({ currentDate, onDateSelect }) => {
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

  return (
    <div className="space-y-4 bg-card rounded-lg border border-border p-6">
      <h4 className="text-lg font-semibold text-foreground">Select Date</h4>
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
        {["Su", "Mo", "Tu", "We", "Th", "Fr", "Sa"].map((day) => (
          <div key={day} className="w-9 sm:w-12 text-xs font-medium text-muted-foreground text-center py-2">
            {day}
          </div>
        ))}
        {calendarDays.map((date, index) => {
          return (
            <button
              key={index}
              onClick={() => {
                const day = startOfDay(date);
                if (day < today) return; // disabled
                onDateSelect(new Date(date)); // parent will toggle select/deselect if same day
              }}
              disabled={startOfDay(date) < today}
              className={`w-9 h-9 sm:w-12 sm:h-12 text-sm p-2 rounded-full transition-colors duration-200 disabled:opacity-50 disabled:cursor-not-allowed
                ${isSelected(date)
                  ? "bg-primary text-primary-foreground"
                  : isToday(date)
                    ? "bg-accent text-accent-foreground"
                    : isCurrentMonth(date)
                      ? "text-foreground hover:bg-muted"
                      : "text-muted-foreground hover:bg-muted"
                }`}
            >
              {date.getDate()}
            </button>
          );
        })}
      </div>
    </div>
  );
};

export default Minicalendar;
