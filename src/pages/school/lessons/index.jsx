import { useState, useEffect, useCallback, useMemo } from "react";
import { useNavigate } from "react-router-dom";
import UpcomingLessons from "./components/UpcomingLessons";
import LessonsHistory from "./components/LessonsHistory";
import { Calendar, CalendarClock, ChevronDown, History } from "lucide-react";
import Loader from "../../../components/ui/Loader";
import RoleBasedHeader from "../../../components/ui/RoleBasedHeader";
import { getCoursesForSchool } from "../../../services/lessons/lesson.service";

const LessonsPage = () => {
  const [activeTab, setActiveTab] = useState("upcoming");
  const [courses, setCourses] = useState([]);
  const [selectedCourse, setSelectedCourse] = useState("");
  const [loadingCourses, setLoadingCourses] = useState(false);

  const navigate = useNavigate();

  const fetchCourses = useCallback(async () => {
    const ctrl = new AbortController();
    setLoadingCourses(true);
    try {
      const response = await getCoursesForSchool({ signal: ctrl.signal });

      // support multiple response shapes defensively
      const list =
        response?.data?.courses || response?.courses || response?.data || [];

      setCourses(Array.isArray(list) ? list : []);
    } catch (error) {
      if (error?.name !== "AbortError" && error?.name !== "CanceledError") {
        console.error("Failed to fetch school courses:", error);
      }
      setCourses([]);
    } finally {
      setLoadingCourses(false);
    }
    return () => ctrl.abort();
  }, []);

  useEffect(() => {
    fetchCourses();
  }, [fetchCourses]);

  const getTabClass = useCallback(
    (tabName) =>
      `px-4 py-2.5 rounded-md font-medium text-sm transition-all duration-200 flex items-center gap-2 ${
        activeTab === tabName
          ? "bg-white shadow-sm text-brand-gray-800"
          : "bg-transparent text-brand-gray-600 hover:bg-gray-50"
      }`,
    [activeTab],
  );

  const handleCourseChange = useCallback((e) => {
    setSelectedCourse(e.target.value);
  }, []);

  const handleCalendarClick = useCallback(() => {
    navigate("/school/scheduled-lessons");
  }, [navigate]);

  const headerDescription = useMemo(() => {
    return "Upcoming lessons and lesson history for your school";
  }, []);

  return (
    <div className="min-h-screen bg-background">
      <RoleBasedHeader />

      <main className="pt-16 pb-20 lg:pb-8">
        <div className="p-4 md:p-8 max-w-[1400px] mx-auto">
          <header className="flex flex-col md:flex-row justify-between items-start md:items-center mb-8 gap-4">
            <div>
              <h1 className="text-3xl font-bold text-brand-gray-800">
                Lessons
              </h1>
              <p className="text-brand-gray-600 mt-1">{headerDescription}</p>
            </div>

            <div className="flex items-center gap-4 w-full md:w-auto">
              <button
                className="flex items-center gap-2 px-4 py-2 border border-gray-300 bg-white rounded-md text-sm font-medium text-gray-700 hover:bg-gray-50"
                onClick={handleCalendarClick}
              >
                <Calendar size={16} /> My Calendar
              </button>

              <div className="relative w-full md:w-56">
                <select
                  className="w-full px-4 py-2 border border-gray-300 bg-white rounded-md text-sm font-medium text-gray-700 appearance-none focus:outline-none focus:ring-2 focus:ring-brand-blue"
                  value={selectedCourse}
                  onChange={handleCourseChange}
                  disabled={loadingCourses}
                >
                  <option value="">Select Course</option>
                  {courses.map((course) => (
                    <option key={course._id} value={course._id}>
                      {course.title}
                    </option>
                  ))}
                </select>

                <ChevronDown
                  className="absolute right-3 top-1/2 -translate-y-1/2 text-gray-400 pointer-events-none"
                  size={18}
                />
              </div>
            </div>
          </header>

          <div className="flex">
            <div className="bg-brand-gray-200 p-1.5 flex items-center gap-4 rounded-lg sm mb-6">
              <button
                className={getTabClass("upcoming")}
                onClick={() => setActiveTab("upcoming")}
              >
                <CalendarClock size={16} />
                Upcoming Lessons
              </button>

              <button
                className={getTabClass("history")}
                onClick={() => setActiveTab("history")}
              >
                <History size={16} /> Lessons History
              </button>
            </div>
          </div>

          <main>
            {loadingCourses ? (
              <div className="flex justify-center items-center py-12">
                <Loader />
              </div>
            ) : activeTab === "upcoming" ? (
              <UpcomingLessons selectedCourse={selectedCourse} />
            ) : (
              <LessonsHistory selectedCourse={selectedCourse} />
            )}
          </main>
        </div>
      </main>
    </div>
  );
};

export default LessonsPage;
