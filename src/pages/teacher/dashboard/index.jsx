import React, { useEffect, useState } from "react";
import { useSelector } from "react-redux";
import { useNavigate } from "react-router-dom";
import { selectAuthUser } from "features/auth/authSelectors";
import RoleBasedHeader from "components/ui/RoleBasedHeader";
import NotificationCenter from "components/ui/NotificationCenter";
import MetricsCard from "./components/MetricsCard";
import TodaySchedule from "./components/TodaySchedule";
import AvailabilityCalendar from "./components/AvailabilityCalendar";
import StudentFeedback from "./components/StudentFeedback";

const metricsData = [
  {
    title: "Upcoming Sessions",
    value: "12",
    subtitle: "This week",
    icon: "Calendar",
    trend: "up",
    trendValue: "+3 from last week",
    color: "primary",
  },
  {
    title: "Trial Bookings",
    value: "5",
    subtitle: "Pending approval",
    icon: "Clock",
    trend: "up",
    trendValue: "+2 new requests",
    color: "warning",
  },
  {
    title: "Average Rating",
    value: "4.8",
    subtitle: "Based on 47 reviews",
    icon: "Star",
    trend: "up",
    trendValue: "+0.2 this month",
    color: "success",
  },
  {
    title: "Monthly Earnings",
    value: "$2,450",
    subtitle: "January 2025",
    icon: "DollarSign",
    trend: "up",
    trendValue: "+15% from last month",
    color: "accent",
  },
];

const TeacherDashboard = () => {
  const [currentTime, setCurrentTime] = useState(new Date());
  const [showNotifications, setShowNotifications] = useState(false);
  const authUser = useSelector(selectAuthUser);
  const navigate = useNavigate();

  // Mock today's sessions
  const [todaySessions] = useState([
    {
      id: "session-001",
      student: {
        id: "student-001",
        name: "Emma Wilson",
        avatar:
          "https://images.unsplash.com/photo-1544005313-94ddf0286df2?w=400&h=400&fit=crop&crop=face",
      },
      subject: "English Literature",
      startTime: new Date(Date.now() + 10 * 60 * 1000), // 10 minutes from now
      duration: 60,
      type: "Video Call",
      earnings: 45,
      meetingLink: "https://meet.google.com/abc-defg-hij",
    },
    {
      id: "session-002",
      student: {
        id: "student-002",
        name: "Alex Chen",
        avatar:
          "https://images.unsplash.com/photo-1507003211169-0a1dd7228f2d?w=400&h=400&fit=crop&crop=face",
      },
      subject: "Creative Writing",
      startTime: new Date(Date.now() + 3 * 60 * 60 * 1000), // 3 hours from now
      duration: 45,
      type: "Video Call",
      earnings: 38,
    },
    {
      id: "session-003",
      student: {
        id: "student-003",
        name: "Sophia Martinez",
        avatar:
          "https://images.unsplash.com/photo-1438761681033-6461ffad8d80?w=400&h=400&fit=crop&crop=face",
      },
      subject: "English Literature",
      startTime: new Date(Date.now() - 2 * 60 * 60 * 1000), // 2 hours ago (completed)
      duration: 60,
      type: "Video Call",
      earnings: 45,
    },
  ]);

  // Mock availability data
  const [availability, setAvailability] = useState({
    mon: ["09:00", "10:00", "14:00", "15:00", "16:00"],
    tue: ["09:00", "10:00", "11:00", "14:00", "15:00"],
    wed: ["10:00", "11:00", "14:00", "15:00", "16:00"],
    thu: ["09:00", "10:00", "14:00", "15:00"],
    fri: ["09:00", "10:00", "11:00", "14:00"],
    sat: ["10:00", "11:00"],
    sun: [],
  });

  // Mock student feedback
  const [studentFeedbacks] = useState([
    {
      id: "feedback-001",
      student: {
        id: "student-001",
        name: "Emma Wilson",
        avatar:
          "https://images.unsplash.com/photo-1544005313-94ddf0286df2?w=400&h=400&fit=crop&crop=face",
      },
      subject: "English Literature",
      rating: 5,
      comment: `Ms. Johnson is an amazing teacher! She helped me understand Shakespeare in a way that finally makes sense. Her explanations are clear and she's very patient with questions.`,
      date: "2024-12-14",
      sessionDate: "December 14, 2024",
      tags: ["Patient", "Clear Explanations", "Knowledgeable"],
      parentFeedback: true,
    },
    {
      id: "feedback-002",
      student: {
        id: "student-002",
        name: "Alex Chen",
        avatar:
          "https://images.unsplash.com/photo-1507003211169-0a1dd7228f2d?w=400&h=400&fit=crop&crop=face",
      },
      subject: "Creative Writing",
      rating: 3,
      comment: `The creative writing session was fantastic! Ms. Johnson gave me great feedback on my story and helped me develop my characters better. I feel much more confident now.`,
      date: "2024-12-13",
      sessionDate: "December 13, 2024",
      tags: ["Creative", "Encouraging", "Detailed Feedback"],
    },
  ]);

  useEffect(() => {
    // Update current time every minute
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
      weekday: "long", // Thursday
      year: "numeric", // 2025
      month: "long", // July
      day: "numeric", // 31
      hour: "numeric", // 5
      minute: "2-digit", // 42
      hour12: true, // AM/PM
    });

    return <div>{formattedDate}</div>;
  };

  const handleJoinSession = (session) => {
    if (session.meetingLink) {
      window.open(session.meetingLink, "_blank");
    }
  };

  const handleCancelSession = (session) => {
    alert("Session canceled successfully!");
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
            {metricsData?.map((metric, index) => (
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
              <TodaySchedule
                sessions={todaySessions}
                onJoinSession={handleJoinSession}
                onCancelSession={handleCancelSession}
                onViewAllSchedules={handleViewAllSchedules}
                onMessage={handleMessages}
              />
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
