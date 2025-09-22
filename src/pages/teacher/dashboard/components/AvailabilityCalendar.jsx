import React, { useState } from "react";
import Icon from "../../../../components/AppIcon";
import Button from "../../../../components/ui/Button";

const AvailabilityCalendar = ({ availability, onUpdateAvailability }) => {
  const [selectedDate, setSelectedDate] = useState(new Date());
  const [isEditing, setIsEditing] = useState(false);

  const daysOfWeek = ["Mon", "Tue", "Wed", "Thu", "Fri", "Sat", "Sun"];
  const timeSlots = [
    "08:00",
    "09:00",
    "10:00",
    "11:00",
    "12:00",
    "13:00",
    "14:00",
    "15:00",
    "16:00",
    "17:00",
    "18:00",
    "19:00",
    "20:00",
  ];

  const getCurrentWeekDates = () => {
    const today = new Date();
    const currentDay = today.getDay();
    const monday = new Date(today);
    monday.setDate(today.getDate() - (currentDay === 0 ? 6 : currentDay - 1));

    return Array.from({ length: 7 }, (_, i) => {
      const date = new Date(monday);
      date.setDate(monday.getDate() + i);
      return date;
    });
  };

  const weekDates = getCurrentWeekDates();

  const isTimeSlotAvailable = (dayIndex, timeSlot) => {
    const dayName = daysOfWeek[dayIndex].toLowerCase();
    return availability[dayName]?.includes(timeSlot) || false;
  };

  const toggleTimeSlot = (dayIndex, timeSlot) => {
    if (!isEditing) return;

    const dayName = daysOfWeek[dayIndex].toLowerCase();
    const currentSlots = availability[dayName] || [];
    const updatedSlots = currentSlots.includes(timeSlot)
      ? currentSlots.filter((slot) => slot !== timeSlot)
      : [...currentSlots, timeSlot];

    onUpdateAvailability({
      ...availability,
      [dayName]: updatedSlots,
    });
  };

  const handleSaveAvailability = () => {
    setIsEditing(false);
    // Here you would typically save to backend
  };

  return (
    <div className="bg-card rounded-lg border border-border p-6">
      <div className="flex items-center justify-between mb-4">
        <h3 className="text-lg font-semibold text-foreground">
          Weekly Availability
        </h3>
        <div className="flex space-x-2">
          {isEditing ? (
            <>
              <Button
                variant="outline"
                size="sm"
                onClick={() => setIsEditing(false)}
              >
                Cancel
              </Button>
              <Button
                variant="default"
                size="sm"
                onClick={handleSaveAvailability}
              >
                Save
              </Button>
            </>
          ) : (
            <Button
              variant="outline"
              size="sm"
              iconName="Edit"
              iconPosition="left"
              iconSize={16}
              onClick={() => setIsEditing(true)}
            >
              Edit Schedule
            </Button>
          )}
        </div>
      </div>

      <div className="overflow-x-auto">
        <div className="min-w-full">
          {/* Header with days */}
          <div className="grid grid-cols-8 gap-1 mb-2">
            <div className="p-2 text-xs font-medium text-muted-foreground">
              Time
            </div>
            {daysOfWeek.map((day, index) => (
              <div key={day} className="p-2 text-center">
                <div className="text-xs font-medium text-foreground">{day}</div>
                <div className="text-xs text-muted-foreground">
                  {weekDates[index].getDate()}
                </div>
              </div>
            ))}
          </div>

          {/* Time slots grid */}
          <div className="space-y-1">
            {timeSlots.map((timeSlot) => (
              <div key={timeSlot} className="grid grid-cols-8 gap-1">
                <div className="p-2 text-xs text-muted-foreground font-medium">
                  {timeSlot}
                </div>
                {daysOfWeek.map((_, dayIndex) => (
                  <button
                    key={`${dayIndex}-${timeSlot}`}
                    onClick={() => toggleTimeSlot(dayIndex, timeSlot)}
                    disabled={!isEditing}
                    className={`p-2 rounded text-xs transition-micro flex items-center justify-center ${
                      isTimeSlotAvailable(dayIndex, timeSlot)
                        ? "bg-success text-success-foreground"
                        : "bg-muted hover:bg-muted/80"
                    } ${isEditing ? "cursor-pointer" : "cursor-default"}`}
                  >
                    {isTimeSlotAvailable(dayIndex, timeSlot) ? (
                      <Icon name="Check" size={12} />
                    ) : (
                      <span className="opacity-0">-</span>
                    )}
                  </button>
                ))}
              </div>
            ))}
          </div>
        </div>
      </div>

      <div className="mt-4 p-3 bg-muted/50 rounded-lg">
        <div className="flex items-center space-x-2 text-sm text-muted-foreground">
          <Icon name="Info" size={16} />
          <span>
            {isEditing
              ? "Click time slots to toggle availability. Green = Available, Gray = Unavailable"
              : "Your current weekly schedule. Students can book sessions during green time slots."}
          </span>
        </div>
      </div>
    </div>
  );
};

export default AvailabilityCalendar;
