import React, { useEffect, useState } from "react";
import { useSelector } from "react-redux";
import { Clock, CheckSquare, TrendingUp, CalendarClock } from "lucide-react";
import {
  LineChart,
  Line,
  XAxis,
  YAxis,
  CartesianGrid,
  Tooltip,
  ResponsiveContainer,
} from "recharts";
import Select from "components/ui/Select";
import WidgetCard from "./components/WidgetCard";
import ProgressBar from "./components/ProgressBar";
import RoleBasedHeader from "components/ui/RoleBasedHeader";
import { progressService } from "../../../services/progress/progress.service";
import { selectAuthUser } from "reducers/auth/authSelectors";

const ProgressAnalytics = () => {
  const authUser = useSelector(selectAuthUser);
  const selectedChildId = useSelector((state) => state.profile.selectedChildId);

  const [analyticsData, setAnalyticsData] = useState(null);
  const [courses, setCourses] = useState([]);
  const [selectedCourse, setSelectedCourse] = useState("all");
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);

  useEffect(() => {
    const fetchAnalytics = async () => {
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

        const response = await progressService.getProgressAnalytics(
          studentId,
          selectedCourse
        );

        if (response.data) {
          setAnalyticsData(response.data);

          // Build courses dropdown from courseBreakdown (only on initial load)
          if (!courses.length) {
            const courseOptions = [
              { value: "all", label: "All Courses" },
              ...(response.data.courseBreakdown || []).map((course) => ({
                value: course.courseId,
                label: course.courseTitle,
              })),
            ];
            setCourses(courseOptions);
          }
        }
      } catch (err) {
        console.error("Failed to fetch analytics:", err);
        setError(err?.message || "Failed to load analytics data");
      } finally {
        setLoading(false);
      }
    };

    fetchAnalytics();
  }, [authUser, selectedChildId, selectedCourse]);

  const handleCourseChange = (value) => {
    setSelectedCourse(value);
  };

  // API now returns filtered data based on selected course
  const data = analyticsData;

  if (loading) {
    return (
      <div className="min-h-screen bg-background">
        <RoleBasedHeader />
        <main className="pt-16 pb-20 lg:pb-8">
          <div className="text-center py-10 text-muted-foreground">
            Loading...
          </div>
        </main>
      </div>
    );
  }

  if (error) {
    return (
      <div className="min-h-screen bg-background">
        <RoleBasedHeader />
        <main className="pt-16 pb-20 lg:pb-8">
          <div className="max-w-[1400px] mx-auto px-4 sm:px-6 lg:px-8">
            <div className="mt-8 p-4 bg-red-50 border border-red-200 rounded-lg">
              <p className="text-red-800 text-sm">
                <strong>Error:</strong> {error}
              </p>
            </div>
          </div>
        </main>
      </div>
    );
  }

  if (!data) {
    return (
      <div className="min-h-screen bg-background">
        <RoleBasedHeader />
        <main className="pt-16 pb-20 lg:pb-8">
          <div className="text-center py-10 text-muted-foreground">
            No data available
          </div>
        </main>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-background">
      <RoleBasedHeader />
      <main className="pt-16 pb-20 lg:pb-8">
        <div className="max-w-[1400px] mx-auto px-4 sm:px-6 lg:px-8">
          <nav className="text-body2 text-muted-foreground my-8">
            Dashboard &gt; Your Progress
          </nav>
          <div className="flex flex-col md:flex-row justify-between items-start md:items-center mb-6">
            <div>
              <h1 className="text-3xl font-bold text-foreground">
                Progress & Analytics
              </h1>
              <p className="text-body1 text-muted-foreground mt-1">
                Track your learning journey with comprehensive insights and
                detailed progress reports.
              </p>
            </div>
            <div className="mt-4 md:mt-0">
              <Select
                options={courses}
                value={selectedCourse}
                onChange={handleCourseChange}
                placeholder="Select Course"
                className="w-40"
              />
            </div>
          </div>
          <div className="grid grid-cols-1 md:grid-cols-2 gap-4 mb-6">
            {/* First Widget (50% of the area) */}
            <div className="md:col-span-1">
              <WidgetCard
                title={`${selectedCourse === "all" ? "Overall" : "Course"} Progress`}
                leftIcon={<TrendingUp className="h-4 w-4 text-primary" />}
                className="flex flex-col items-start justify-between h-full"
                titleStyle="text-xl"
              >
                <div className="flex flex-row w-full">
                  <div className="flex-1 mr-4 ">
                    <p className="text-body2 text-muted-foreground mb-1">
                      Progress
                    </p>
                    <ProgressBar progress={data?.overview?.overallProgress || 0} />
                  </div>
                  <p className="text-h5 font-bold text-foreground">
                    {data?.overview?.overallProgress || 0}%
                  </p>
                </div>
              </WidgetCard>
            </div>

            {/* Container for the other three widgets (50% of the area, split into 3 columns) */}
            <div className="md:col-span-1 grid grid-cols-1 sm:grid-cols-3 gap-4">
              <WidgetCard
                title="Learning Time"
                value={`${data?.overview?.learningTime || 0} hrs`}
                rightIcon={<Clock className="h-5 w-5 text-primary" />}
                titleStyle="text-sm"
              />
              <WidgetCard
                title="Lessons Completed"
                value={`${data?.overview?.score?.completed || 0} / ${data?.overview?.score?.total || 0}`}
                rightIcon={<CheckSquare className="h-5 w-5 text-success" />}
                titleStyle="text-sm"
              />
              <WidgetCard
                title="Lessons Pending"
                value={data?.overview?.lessonsPending || 0}
                rightIcon={<CalendarClock className="h-5 w-5 text-warning" />}
                titleStyle="text-sm"
              />
            </div>
          </div>
          <div className="bg-card rounded-lg shadow-subtle p-4">
            <h3 className="text-xl font-medium text-foreground mb-4">
              Monthly Learning Progress
            </h3>
            <ResponsiveContainer width="100%" height={600}>
              <LineChart data={data?.monthlyProgress || []}>
                <CartesianGrid
                  strokeDasharray="3 3"
                  stroke="var(--color-border)"
                />
                <XAxis dataKey="month" stroke="var(--color-muted-foreground)" />
                <YAxis stroke="var(--color-muted-foreground)" />
                <Tooltip
                  formatter={(value, name) => {
                    if (name === "lessonsCompleted") {
                      return [value, "Score"];
                    }
                    return [value, name];
                  }}
                />
                <Line
                  type="monotone"
                  dataKey="lessonsCompleted"
                  stroke="var(--color-primary)"
                  strokeWidth={3}
                />
              </LineChart>
            </ResponsiveContainer>
          </div>
        </div>
      </main>
    </div>
  );
};

export default ProgressAnalytics;
