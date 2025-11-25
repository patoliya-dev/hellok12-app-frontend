import { useEffect, useMemo, useState } from "react";
import Breadcrumb from "components/ui/Breadcrumb";
import RoleBasedHeader from "components/ui/RoleBasedHeader";
import Calendar from "./components/Calendar";
import TodaySchedule from "./components/TodaySchedule";
import QuickStats from "./components/QuickStats";
import { getCalendarData } from "../../../services/lessons/lesson.service";
import Loader from "components/ui/Loader";

const breadCrumbData = [
  { label: "Dashboard", path: "/teacher/dashboard" },
  { label: "Scheduled Lessons", path: "#", current: true },
];

const ScheduledLessons = () => {
  const [currentDate, setCurrentDate] = useState(new Date());

  const today = useMemo(() => {
    const d = new Date();
    d.setHours(0, 0, 0, 0);
    return d;
  }, []);

  const [selectedDate, setSelectedDate] = useState(today);
  const [lessons, setLessons] = useState([]);
  const [stats, setStats] = useState({ total: 0, pending: 0, completed: 0 });
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);

  useEffect(() => {
    const fetchCalendarData = async () => {
      try {
        setLoading(true);
        setError(null);

        const month = currentDate.getMonth() + 1;
        const year = currentDate.getFullYear();

        const data = await getCalendarData(month, year);
        const transformedLessons = [];
        if (data.monthOverview) {
          Object.entries(data.monthOverview).forEach(([date, dateData]) => {
            dateData.lessons.forEach((lesson) => {
              transformedLessons.push({
                id: lesson.id,
                title: lesson.title,
                date: date,
                time: lesson.time,
                color: "blue",
                status: "pending",
              });
            });
          });
        }

        setLessons(transformedLessons);
        setStats(data.stats || { total: 0, pending: 0, completed: 0 });
      } catch (err) {
        console.error("Error fetching calendar data:", err);
        setError(err.message || "Failed to load calendar data");
      } finally {
        setLoading(false);
      }
    };

    fetchCalendarData();
  }, [currentDate]);

  const selectedDayLessons = useMemo(
    () =>
      lessons.filter((lesson) => {
        const lessonDate = new Date(lesson.date);
        lessonDate.setHours(0, 0, 0, 0);

        const selected = new Date(selectedDate);
        selected.setHours(0, 0, 0, 0);

        return lessonDate.getTime() === selected.getTime();
      }),
    [selectedDate, lessons]
  );

  return (
    <div className="min-h-screen bg-background">
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

        {/* Error State */}
        {error && (
          <div className="mt-8 p-4 bg-red-50 border border-red-200 rounded-lg">
            <p className="text-red-800 text-sm">
              <strong>Error:</strong> {error}
            </p>
          </div>
        )}

        {/* Loading State */}
        {loading ? (
          <Loader />
        ) : (
          /* Main Content Area */
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
