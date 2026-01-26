import { useEffect, useMemo, useState, useCallback } from "react";
import Breadcrumb from "components/ui/Breadcrumb";
import RoleBasedHeader from "components/ui/RoleBasedHeader";
import Select from "components/ui/Select";

import Calendar from "../../teacher/scheduled-lessons/components/Calendar";
import QuickStats from "../../teacher/scheduled-lessons/components/QuickStats";
import TodaySchedule from "../../teacher/scheduled-lessons/components/TodaySchedule";

import Loader from "components/ui/Loader";
import { getSchoolCalendarData } from "../../../services/lessons/lesson.service";
import { breadCrumbData } from "./data";

const ScheduledLessons = () => {
  /* -------------------- State -------------------- */
  const [currentDate, setCurrentDate] = useState(new Date());
  const [selectedTeacher, setSelectedTeacher] = useState("all");

  const [lessons, setLessons] = useState([]);
  const [stats, setStats] = useState({ total: 0, pending: 0, completed: 0 });
  const [teacherOptions, setTeacherOptions] = useState([
    { value: "all", label: "All Teachers" },
  ]);

  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);

  /* -------------------- Today + Selected Day -------------------- */
  const today = useMemo(() => {
    const d = new Date();
    d.setHours(0, 0, 0, 0);
    return d;
  }, []);

  const [selectedDate, setSelectedDate] = useState(today);

  /* -------------------- Helpers -------------------- */

  // Convert Date -> YYYY-MM-DD using LOCAL calendar day
  const toLocalDateKey = useCallback((d) => {
    const yyyy = d.getFullYear();
    const mm = String(d.getMonth() + 1).padStart(2, "0");
    const dd = String(d.getDate()).padStart(2, "0");
    return `${yyyy}-${mm}-${dd}`;
  }, []);

  /* -------------------- Fetch Calendar Data -------------------- */
  useEffect(() => {
    const controller = new AbortController();

    const fetchCalendarData = async () => {
      try {
        setLoading(true);
        setError(null);

        const month = currentDate.getMonth() + 1;
        const year = currentDate.getFullYear();

        const data = await getSchoolCalendarData(month, year, selectedTeacher, {
          signal: controller.signal,
        });

        /* ---------- Teachers (school only) ---------- */
        if (Array.isArray(data?.teachers) && data.teachers.length > 0) {
          setTeacherOptions(data.teachers);
        }

        /* ---------- Flatten monthOverview for Calendar ---------- */
        const flatLessons = [];

        if (data?.monthOverview) {
          Object.entries(data.monthOverview).forEach(([dateKey, dayData]) => {
            (dayData.lessons || []).forEach((lesson) => {
              const start = new Date(lesson.start);

              flatLessons.push({
                id: lesson.id,
                title: lesson.title,
                date: dateKey, // already timezone-correct from BE
                time: start.toLocaleTimeString("en-US", {
                  hour: "2-digit",
                  minute: "2-digit",
                  hour12: true,
                }),
                teacherId: lesson.teacher?._id,
                color: "blue",
                status: "pending",
              });
            });
          });
        }

        setLessons(flatLessons);
        setStats(data?.stats || { total: 0, pending: 0, completed: 0 });
      } catch (err) {
        if (err?.name !== "AbortError") {
          console.error("Failed to load school calendar:", err);
          setError("Failed to load calendar data");
        }
      } finally {
        setLoading(false);
      }
    };

    fetchCalendarData();

    return () => controller.abort();
  }, [currentDate, selectedTeacher]);

  /* -------------------- Selected Day Lessons -------------------- */
  const selectedDayLessons = useMemo(() => {
    const selectedKey = toLocalDateKey(new Date(selectedDate));
    return lessons.filter((l) => l.date === selectedKey);
  }, [lessons, selectedDate, toLocalDateKey]);

  /* -------------------- Render -------------------- */
  return (
    <div className="min-h-screen bg-background">
      {/* Main Header */}
      <RoleBasedHeader />

      <main className="max-w-[1450px] mx-auto px-4 sm:px-6 lg:px-8 pt-16 pb-20 lg:pb-8">
        {/* Breadcrumb */}
        <Breadcrumb customPath={breadCrumbData} className="mt-8" />

        {/* Header */}
        <section>
          <div className="flex flex-col gap-6 md:flex-row md:justify-between md:items-center">
            <div>
              <h1 className="text-h3 font-bold text-foreground mb-2">
                Scheduled Lessons Calendar
              </h1>
              <p className="text-muted-foreground">
                Manage and review all upcoming lessons across teachers
              </p>
            </div>

            {/* Teacher Filter */}
            <div className="flex items-center space-x-4">
              <Select
                label="Select Teacher"
                options={teacherOptions}
                value={selectedTeacher}
                onChange={setSelectedTeacher}
                className="md:w-48 lg:w-56"
              />
            </div>
          </div>
        </section>

        {/* Error */}
        {error && (
          <div className="mt-8 p-4 bg-red-50 border border-red-200 rounded-lg">
            <p className="text-red-800 text-sm">
              <strong>Error:</strong> {error}
            </p>
          </div>
        )}

        {/* Loading */}
        {loading ? (
          <Loader />
        ) : (
          <section className="mt-8 grid grid-cols-1 xl:grid-cols-3 xl:gap-8">
            {/* Calendar View (Main Part) */}
            <div className="xl:col-span-2">
              <Calendar
                currentDate={currentDate}
                setCurrentDate={setCurrentDate}
                lessons={lessons}
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
        )}
      </main>
    </div>
  );
};

export default ScheduledLessons;
