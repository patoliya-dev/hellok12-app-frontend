import RoleBasedHeader from "components/ui/RoleBasedHeader";
import React, { useState } from "react";
import { cardData } from "./data";
import Card from "./components/Card";
import UpcomingLessonCard from "./components/UpcomingLessonCard";
import QuickAction from "./components/QuickAction";
import PageHeader from "components/ui/PageHeader";
import InviteTeacherModal from "../manage-teachers/components/InviteTeacherModal";

const SchoolDashboard = () => {
  const [showInviteModal, setShowInviteModal] = useState(false);

  const handleInviteModalOpen = () => {
    setShowInviteModal(!showInviteModal);
  };

  const handleInviteTeacher = (inviteData) => {
    const newTeacher = {
      id: 100,
      name: inviteData?.name,
      email: inviteData?.email,
      phone: "",
      address: "",
      avatar:
        "https://images.unsplash.com/photo-1472099645785-5658abf4ff4e?w=150&h=150&fit=crop&crop=face",
      status: inviteData?.setAsActive ? "active" : "pending",
      languages: inviteData?.languages,
      location: "Location TBD",
      experience: 0,
      isOnline: false,
      travelDistance: 10,
      hourlyRate: 35,
      availability: {
        onsite: false,
        online: false,
      },
      bio: "New teacher - profile setup pending",
      stats: {
        totalLessons: 0,
        totalStudents: 0,
        rating: 0,
        totalEarnings: 0,
      },
      joinedDate: new Date()?.toISOString()?.split("T")?.[0],
    };
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
            {/* Upcoming Lessons */}
            <UpcomingLessonCard />
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
