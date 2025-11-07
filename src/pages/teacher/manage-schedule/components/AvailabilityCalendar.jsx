import React from "react";
import Icon from "../../../../components/AppIcon";
import { timeSlots } from "../data";

const AvailabilityCalendar = ({ availability, currentDate }) => {
  const daysOfWeek = ["Mon", "Tue", "Wed", "Thu", "Fri", "Sat", "Sun"];

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

  const isToday = (date) => {
    const today = new Date();
    return date.toDateString() === today.toDateString();
  };

  return (
    <div className="bg-card rounded-lg border border-border p-6">
      <div className="mb-4">
        <h3 className="text-lg font-semibold text-foreground">
          Availability Status
        </h3>
      </div>

      <div className="overflow-x-auto">
        <div className="min-w-full">
          {/* Header with days */}
          <div className="grid grid-cols-8 gap-1 mb-2">
            <div className="p-2 text-xs font-medium text-muted-foreground"></div>
            {daysOfWeek.map((day, index) => (
              <div
                key={day}
                className={`p-2 text-center ${isToday(weekDates[index]) ? "bg-muted" : ""
                  }`}
              >
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
                    className={`p-2 rounded text-xs transition-micro flex items-center justify-center ${isTimeSlotAvailable(dayIndex, timeSlot)
                        ? "bg-success text-success-foreground"
                        : "bg-muted hover:bg-muted/80"
                      }`}
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
            Your current weekly schedule. Students can book sessions during
            green time slots.
          </span>
        </div>
      </div>
    </div>
  );
};

export default AvailabilityCalendar;
