import React, { useState } from 'react';
import GlobalNavigationHeader from '../../components/ui/GlobalNavigationHeader';
import RoleBasedSidebar from '../../components/ui/RoleBasedSidebar';

const SchoolDashboard = () => {
  const [sidebarCollapsed, setSidebarCollapsed] = useState(false);

  return (
    <div className="min-h-screen bg-background">
      {/* Global Navigation Header */}
      <GlobalNavigationHeader
        userRole="teacher"
        userName="Sarah Johnson"
        notificationCount={5}
      />

      {/* Sidebar */}
      <RoleBasedSidebar
        userRole="teacher"
        isCollapsed={sidebarCollapsed}
        onToggle={() => setSidebarCollapsed(!sidebarCollapsed)}
      />

      {/* Main Content */}
      <main className={`
        pt-16 transition-all duration-300 ease-smooth
        ${sidebarCollapsed ? 'lg:ml-16' : 'lg:ml-72'}
      `}>
        <div className="p-6">
          {/* Page Header */}
          <div className="mb-8">
            <div className="flex items-center justify-between mb-6">
              <div>
                <h1 className="text-3xl font-bold text-foreground">Teacher Dashboard</h1>
                <p className="text-muted-foreground mt-1">
                  Welcome back, Sarah! Here's what's happening with your classes today.
                </p>
              </div>
            </div>
          </div>
        </div>
      </main>
    </div>
  );
};

export default SchoolDashboard;
