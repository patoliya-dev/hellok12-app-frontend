import React, { useEffect } from 'react';
import { useDispatch, useSelector } from 'react-redux';
import { fetchProgress, fetchCourses, setSelectedCourse } from '../../../features/progress/progressSlice';
import { Clock, CheckSquare, TrendingUp, CalendarClock } from 'lucide-react';
import {
  LineChart, Line, XAxis, YAxis, CartesianGrid, Tooltip, ResponsiveContainer
} from 'recharts';
import Select from 'components/ui/Select';
import WidgetCard from './components/WidgetCard';
import ProgressBar from './components/ProgressBar';
import RoleBasedHeader from 'components/ui/RoleBasedHeader';

const ProgressAnalytics = () => {
  const dispatch = useDispatch();
  const { courses, selectedCourse, data, loading } = useSelector((state) => state.progress);

  useEffect(() => {
    dispatch(fetchCourses());
    dispatch(fetchProgress(selectedCourse));
  }, [dispatch, selectedCourse]);

  const handleCourseChange = (value) => {
    dispatch(setSelectedCourse(value));
  };

  if (loading) return <div className="text-center py-10 text-muted-foreground">Loading...</div>;

  return (
    <div className="min-h-screen bg-background">
      {/* <Header /> */}
      <RoleBasedHeader />
      <main className="pt-16 pb-20 lg:pb-8">

        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <nav className="text-body2 text-muted-foreground my-8">
            Dashboard &gt; Your Progress
          </nav>
          <div className="flex flex-col md:flex-row justify-between items-start md:items-center mb-6">
            <div>
              <h1 className="text-3xl font-bold text-foreground">Progress & Analytics</h1>
              <p className="text-body1 text-muted-foreground mt-1">
                Track your learning journey with comprehensive insights and detailed progress reports.
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
                title={`${data.label || 'Course A'} Progress`}
                leftIcon={<TrendingUp className="h-4 w-4 text-primary" />}
                className="flex flex-col items-start justify-between h-full"
                titleStyle="text-xl"
              >
                <div className="flex flex-row w-full">
                  <div className="flex-1 mr-4 ">
                    <p className="text-body2 text-muted-foreground mb-1">Progress</p>
                    <ProgressBar progress={data.progress || 0} />
                  </div>
                  <p className="text-h5 font-bold text-foreground">{data.progress}%</p>
                </div>
              </WidgetCard>
            </div>

            {/* Container for the other three widgets (50% of the area, split into 3 columns) */}
            <div className="md:col-span-1 grid grid-cols-1 sm:grid-cols-3 gap-4">
              <WidgetCard
                title="Learning Time"
                value={`${data.learningTime} hrs`}
                rightIcon={<Clock className="h-5 w-5 text-primary" />}
                titleStyle="text-sm"
              />
              <WidgetCard
                title="Lessons Completed"
                value={`${data.completedLessons} / ${data.totalLessons}`}
                rightIcon={<CheckSquare className="h-5 w-5 text-success" />}
                titleStyle="text-sm"
              />
              <WidgetCard
                title="Lessons Pending"
                value={data.pendingLessons}
                rightIcon={<CalendarClock className="h-5 w-5 text-warning" />}
                titleStyle="text-sm"
              />
            </div>
          </div>
          <div className="bg-card rounded-lg shadow-subtle p-4">
            <h3 className="text-xl font-medium text-foreground mb-4">Month Learning Progress</h3>
            <ResponsiveContainer width="100%" height={600}>
              <LineChart data={data.monthlyProgress || []}>
                <CartesianGrid strokeDasharray="3 3" stroke="var(--color-border)" />
                <XAxis dataKey="month" stroke="var(--color-muted-foreground)" />
                <YAxis stroke="var(--color-muted-foreground)" />
                <Tooltip />
                <Line type="monotone" dataKey="score" stroke="var(--color-primary)" strokeWidth={3} />
              </LineChart>
            </ResponsiveContainer>
          </div>
        </div>
      </main>
    </div>
  );
};

export default ProgressAnalytics;
