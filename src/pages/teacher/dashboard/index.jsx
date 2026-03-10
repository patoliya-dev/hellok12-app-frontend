import React, { useCallback, useEffect, useState } from "react";
import { useSelector, useDispatch } from "react-redux";
import { useNavigate } from "react-router-dom";
import { selectAuthUser } from "reducers/auth/authSelectors";
import RoleBasedHeader from "components/ui/RoleBasedHeader";
import NotificationCenter from "components/ui/NotificationCenter";
import MetricsCard from "./components/MetricsCard";
import TodaySchedule from "./components/TodaySchedule";
import AvailabilityCalendar from "./components/AvailabilityCalendar";
import StudentFeedback from "./components/StudentFeedback";
import {
  getDashboardData,
  markSessionCompleted,
} from "../../../services/lessons/lesson.service";
import { dashboardService } from "../../../services/dashboard/dashboard.service";
import { feedbackRatingAPI } from "../../../services/feedbacks/feedback.service";
import {
  fetchSchedule,
  fetchSlotsForMonth,
} from "../../../reducers/schedule/scheduleThunks";
import {
  idxToDayStr,
  isHHMM,
  isNumber,
  minutesToHHMM,
} from "../../../utils/time12h";
import Loader from "components/ui/Loader";
import { formatTimeToTZ, getUserTimezone } from "../../../utils/timezone";
import { errorToast, successToast } from "../../../utils/utils";

