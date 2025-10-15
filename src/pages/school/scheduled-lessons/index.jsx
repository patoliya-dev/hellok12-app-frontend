import { useEffect, useMemo, useState } from "react";
import Breadcrumb from "components/ui/Breadcrumb";
import RoleBasedHeader from "components/ui/RoleBasedHeader";
import Select from "components/ui/Select";
import { breadCrumbData, teacherOption } from "./data";
import Calendar from "../../../pages/teacher/scheduled-lessons/components/Calendar";
import QuickStats from "../../../pages/teacher/scheduled-lessons/components/QuickStats";
import TodaySchedule from "../../../pages/teacher/scheduled-lessons/components/TodaySchedule";
import { lessonsData as mockLessons } from "../../../pages/teacher/scheduled-lessons/data";

const ScheduledLessons = () => {
  const [currentDate, setCurrentDate] = useState(new Date());
  const [selectedTeacher, setSelectedTeacher] = useState("all");
  const [lessonData, setLessonData] = useState([]);
  const today = useMemo(() => {
    const d = new Date();
    d.setHours(0, 0, 0, 0);
    return d;
  }, []);

  const [selectedDate, setSelectedDate] = useState(today);

  useEffect(() => {
    const filteredLessons =
      selectedTeacher === "all"
        ? mockLessons
        : mockLessons.filter((lesson) => lesson.teacherId === selectedTeacher);
    setLessonData(filteredLessons);
  }, [selectedTeacher]);

  const selectedDayLessons = useMemo(
    () =>
      lessonData.filter((lesson) => {
        const lessonDate = new Date(lesson.date);
        lessonDate.setHours(0, 0, 0, 0);

        const selected = new Date(selectedDate);
        selected.setHours(0, 0, 0, 0);

        return lessonDate.getTime() === selected.getTime();
      }),
    [lessonData, selectedDate, selectedTeacher]
  );

  const stats = useMemo(() => {
    const total = lessonData.length;
    const completed = lessonData.filter(
      (lesson) => lesson.status === "completed"
    ).length;
    const pending = lessonData.filter(
      (lesson) => lesson.status === "pending"
    ).length;
    return { total, pending, completed };
  }, [selectedTeacher, lessonData]);

  return (
    <div className="min-h-screen bg-background">
      {/* Header */}
      <RoleBasedHeader />
      <main className="max-w-[1450px] mx-auto px-4 sm:px-6 lg:px-8 pt-16 pb-20 lg:pb-8">
        <Breadcrumb customPath={breadCrumbData} className="mt-8" />
        <section>
          <div className="flex flex-col gap-6 md:gap-0 md:flex-row md:justify-between md:items-center">
            <div>
              <h1 className="text-h3 font-bold text-foreground mb-2">
                Scheduled Lessons Calendar
              </h1>
              <p className="text-brand-gray-500">
                Your upcoming lessons history
              </p>
            </div>
            <div className="flex items-center space-x-4">
              <Select
                label="Select Teachers"
                options={teacherOption}
                value={selectedTeacher}
                onChange={(value) => setSelectedTeacher(value)}
                className="md:w-44 lg:w-52"
              />
            </div>
          </div>
        </section>
        <section className="mt-8 grid grid-cols-1 xl:grid-cols-3 xl:gap-8">
          {/* Calendar View (Main Part) */}
          <div className="xl:col-span-2">
            <Calendar
              currentDate={currentDate}
              setCurrentDate={setCurrentDate}
              lessons={lessonData}
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
