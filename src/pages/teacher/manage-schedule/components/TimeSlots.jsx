import { useEffect, useState } from "react";
import Button from "components/ui/Button";
import { daysOfWeek, timeSlots } from "../data";

const TimeSlots = ({
  selectedDay,
  selectedDate,
  availability,
  setAvailability,
  toggleAllSlotsForDay,
  handleClearAll,
}) => {
  const [disabled, setDisabled] = useState(false);
  const currentDay = selectedDay?.toLowerCase();
  const currentDayAvailability = availability?.[currentDay] || [];

  const isTimeSlotAvailable = (day, timeSlot) => {
    const dayAvailability = availability?.[currentDay] || [];
    return dayAvailability?.includes(timeSlot);
  };

  useEffect(() => {
    const selectDate = new Date(selectedDate);
    const today = new Date();
    today.setHours(0, 0, 0, 0);
    setDisabled(selectDate < today);
  }, [selectedDate]);

  return (
    <div className="border border-border rounded-lg p-4 mb-4">
      <div className="flex items-center justify-between mb-4">
        <h4 className="text-md font-medium text-foreground">
          {daysOfWeek?.find((d) => d?.short === selectedDay)?.label} Schedule
        </h4>
        <div className="flex items-center space-x-2">
          <span className="text-sm text-muted-foreground">
            {currentDayAvailability?.length} slots selected
          </span>
          <Button
            variant="outline"
            size="sm"
            disabled={disabled}
            onClick={() => toggleAllSlotsForDay(currentDay)}
          >
            {currentDayAvailability?.length === timeSlots?.length
              ? "Clear All"
              : "Select All"}
          </Button>
        </div>
      </div>

      {/* Time Slots Grid */}
      <div className="grid grid-cols-4 sm:grid-cols-6 md:grid-cols-8 gap-2 mb-4">
        {timeSlots?.map((timeSlot) => {
          const isSelected = isTimeSlotAvailable(selectedDay, timeSlot);
          return (
            <button
              key={timeSlot}
              disabled={disabled}
              onClick={() => setAvailability(timeSlot)}
              className={`p-2 text-xs font-medium rounded border transition-smooth disabled:cursor-not-allowed ${
                isSelected
                  ? "bg-success text-success-foreground border-success"
                  : "bg-background text-foreground border-border hover:bg-muted"
              }`}
            >
              {timeSlot}
            </button>
          );
        })}
      </div>

      <div className="flex items-center justify-end space-x-2">
        <Button
          variant="ghost"
          size="sm"
          iconName="RotateCcw"
          onClick={handleClearAll}
          disabled={disabled}
        >
          Clear All
        </Button>
        <Button
          size="sm"
          iconName="Save"
          disabled={disabled}
          onClick={() => {
            alert("Schedule saved successfully!");
          }}
        >
          Save
        </Button>
      </div>
    </div>
  );
};

export default TimeSlots;
