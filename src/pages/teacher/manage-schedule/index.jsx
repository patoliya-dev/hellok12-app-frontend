import { useEffect, useMemo, useState } from "react";
import RoleBasedHeader from "components/ui/RoleBasedHeader";
import Icon from "components/AppIcon";
import AvailabilityCalendar from "./components/AvailabilityCalendar";
import Minicalendar from "./components/MiniCalendar";
import TimeSlots from "./components/TimeSlots";
import { timeSlots } from "./data";

const ManageSchedule = () => {
  const [currentDate, setCurrentDate] = useState(new Date());
  // Mock availability data
  const [availability, setAvailability] = useState({
    mon: ["09:00", "10:00", "14:00", "15:00", "16:00"],
    tue: ["09:00", "10:00", "11:00", "14:00", "15:00"],
    wed: ["10:00", "11:00", "14:00", "15:00", "16:00"],
    thu: ["09:00", "10:00", "14:00", "15:00"],
    fri: ["09:00", "10:00", "11:00", "14:00"],
    sat: ["10:00", "11:00"],
    sun: [],
  });

  const handleDateSelect = (date) => {
    setCurrentDate(date);
  };

  const dayName = currentDate?.toLocaleDateString("en-US", {
    weekday: "short",
  });

  const handleAvailabilitySelect = (time) => {
    const day = dayName.toLowerCase();
    if (availability[day].includes(time)) {
      setAvailability({
        ...availability,
        [day]: availability[day].filter((t) => t !== time),
      });
    } else {
      setAvailability({
        ...availability,
        [day]: [...availability[day], time],
      });
    }
  };

  const toggleAllSlotsForDay = (day) => {
    const dayAvailability = availability?.[day] || [];
    const isAllSelected = dayAvailability?.length === timeSlots?.length;

    const updatedAvailability = {
      ...availability,
      [day]: isAllSelected ? [] : [...timeSlots],
    };
    setAvailability(updatedAvailability);
  };

  const handleClearAll = () => {
    setAvailability({
      mon: [],
      tue: [],
      wed: [],
      thu: [],
      fri: [],
      sat: [],
      sun: [],
    });
  };

  return (
    <div className="min-h-screen bg-background">
      {/* Header */}
      <RoleBasedHeader />
      <main className="max-w-[1450px] mx-auto px-4 sm:px-6 lg:px-8 pt-16 pb-20 lg:pb-8">
        <section className="my-8">
          <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between mb-6">
            <div>
              <h1 className="text-2xl font-semibold text-foreground mb-2">
                Manage Schedule
              </h1>
              <p className="text-muted-foreground">
                Manage your teaching lessons and student bookings
              </p>
            </div>
          </div>
        </section>
        <section>
          <div className="grid grid-cols-1 lg:grid-cols-3 gap-6 mb-8">
            <div className="lg:col-span-2 bg-card rounded-lg border border-border p-6">
              <div className="mb-8">
                <h3 className="text-lg font-semibold text-foreground mb-2">
                  Set Availability
                </h3>
                <p className="text-muted-foreground">
                  Set your available hours for each day of the week. Click on
                  time slots to toggle availability.
                </p>
              </div>
              <div className="flex flex-col gap-8">
                <Minicalendar
                  currentDate={currentDate}
                  onDateSelect={handleDateSelect}
                />
                <TimeSlots
                  selectedDay={dayName}
                  selectedDate={currentDate}
                  availability={availability}
                  setAvailability={handleAvailabilitySelect}
                  toggleAllSlotsForDay={toggleAllSlotsForDay}
                  handleClearAll={handleClearAll}
                />
              </div>
            </div>
            <div className="lg:col-span-1">
              <AvailabilityCalendar
                availability={availability}
                currentDate={currentDate}
              />
            </div>
          </div>
        </section>
      </main>
    </div>
  );
};

export default ManageSchedule;
