import { useMemo, useState, useEffect } from "react";
import Icon from "components/AppIcon";
import Button from "components/ui/Button";
import { weekdayKeys } from "../../../../utils/time12h";

const isSameDay = (a, b) => a?.toDateString() === b?.toDateString();
const startOfDay = (d) => { const x = new Date(d); x.setHours(0, 0, 0, 0); return x; };
const today = startOfDay(new Date());

const MiniCalendar = ({ currentDate, onDateSelect, onWeekdaySelect, selectedWeekday, onVisibleMonthChange, selectedDateISO = null }) => {
  // if a specific date is selected (date-edit mode), suppress weekday template highlights
  const isDateSelected = Boolean(selectedDateISO);

  // Expose visible month to parent via onVisibleMonthChange
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

  // notify parent about visible month (YYYY-MM)
  useEffect(() => {
    if (typeof onVisibleMonthChange === 'function') {
      const d = miniCalendarDate;
      const key = `${d.getFullYear()}-${String(d.getMonth() + 1).padStart(2, '0')}`;
      onVisibleMonthChange(key);
    }
  }, [miniCalendarDate, onVisibleMonthChange]);

  // Sync visible month when parent currentDate changes (e.g., user selected a date)
  useEffect(() => {
    if (!currentDate) return;
    const d = new Date(currentDate);
    if (d.getMonth() !== miniCalendarDate.getMonth() || d.getFullYear() !== miniCalendarDate.getFullYear()) {
      setMiniCalendarDate(d);
    }
  }, [currentDate]);

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

  // Highlight: compute which dates in the visible month match the selectedWeekday
  // IMPORTANT: when a specific date is selected (date-edit mode), we suppress these weekday highlights.
  const highlightDates = useMemo(() => {
    if (!selectedWeekday || isDateSelected) return new Set();
    const targetDow = weekdayKeys.indexOf(selectedWeekday); // weekdayKeys: ['sun','mon',...]
    const set = new Set();
    const year = miniCalendarDate.getFullYear();
    const month = miniCalendarDate.getMonth();
    const daysInMonth = new Date(year, month + 1, 0).getDate();
    for (let d = 1; d <= daysInMonth; d++) {
      const dt = new Date(Date.UTC(year, month, d)); // utc normalized
      const dow = dt.getUTCDay(); // 0..6
      if (dow === targetDow) set.add(d);
    }
    return set;
  }, [miniCalendarDate, selectedWeekday, isDateSelected]);

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

      {/* Weekday buttons (unchanged) */}
      <div className="grid grid-cols-7 gap-1">
        {weekdays.map((day, i) => {
          const isThisSelectedWeekday = !isDateSelected && selectedWeekday === weekdayKeys[i];
          return (
            <button
              key={day}
              onClick={() => onWeekdaySelect(weekdayKeys[i])}
              className={`w-9 sm:w-12 text-xs font-medium rounded-full py-2 text-center transition-colors
                ${isThisSelectedWeekday
                  ? "bg-primary text-primary-foreground"
                  : "text-muted-foreground hover:bg-muted"
                }`}
            >
              {day}
            </button>
          );
        })}
      </div>

      {/* Mini calendar grid */}
      <div className="grid grid-cols-7 gap-1">
        {calendarDays.map((date, index) => {
          const dayNum = date.getDate();
          const inVisibleMonth = isCurrentMonth(date);
          const showHighlight = inVisibleMonth && highlightDates.has(dayNum);
          return (
            <button
              key={index}
              onClick={() => {
                const day = startOfDay(date);
                if (day < today) return; // disabled
                onDateSelect(new Date(date)); // parent will only select date (no weekly toggle)
              }}
              disabled={startOfDay(date) < today}
              className={`w-9 h-9 sm:w-12 sm:h-12 text-sm p-2 rounded-full transition-colors disabled:opacity-50
                ${isSelected(date) || showHighlight
                  ? `${isToday(date) ? "bg-accent text-accent-foreground" : "bg-primary text-primary-foreground"}`
                  : isToday(date)
                    ? "bg-accent text-accent-foreground"
                    : inVisibleMonth
                      ? "text-foreground hover:bg-muted"
                      : "text-muted-foreground hover:bg-muted"}`}
            >
              {dayNum}
            </button>
          );
        })}
      </div>
    </div>
  );
};

export default MiniCalendar;
