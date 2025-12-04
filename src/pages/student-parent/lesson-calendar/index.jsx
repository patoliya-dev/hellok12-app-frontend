import React, { useState, useMemo, useEffect } from "react";
import { useSelector } from "react-redux";
import Calendar from "./components/Calendar";
import TodaySchedule from "./components/TodaySchedule";
import QuickStats from "./components/QuickStats";
import { getStudentCalendarData } from "../../../services/lessons/lesson.service";
import RoleBasedHeader from "components/ui/RoleBasedHeader";
import Loader from "components/ui/Loader";
import { selectAuthUser } from "reducers/auth/authSelectors";

const LessonsCalendar = () => {
  const [currentDate, setCurrentDate] = useState(new Date());
  const authUser = useSelector(selectAuthUser);
  const selectedChildId = useSelector((state) => state.profile.selectedChildId);

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

        // Determine which student ID to use
        const studentId =
          authUser?.role === "parent" ? selectedChildId : authUser?.id;

        if (!studentId) {
          setLoading(false);
          return;
        }

        const month = currentDate.getMonth() + 1;
        const year = currentDate.getFullYear();

        const data = await getStudentCalendarData(studentId, month, year);
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
  }, [currentDate, authUser, selectedChildId]);

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
    <div className="bg-background min-h-screen p-4 sm:p-6 lg:p-8 font-sans">
      <RoleBasedHeader />
      <main className="pt-16 pb-20 lg:pb-8">
        <div className="p-4 md:p-8 max-w-[1400px] mx-auto">
          {/* Page Header */}
          <header>
            <h1 className="text-3xl font-bold text-foreground">
              Lessons Calendar
            </h1>
            <p className="text-muted-foreground mt-1">
              Your learning upcoming lessons and booking history
            </p>
          </header>

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
            <main className="mt-8 grid grid-cols-1 xl:grid-cols-3 xl:gap-8">
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
                <TodaySchedule
                  lessons={selectedDayLessons}
                  selectedDate={selectedDate}
                  today={today}
                />
                <QuickStats stats={stats} />
              </aside>
            </main>
          )}
        </div>
      </main>
    </div>
  );
};

export default LessonsCalendar;