const TeacherDashboard = () => {
  const dispatch = useDispatch();
  const userTimezone = getUserTimezone();
  const [currentTime, setCurrentTime] = useState(new Date());
  const [showNotifications, setShowNotifications] = useState(false);
  const [todaySessions, setTodaySessions] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);
  const [metricsData, setMetricsData] = useState([]);
  const [metricsLoading, setMetricsLoading] = useState(true);
  const [studentFeedbacks, setStudentFeedbacks] = useState([]);
  const [feedbackLoading, setFeedbackLoading] = useState(true);
  const authUser = useSelector(selectAuthUser);
  const navigate = useNavigate();
  const teacherId = authUser?._id || authUser?.id;
  const scheduleState = useSelector((s) => s.schedule);

  const [availability, setAvailability] = useState({
    mon: [],
    tue: [],
    wed: [],
    thu: [],
    fri: [],
    sat: [],
    sun: [],
  });

  const transformMetricsData = (data) => {
    const metrics = [];

    if (data.upcomingSessions) {
      const change = data.upcomingSessions.changeFromLastWeek || 0;
      metrics.push({
        title: "Upcoming Sessions",
        value: String(data.upcomingSessions.count || 0),
        subtitle: "This week",
        icon: "Calendar",
        trend: change >= 0 ? "up" : "down",
        trendValue: `${change >= 0 ? "+" : ""}${change} from last week`,
        color: "primary",
      });
    }

    if (data.trialBookings) {
      const newRequests = data.trialBookings.newRequests || 0;
      metrics.push({
        title: "Trial Bookings",
        value: String(data.trialBookings.count || 0),
        subtitle: "Trial Lessons",
        icon: "Clock",
        trend: newRequests > 0 ? "up" : "down",
        trendValue: `${newRequests >= 0 ? "+" : ""}${newRequests} new requests`,
        color: "warning",
      });
    }

    if (data.averageRating) {
      const change = data.averageRating.changeThisMonth || 0;
      const rating = data.averageRating.rating || 0;
      metrics.push({
        title: "Average Rating",
        value: rating.toFixed(1),
        subtitle: `Based on ${data.averageRating.totalReviews || 0} reviews`,
        icon: "Star",
        trend: change >= 0 ? "up" : "down",
        trendValue: `${change >= 0 ? "+" : ""}${change.toFixed(1)} this month`,
        color: "success",
      });
    }

    if (data.monthlyEarnings) {
      const change = data.monthlyEarnings.changeFromLastMonth || 0;
      const amount = data.monthlyEarnings.amount || 0;
      const currency = data.monthlyEarnings.currency || "USD";
      const symbol = currency.toLowerCase() === "usd" ? "$" : currency;
      metrics.push({
        title: "Monthly Earnings",
        value: `${symbol}${amount.toLocaleString()}`,
        subtitle: data.monthlyEarnings.month || "This month",
        icon: "DollarSign",
        trend: change >= 0 ? "up" : "down",
        trendValue: `${change >= 0 ? "+" : ""}${change}% from last month`,
        color: "accent",
      });
    }

    return metrics;
  };

  // Fetch schedule data and hydrate availability
  useEffect(() => {
    if (!teacherId) return;
    dispatch(fetchSchedule(teacherId))
      .unwrap()
      .catch((err) => {
        console.error("Failed to fetch schedule:", err);
      });
  }, [dispatch, teacherId]);

  // Get current month's data
  const currentMonth = (() => {
    const d = new Date();
    return `${d.getFullYear()}-${String(d.getMonth() + 1).padStart(2, "0")}`;
  })();

  const slotsByMonth = useSelector((s) => s.schedule?.slotsByMonth || {});
  const monthlyWeeklyBaseline =
    slotsByMonth?.[currentMonth]?.monthlyWeekly || {};

  useEffect(() => {
    if (!teacherId || !currentMonth) return;
    const cached = scheduleState?.slotsByMonth?.[currentMonth];
    if (cached && cached.fetchedAt) return; // skip if recently cached
    dispatch(fetchSlotsForMonth({ teacherId, month: currentMonth }))
      .unwrap()
      .catch((err) => {
        console.error("Failed to fetch month slots:", err);
      });
  }, [currentMonth, teacherId, dispatch, scheduleState?.slotsByMonth]);

  useEffect(() => {
    const next = {
      sun: [],
      mon: [],
      tue: [],
      wed: [],
      thu: [],
      fri: [],
      sat: [],
    };

    const baseline = monthlyWeeklyBaseline || {};

    Object.entries(baseline || {}).forEach(([k, arr]) => {
      const idx = Number(k);
      const key = idxToDayStr[idx];
      if (!key) return;

      const normalized = (arr || [])
        .map((item) => {
          if (isHHMM(item)) return item;
          if (isNumber(item)) return minutesToHHMM(item);
          return null;
        })
        .filter(Boolean);

      next[key] = normalized;
    });

    setAvailability((prev) => ({ ...prev, ...next }));
  }, [monthlyWeeklyBaseline]);

  useEffect(() => {
    const fetchMetrics = async () => {
      try {
        setMetricsLoading(true);
        const response = await dashboardService.getDashboardMetrics();
        const transformedMetrics = transformMetricsData(response.data || {});
        setMetricsData(transformedMetrics);
      } catch (err) {
        console.error("Failed to fetch metrics:", err);
        setMetricsData([]);
      } finally {
        setMetricsLoading(false);
      }
    };

    fetchMetrics();
  }, []);

  useEffect(() => {
    const fetchFeedbacks = async () => {
      try {
        setFeedbackLoading(true);
        const params = {
          page: 1,
          limit: 2,
          sortBy: "newest",
        };
        const response = await feedbackRatingAPI.getFeedbackRatings(params);
        const feedbackData = response.data || response.feedbacks || [];
        setStudentFeedbacks(feedbackData);
      } catch (err) {
        console.error("Failed to fetch feedbacks:", err);
        setStudentFeedbacks([]);
      } finally {
        setFeedbackLoading(false);
      }
    };

    fetchFeedbacks();
  }, []);

  // Format time from ISO string to readable format
  const formatTime = useCallback(
    (isoString) =>
      formatTimeToTZ(isoString, userTimezone, {
        hour: "numeric",
        minute: "2-digit",
        hour12: true,
      }),
    [userTimezone],
  );

  const fetchDashboardData = useCallback(async () => {
    try {
      setLoading(true);
      setError(null);
      const data = await getDashboardData();
      const sessionsWithDates = (data?.data?.lessons || []).map((session) => ({
        ...session,
        startTime: formatTime(session?.lesson?.startAt),
        endTime: formatTime(session?.lesson?.endAt),
      }));
      setTodaySessions(sessionsWithDates);
    } catch (err) {
      console.error("Failed to fetch dashboard data:", err);
      setError(err.message || "Failed to load dashboard data");
    } finally {
      setLoading(false);
    }
  }, [formatTime]);

  useEffect(() => {
    fetchDashboardData();
  }, [fetchDashboardData]);

  useEffect(() => {
    const timer = setInterval(() => {
      setCurrentTime(new Date());
    }, 60000);

    return () => clearInterval(timer);
  }, []);

  const getGreeting = () => {
    const hour = currentTime.getHours();
    if (hour < 12) return "Good morning";
    if (hour < 17) return "Good afternoon";
    return "Good evening";
  };

  const TodayDate = () => {
    const today = new Date();
    const formattedDate = today.toLocaleString("en-US", {
      weekday: "long",
      year: "numeric",
      month: "long",
      day: "numeric",
      hour: "numeric",
      minute: "2-digit",
      hour12: true,
    });

    return <div>{formattedDate}</div>;
  };

  const handleJoinSession = (session) => {
    if (session.joinUrl) {
      window.open(session.joinUrl, "_blank");
    }
  };

  const handleCompleteSession = async (session, note) => {
    const sessionId = session?._id || session?.id;
    if (!sessionId) return;

    setTodaySessions((prev) =>
      prev.filter(
        (item) => String(item?._id || item?.id) !== String(sessionId),
      ),
    );

    try {
      await markSessionCompleted(sessionId, note ? { note } : {});
      successToast("Session marked as completed");
    } catch (err) {
      await fetchDashboardData();
      errorToast(err?.message || "Failed to mark session as completed");
    }
  };

  const handleViewAllSchedules = () => {
    navigate("/teacher/scheduled-lessons");
  };

  const handleViewAllFeedback = () => {
    navigate("/teacher/students-feedback");
  };

  const handleMessages = () => {
    navigate("/teacher/messages");
  };

  return (
    <div className="min-h-screen bg-background">
      {/* Header */}
      <RoleBasedHeader />

      {/* Notification Center */}
      <NotificationCenter
        isOpen={showNotifications}
        onClose={() => setShowNotifications(false)}
        userRole="teacher"
      />

      {/* Main Content */}
      <main className="pt-16 pb-20 lg:pb-8">
        <div className="max-w-[1400px] mx-auto px-4 sm:px-6 lg:px-8">
          {/* Welcome Section */}
          <div className="my-8">
            <div className="bg-gradient-to-r from-primary/10 to-secondary/10 rounded-lg p-4 border border-primary/20">
              <div className="flex items-center justify-between">
                <div>
                  <h1 className="text-2xl lg:text-3xl font-bold text-foreground mb-2">
                    {getGreeting()},{" "}
                    <span className="capitalize">{authUser.name}</span>! 👋
                  </h1>
                  <div className="text-muted-foreground mb-1">
                    {TodayDate()}
                  </div>
                </div>
              </div>
            </div>
          </div>

          {/* Metrics Cards */}
          <div className="grid grid-cols-1 md:grid-cols-2 xl:grid-cols-4 gap-6 mb-8">
            {metricsLoading
              ? Array.from({ length: 4 }).map((_, index) => (
                  <div
                    key={index}
                    className="bg-card border border-border rounded-lg p-6 shadow-soft animate-pulse"
                  >
                    <div className="flex items-start justify-between">
                      <div className="flex-1">
                        <div className="h-4 bg-muted rounded w-24 mb-2"></div>
                        <div className="h-8 bg-muted rounded w-16 mb-2"></div>
                        <div className="h-3 bg-muted rounded w-32"></div>
                      </div>
                      <div className="w-12 h-12 bg-muted rounded-lg"></div>
                    </div>
                  </div>
                ))
              : metricsData?.map((metric, index) => (
                  <MetricsCard
                    key={index}
                    title={metric?.title}
                    value={metric?.value}
                    subtitle={metric?.subtitle}
                    icon={metric?.icon}
                    trend={metric?.trend}
                    trendValue={metric?.trendValue}
                    color={metric?.color}
                  />
                ))}
          </div>

          <div className="grid grid-cols-1 lg:grid-cols-3 gap-6 mb-8">
            <div className="lg:col-span-2">
              {loading ? (
                <Loader />
              ) : error ? (
                <div className="bg-card rounded-lg border border-destructive/50 p-8 text-center">
                  <p className="text-destructive mb-2">
                    Failed to load schedule
                  </p>
                  <p className="text-sm text-muted-foreground">{error}</p>
                </div>
              ) : (
                <TodaySchedule
                  sessions={todaySessions}
                  onJoinSession={handleJoinSession}
                  onViewAllSchedules={handleViewAllSchedules}
                  onMessage={handleMessages}
                  onCompleteSession={handleCompleteSession}
                />
              )}
            </div>
            <div className="lg:col-span-1">
              <AvailabilityCalendar
                availability={availability}
                onUpdateAvailability={setAvailability}
              />
            </div>
          </div>

          <StudentFeedback
            feedbacks={studentFeedbacks}
            onViewAllFeedback={handleViewAllFeedback}
          />
        </div>
      </main>
    </div>
  );
};

export default TeacherDashboard;
