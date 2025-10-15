import Button from "components/ui/Button";
import NotificationCenter from "components/ui/NotificationCenter";
import RoleBasedHeader from "components/ui/RoleBasedHeader";
import React, { useState } from "react";
import { cardData } from "./data";
import Card from "./components/Card";
import UpcomingLessonCard from "./components/UpcomingLessonCard";
import QuickAction from "./components/QuickAction";

const SchoolDashboard = () => {
  const [showNotifications, setShowNotifications] = useState(false);
  return (
    <div className="min-h-screen bg-background">
      {/* Header */}
      <RoleBasedHeader />

      {/* Notification Center */}
      <NotificationCenter
        isOpen={showNotifications}
        onClose={() => setShowNotifications(false)}
        userRole="admin"
      />

      {/* Main Content */}
      <main className="max-w-[1400px] mx-auto px-4 sm:px-6 lg:px-8 pt-16 pb-20 lg:pb-8">
        <section className="my-8">
          <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-4 sm:gap-0mb-6">
            <div>
              <h1 className="text-h3 font-bold text-foreground mb-2">
                Dashboard Overview
              </h1>
              <p className="text-brand-gray-500">
                Welcome back! Here's what's happening at your school today.
              </p>
            </div>
            <Button
              iconName="RefreshCw"
              onClick={() => window.location.reload()}
            >
              Refresh
            </Button>
          </div>
        </section>
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
            <QuickAction />
          </div>
        </section>
        {/*Mobile View*/}
        <section className="lg:hidden space-y-6">
          {/* Upcoming Lessons */}
          <UpcomingLessonCard />
          {/* Quick Actions */}
          <QuickAction />
        </section>
      </main>
    </div>
  );
};

export default SchoolDashboard;
