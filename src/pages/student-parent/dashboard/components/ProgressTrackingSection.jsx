import React, { useState, useEffect } from "react";
import Icon from "../../../../components/AppIcon";
import { useNavigate } from "react-router-dom";
import { useSelector } from "react-redux";
import { selectAuthUser } from "reducers/auth/authSelectors";
import { getRolePath } from "../../../../utils/rolePath";
import { progressService } from "../../../../services/progress/progress.service";

const ProgressTrackingSection = () => {
  const [progressData, setProgressData] = useState({});
  const [achievements, setAchievements] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);
  const navigate = useNavigate();
  const authUser = useSelector(selectAuthUser);
  const selectedChildId = useSelector((state) => state.profile.selectedChildId);

  useEffect(() => {
    const fetchProgressData = async () => {
      try {
        setLoading(true);
        setError(null);
        
        // Determine which student ID to use
        const studentId = authUser?.role === "parent" 
          ? selectedChildId 
          : authUser?.id;

        if (!studentId) {
          setLoading(false);
          return;
        }

        const response = await progressService.getProgressDashboard(studentId);
        
        // Map API response to component's expected format
        if (response.data) {
          const apiProgress = response.data.progress || {};
          const apiWeeklyStats = response.data.weeklyStats || {};
          
          // Transform API data to match component structure
          const transformedProgress = {
            currentLevel: 0, // Not provided by API
            xpPoints: apiProgress.overallProgress || 0,
            xpToNextLevel: 100 - (apiProgress.overallProgress || 0), // Calculate remaining to 100%
            learningStreak: apiProgress.upcomingLessons || 0,
            completedLessons: apiProgress.completedLessons || 0,
            totalLessons: apiProgress.totalLessons || 0,
            weeklyGoal: 0, // Not provided by API
            weeklyCompleted: apiProgress.lessonsDone || 0,
            weeklyHours: apiWeeklyStats.totalHours || 0,
            subjects: [], // Not provided by API
          };
          
          setProgressData(transformedProgress);
          setAchievements([]); // No achievements in current API response
        }
      } catch (err) {
        console.error("Failed to fetch progress data:", err);
        setError(err?.message || "Failed to load progress data");
        // Set default empty data on error
        setProgressData({
          currentLevel: 0,
          xpPoints: 0,
          xpToNextLevel: 0,
          learningStreak: 0,
          completedLessons: 0,
          totalLessons: 0,
          weeklyGoal: 0,
          weeklyCompleted: 0,
          weeklyHours: 0,
          subjects: [],
        });
        setAchievements([]);
      } finally {
        setLoading(false);
      }
    };

    fetchProgressData();
  }, [authUser, selectedChildId]);

  const getProgressPercentage = () => {
    const totalXP = progressData.xpPoints + progressData.xpToNextLevel;
    return totalXP > 0 ? ((progressData.xpPoints / totalXP) * 100).toFixed(0) : 0;
  };

  // Loading state
  if (loading) {
    return (
      <div className="space-y-6">
        <div className="bg-card rounded-lg border border-border p-6">
          <div className="animate-pulse">
            <div className="h-6 bg-muted rounded w-32 mb-4"></div>
            <div className="h-20 w-20 bg-muted rounded-full mx-auto mb-4"></div>
            <div className="grid grid-cols-2 lg:grid-cols-3 gap-3">
              {[1, 2, 3].map((i) => (
                <div key={i} className="h-24 bg-muted rounded-lg"></div>
              ))}
            </div>
          </div>
        </div>
      </div>
    );
  }

  // Error state
  if (error) {
    return (
      <div className="space-y-6">
        <div className="bg-card rounded-lg border border-destructive/50 p-6">
          <div className="text-center">
            <Icon name="AlertCircle" size={40} className="text-destructive mx-auto mb-3" />
            <p className="text-destructive mb-2">Failed to load progress</p>
            <p className="text-sm text-muted-foreground">{error}</p>
          </div>
        </div>
      </div>
    );
  }

  return (
    <div className="space-y-6">
      {/* Level and XP Progress */}
      <div className="bg-card rounded-lg border border-border p-6">
        <div className="flex items-center justify-between mb-4">
          <div className="flex items-center space-x-2">
            <Icon name="Trophy" size={24} color="var(--color-primary)" />
            <h2 className="text-xl font-semibold text-foreground">
              Your Progress
            </h2>
          </div>
          <div
            className="text-right cursor-pointer"
            onClick={() => {
              navigate(
                getRolePath(authUser?.role || "student", "progress-analytics")
              );
            }}
          >
            <div className="text-sm font-bold text-primary">View Details</div>
          </div>
        </div>
        <div className="text-center">
          <div className="relative z-10 w-20 h-20 mx-auto mb-3">
            <svg
              className="w-20 h-20 transform -rotate-90 z-1000"
              viewBox="0 0 36 36"
            >
              <path
                className="text-muted stroke-current"
                strokeWidth="3"
                fill="none"
                d="M18 2.0845 a 15.9155 15.9155 0 0 1 0 31.831 a 15.9155 15.9155 0 0 1 0 -31.831"
              />
              <path
                className={`text-blue-500 stroke-current`}
                strokeWidth="3"
                strokeLinecap="round"
                fill="none"
                strokeDasharray={`${getProgressPercentage()}, 100`}
                d="M18 2.0845 a 15.9155 15.9155 0 0 1 0 31.831 a 15.9155 15.9155 0 0 1 0 -31.831"
              />
            </svg>
            <div className="absolute inset-0 flex items-center justify-center z-1000">
              <span className="text-sm font-semibold text-foreground">
                {getProgressPercentage()}%
              </span>
            </div>
          </div>
          <p className="text-sm font-medium text-foreground">
            Overall Progress
          </p>
        </div>

        {/* Stats Grid */}
        <div className="grid grid-cols-2 lg:grid-cols-3 gap-3">
          <div className="text-center p-3 bg-muted/50 rounded-lg">
            <div className="flex items-center justify-center mb-2">
              <Icon
                name="CalendarClock"
                size={20}
                color="var(--color-purple)"
              />
            </div>
            <div className="text-lg font-semibold text-foreground">
              {progressData.learningStreak}
            </div>
            <div className="text-xs text-muted-foreground">
              Upcoming Lessons
            </div>
          </div>

          <div className="text-center p-3 bg-muted/50 rounded-lg">
            <div className="flex items-center justify-center mb-2">
              <Icon name="BookOpen" size={20} color="var(--color-success)" />
            </div>
            <div className="text-lg font-semibold text-foreground">
              {progressData.completedLessons}
            </div>
            <div className="text-xs text-muted-foreground">Lessons Done</div>
          </div>

          <div className="text-center p-3 bg-muted/50 rounded-lg">
            <div className="flex items-center justify-center mb-2">
              <Icon name="Clock4" size={20} color="var(--color-primary)" />
            </div>
            <div className="text-lg font-semibold text-foreground">
              {progressData.weeklyHours} hrs
            </div>
            <div className="text-xs text-muted-foreground">Learning Time</div>
            <div className="text-xs text-muted-foreground">This Week</div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default ProgressTrackingSection;
