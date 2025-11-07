import { useEffect, useMemo, useState } from "react";
import Button from "components/ui/Button";
import { daysOfWeek, timeSlots } from "../data";
import { toISO } from "../../../../utils/time12h";

const TimeSlots = ({
  selectedDay,
  selectedDate,
  availability,
  setAvailability,     // in override mode -> calls API instantly; in weekly -> local toggle
  toggleAllSlotsForDay,
  handleClearAll,
  onSaveWeekly,
  saving = false,
  isOverrideMode = false,
  overrideSlots = [],  // slots for selected date (HH:MM[]) from store
}) => {
  const [disabled, setDisabled] = useState(false);
  const currentDay = selectedDay?.toLowerCase();

  // source of truth per mode
  const activeList = useMemo(() => {
    if (isOverrideMode) return overrideSlots || [];
    return availability?.[currentDay] || [];
  }, [isOverrideMode, overrideSlots, availability, currentDay]);

  const isSelected = (timeSlot) => activeList.includes(timeSlot);

  useEffect(() => {
    const selectDate = new Date(selectedDate);
    const today = new Date();
    today.setHours(0, 0, 0, 0);
    setDisabled(selectDate < today);
  }, [selectedDate]);

  // ---- Dynamic heading: Weekly vs Date mode ----
  const weekdayLabel =
    daysOfWeek?.find((d) => d?.short === selectedDay)?.label || "";
  const dateISO = selectedDate ? toISO(new Date(selectedDate)) : "";
  const dateWeekday = selectedDate
    ? new Date(selectedDate).toLocaleDateString("en-US", { weekday: "short" })
    : "";
  const headingTitle = isOverrideMode
    ? `Day ${dateISO}${dateWeekday ? ` (${dateWeekday})` : ""} Schedule`
    : `Weekly ${weekdayLabel} Schedule`;

  return (
    <div className="border border-border rounded-lg p-4 mb-4">
      <div className="flex items-center justify-between mb-4">
        <h4 className="text-md font-medium text-foreground">{headingTitle}</h4>
        {!isOverrideMode && (
          <div className="flex items-center space-x-2">
            <span className="text-sm text-muted-foreground">
              {activeList?.length} slots selected
            </span>
            <Button
              variant="outline"
              size="sm"
              disabled={disabled || saving}
              onClick={() => toggleAllSlotsForDay(currentDay)}
            >
              {activeList?.length === timeSlots?.length ? "Clear All" : "Select All"}
            </Button>
          </div>
        )}
      </div>

      {/* Time Slots Grid */}
      <div className="grid grid-cols-4 sm:grid-cols-6 md:grid-cols-8 gap-2 mb-4">
        {timeSlots?.map((timeSlot) => (
          <button
            key={timeSlot}
            disabled={disabled || saving}
            onClick={() => setAvailability(timeSlot)}
            className={`p-2 text-xs font-medium rounded border transition-smooth disabled:cursor-not-allowed ${isSelected(timeSlot)
              ? "bg-success text-success-foreground border-success"
              : "bg-background text-foreground border-border hover:bg-muted"
              }`}
          >
            {timeSlot}
          </button>
        ))}
      </div>

      {/* Weekly-only controls (not visible in override mode) */}
      {!isOverrideMode && (
        <div className="flex items-center justify-end space-x-2">
          <Button
            variant="ghost"
            size="sm"
            iconName="RotateCcw"
            onClick={handleClearAll}
            disabled={disabled || saving}
          >
            Clear All
          </Button>
          <Button
            size="sm"
            iconName="Save"
            disabled={disabled || saving}
            loading={saving}
            onClick={() => {
              onSaveWeekly?.();
            }}
          >
            Save
          </Button>
        </div>
      )}
    </div>
  );
};

export default TimeSlots;
