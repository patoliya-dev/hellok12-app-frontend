import RoleBasedHeader from "components/ui/RoleBasedHeader";
import React, { useState } from "react";
import { cardData } from "./data";
import Card from "./components/Card";
import UpcomingLessonCard from "./components/UpcomingLessonCard";
import QuickAction from "./components/QuickAction";
import PageHeader from "components/ui/PageHeader";
import InviteTeacherModal from "../manage-teachers/components/InviteTeacherModal";
import TodaySchedule from "../../../pages/teacher/dashboard/components/TodaySchedule";
import { useNavigate } from "react-router-dom";

const SchoolDashboard = () => {
  const navigate = useNavigate();
  const [showInviteModal, setShowInviteModal] = useState(false);
  const [todaySessions, setTodaySessions] = useState([]);

  const handleInviteModalOpen = () => {
    setShowInviteModal(!showInviteModal);
  };

  const handleJoinSession = (session) => {
    if (session.joinUrl) {
      window.open(session.joinUrl, "_blank");
    }
  };

  const handleCancelSession = (session) => {
    alert("Session canceled successfully!");
  };

  const handleViewAllSchedules = () => {
    navigate("/school/lessons");
  };

  const handleMessages = () => {
    navigate("/school/messages");
  };

  return (
    <div className="min-h-screen bg-background">
      {/* Header */}
      <RoleBasedHeader />

      {/* Main Content */}
      <main className="max-w-[1400px] mx-auto px-4 sm:px-6 lg:px-8 pt-16 pb-20 lg:pb-8">
        <PageHeader
          title="Dashboard Overview"
          description={
            "Welcome back! Here's what's happening at your school today."
          }
          isButton
          iconName="RefreshCw"
          buttonTitle="Refresh"
          onButtonClick={() => window.location.reload()}
        />
        <section className="mb-8">
          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-4">
            {cardData?.map((card, idx) => (
              <Card key={idx} cardData={card} />
            ))}
          </div>
        </section>
        {/*Desktop View*/}
        <section className="mb-8 hidden lg:grid lg:grid-cols-12 lg:gap-8">
          <div className="lg:col-span-8 space-y-8">
            {/* Today's Lessons */}
            <TodaySchedule
              sessions={todaySessions}
              onJoinSession={handleJoinSession}
              onCancelSession={handleCancelSession}
              onViewAllSchedules={handleViewAllSchedules}
              onMessage={handleMessages}
            />
          </div>
          {/* Right Column */}
          <div className="lg:col-span-4 space-y-8">
            <QuickAction onInviteTeacher={handleInviteModalOpen} />
          </div>
        </section>
        {/*Mobile View*/}
        <section className="lg:hidden space-y-6">
          {/* Upcoming Lessons */}
          <UpcomingLessonCard />
          {/* Quick Actions */}
          <QuickAction onInviteTeacher={handleInviteModalOpen} />
        </section>
      </main>

      <InviteTeacherModal
        isOpen={showInviteModal}
        onClose={handleInviteModalOpen}
      />
    </div>
  );
};

export default SchoolDashboard;
