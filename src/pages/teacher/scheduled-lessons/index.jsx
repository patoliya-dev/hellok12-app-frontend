import { useEffect, useMemo, useState } from "react";
import Breadcrumb from "components/ui/Breadcrumb";
import RoleBasedHeader from "components/ui/RoleBasedHeader";
import Calendar from "./components/Calendar";
import TodaySchedule from "./components/TodaySchedule";
import QuickStats from "./components/QuickStats";
import { lessonsData } from "./data";

const breadCrumbData = [
  { label: "Dashboard", path: "/teacher/dashboard" },
  { label: "Scheduled Lessons", path: "#", current: true },
];

const ScheduledLessons = () => {
  // 1. UPDATED: Initialize the calendar view to the current month
  const [currentDate, setCurrentDate] = useState(new Date());

  // 2. UPDATED: Define "today" as the actual current date for styling
  const today = useMemo(() => {
    const d = new Date();
    d.setHours(0, 0, 0, 0); // Normalize to the start of the day
    return d;
  }, []);

  // 3. UPDATED: Set the initially selected date to be today
  const [selectedDate, setSelectedDate] = useState(today);

  // Dynamically filter lessons based on the selectedDate state
  const selectedDayLessons = useMemo(
    () =>
      lessonsData.filter((lesson) => {
        const lessonDate = new Date(lesson.date);
        lessonDate.setHours(0, 0, 0, 0);

        const selected = new Date(selectedDate);
        selected.setHours(0, 0, 0, 0);

        return lessonDate.getTime() === selected.getTime();
      }),
    [selectedDate]
  );

  // Static stats from the image
  const stats = useMemo(() => {
    const total = lessonsData.length;
    const completed = lessonsData.filter(
      (lesson) => lesson.status === "completed"
    ).length;
    const pending = lessonsData.filter(
      (lesson) => lesson.status === "pending"
    ).length;
    return { total, pending, completed };
  }, []); // The empty dependency array ensures this is only calculated once on initial render

  return (
    <div className="min-h-screen bg-background">
      {/* Header */}
      <RoleBasedHeader />
      <main className="max-w-[1450px] mx-auto px-4 sm:px-6 lg:px-8 pt-16 pb-20 lg:pb-8">
        <Breadcrumb customPath={breadCrumbData} className="mt-8" />
        <section>
          <div className="flex flex-col gap-6 md:gap-0 md:flex-row md:justify-between md:items-center">
            <div>
              <h1 className="text-foreground font-bold text-h3 mb-2">
                Scheduled Lessons Calendar
              </h1>
              <p className="text-muted-foreground text-body2 xl:text-[16px]">
                Your upcoming lessons history
              </p>
            </div>
          </div>
        </section>
        {/* Main Content Area */}
        <section className="mt-8 grid grid-cols-1 xl:grid-cols-3 xl:gap-8">
          {/* Calendar View (Main Part) */}
          <div className="xl:col-span-2">
            <Calendar
              currentDate={currentDate}
              setCurrentDate={setCurrentDate}
              lessons={lessonsData}
              today={today}
              selectedDate={selectedDate}
              setSelectedDate={setSelectedDate}
            />
          </div>

          {/* Sidebar */}
          <aside className="space-y-6 mt-8 xl:mt-0">
            <QuickStats stats={stats} />
            <TodaySchedule
              lessons={selectedDayLessons}
              selectedDate={selectedDate}
              today={today}
            />
          </aside>
        </section>
      </main>
    </div>
  );
};

export default ScheduledLessons;
