import React, { useState, useEffect } from "react";
import { useNavigate } from "react-router-dom";
import { useSelector, useDispatch } from "react-redux";
import RoleBasedHeader from "../../../components/ui/RoleBasedHeader";
import NotificationCenter from "../../../components/ui/NotificationCenter";
import UpcomingSessionsCard from "./components/UpcomingSessionsCard";
import ProgressTrackingSection from "./components/ProgressTrackingSection";
import ScheduleWidget from "./components/ScheduleWidget";
import MobileBottomNavigation from "./components/MobileBottomNavigation";
import Button from "../../../components/ui/Button";
import { selectAuthUser } from "reducers/auth/authSelectors";
import { selectStudent } from "reducers/profile/profileSlice";

const StudentDashboard = () => {
  const [showNotifications, setShowNotifications] = useState(false);
  const [currentTime, setCurrentTime] = useState(new Date());
  const navigate = useNavigate();
  const dispatch = useDispatch();
  const authUser = useSelector(selectAuthUser);
  const selectedChildId = useSelector((state) => state.profile.selectedChildId);
  // Automatically select the first child when dashboard loads for parent users
  useEffect(() => {
    if (
      authUser?.role === "parent" &&
      authUser?.profile?.children?.length > 0
    ) {
      // Only set if no child is currently selected
      if (!selectedChildId) {
        const firstChildId =
          authUser.profile.children[0]._id || authUser.profile.children[0].id;
        dispatch(selectStudent(firstChildId));
      }
    }
  }, [authUser, selectedChildId, dispatch]);

  useEffect(() => {
    // Update current time every minute
    const timer = setInterval(() => {
      setCurrentTime(new Date());
    }, 60000);

    return () => clearInterval(timer);
  }, []);

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

  const getGreeting = () => {
    const hour = currentTime.getHours();
    if (hour < 12) return "Good morning";
    if (hour < 17) return "Good afternoon";
    return "Good evening";
  };

  const handleEmergencyHelp = () => {
    // Mock emergency help action
    console.log("Emergency help requested");
  };

  return (
    <div className="min-h-screen bg-background">
      {/* Header */}
      <RoleBasedHeader />

      {/* Notification Center */}
      <NotificationCenter
        isOpen={showNotifications}
        onClose={() => setShowNotifications(false)}
        userRole="student"
      />

      {/* Main Content */}
      <main className="pt-16 pb-20 lg:pb-8">
        <div className="max-w-[1400px] mx-auto px-4 sm:px-6 lg:px-8">
          {/* Welcome Section */}
          <div className="my-8">
            <div className="bg-gradient-to-r from-primary/10 to-secondary/10 rounded-lg p-6 border border-primary/20">
              <div className="flex items-center justify-between">
                <div>
                  <h1 className="text-2xl lg:text-3xl font-bold text-foreground mb-2">
                    {getGreeting()},{" "}
                    <span className="capitalize">{authUser.name}</span>! 👋
                  </h1>
                  <div className="text-muted-foreground mb-4">
                    {TodayDate()}
                  </div>
                  <p className="text-muted-foreground mb-4">
                    Ready to continue your learning journey?
                  </p>
                </div>
              </div>
            </div>
          </div>

          {/* Desktop Layout */}
          <div className="hidden lg:grid lg:grid-cols-12 lg:gap-8">
            {/* Left Column */}
            <div className="lg:col-span-8 space-y-8">
              {/* Upcoming Sessions */}
              <UpcomingSessionsCard />
            </div>

            {/* Right Column */}
            <div className="lg:col-span-4 space-y-8">
              {/* Progress Tracking */}
              <ProgressTrackingSection />

              {/* Schedule Widget */}
            </div>
            <div className="lg:col-span-12 space-y-8">
              <ScheduleWidget />
            </div>
          </div>

          {/* Mobile Layout */}
          <div className="lg:hidden space-y-6">
            {/* Upcoming Sessions */}
            <UpcomingSessionsCard />

            {/* Schedule Widget */}
            <ScheduleWidget />

            {/* Progress Tracking */}
            <ProgressTrackingSection />
          </div>

          {/* Floating Action Button (Mobile) */}
          <div className="fixed bottom-24 right-4 lg:hidden z-50">
            <Button
              variant="default"
              size="icon"
              iconName="Plus"
              iconSize={24}
              onClick={() => navigate("/booking-system")}
              className="w-14 h-14 rounded-full shadow-modal"
            ></Button>
          </div>

          {/* Emergency Help (Mobile) */}
          <div className="fixed bottom-24 left-4 lg:hidden z-50">
            <Button
              variant="outline"
              size="icon"
              iconName="HelpCircle"
              iconSize={20}
              onClick={handleEmergencyHelp}
              className="w-12 h-12 rounded-full shadow-modal bg-card"
            ></Button>
          </div>
        </div>
      </main>

      {/* Mobile Bottom Navigation */}
      <MobileBottomNavigation />
    </div>
  );
};

export default StudentDashboard;
