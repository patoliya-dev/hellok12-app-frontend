import React, { useState, useMemo } from 'react';
import Calendar from './components/Calendar';
import TodaySchedule from './components/TodaySchedule';
import QuickStats from './components/QuickStats';
import { lessonsData } from './data';
import RoleBasedHeader from 'components/ui/RoleBasedHeader';

const LessonsCalendar = () => {
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
  const selectedDayLessons = useMemo(() =>
    lessonsData.filter(lesson => {
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
    const completed = lessonsData.filter(lesson => lesson.status === 'completed').length;
    const pending = lessonsData.filter(lesson => lesson.status === 'pending').length;
    return { total, pending, completed };
  }, []); // The empty dependency array ensures this is only calculated once on initial render

  return (
    <div className="bg-background min-h-screen p-4 sm:p-6 lg:p-8 font-sans">
      <RoleBasedHeader />
      <main className="pt-16 pb-20 lg:pb-8">
        <div className="p-4 md:p-8 max-w-[1400px] mx-auto">
          {/* Page Header */}
          <header>
            <h1 className="text-3xl font-bold text-foreground">Lessons Calendar</h1>
            <p className="text-muted-foreground mt-1">Your learning upcoming lessons and booking history</p>
          </header>

          {/* Main Content Area */}
          <main className="mt-8 grid grid-cols-1 xl:grid-cols-3 xl:gap-8">

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
              <TodaySchedule
                lessons={selectedDayLessons}
                selectedDate={selectedDate}
                today={today}
              />
              <QuickStats stats={stats} />
            </aside>

          </main>
        </div>
      </main>
    </div>
  );
};

export default LessonsCalendar;
