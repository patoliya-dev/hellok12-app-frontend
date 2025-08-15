import React, { useState, useEffect } from 'react';
import GlobalNavigationHeader from '../../components/ui/GlobalNavigationHeader';
import RoleBasedSidebar from '../../components/ui/RoleBasedSidebar';
import NotificationPanel from '../../components/ui/NotificationPanel';
import ChildSelector from './components/ChildSelector';
import AcademicSummaryCard from './components/AcademicSummaryCard';
import RecentAssignments from './components/RecentAssignments';
import GradeTrendsChart from './components/GradeTrendsChart';
import TeacherFeedback from './components/TeacherFeedback';
import CommunicationCenter from './components/CommunicationCenter';
import FeePaymentShortcuts from './components/FeePaymentShortcuts';
import QuickActionsToolbar from './components/QuickActionsToolbar';

const ParentDashboard = () => {
  const [selectedChild, setSelectedChild] = useState(1);
  const [sidebarCollapsed, setSidebarCollapsed] = useState(false);
  const [notificationPanelOpen, setNotificationPanelOpen] = useState(false);
  const [currentLanguage, setCurrentLanguage] = useState('en');

  useEffect(() => {
    // Check localStorage for saved language preference
    const savedLanguage = localStorage.getItem('selectedLanguage');
    if (savedLanguage) {
      setCurrentLanguage(savedLanguage);
    }
  }, []);

  const handleChildChange = (childId) => {
    setSelectedChild(childId);
  };

  const toggleSidebar = () => {
    setSidebarCollapsed(!sidebarCollapsed);
  };

  const toggleNotificationPanel = () => {
    setNotificationPanelOpen(!notificationPanelOpen);
  };

  // Academic summary data
  const academicSummaryData = [
    {
      title: "Overall Grade",
      value: "A-",
      subtitle: "92.5% Average",
      icon: "Award",
      trend: 3.2,
      color: "success"
    },
    {
      title: "Attendance Rate",
      value: "96%",
      subtitle: "18 of 19 days",
      icon: "Calendar",
      trend: 1.5,
      color: "primary"
    },
    {
      title: "Assignments",
      value: "12/15",
      subtitle: "3 pending",
      icon: "FileText",
      trend: -2.1,
      color: "warning"
    },
    {
      title: "Upcoming Events",
      value: "4",
      subtitle: "This week",
      icon: "Clock",
      color: "accent"
    }
  ];

  return (
    <div className="min-h-screen bg-background">
      {/* Global Navigation Header */}
      <GlobalNavigationHeader 
        userRole="parent" 
        userName="Sarah Johnson"
        notificationCount={5}
      />

      {/* Role-based Sidebar */}
      <RoleBasedSidebar 
        userRole="parent"
        isCollapsed={sidebarCollapsed}
        onToggle={toggleSidebar}
      />

      {/* Notification Panel */}
      <NotificationPanel 
        isOpen={notificationPanelOpen}
        onClose={toggleNotificationPanel}
        userRole="parent"
      />

      {/* Main Content */}
      <main className={`
        pt-16 transition-all duration-300 ease-smooth min-h-screen
        ${sidebarCollapsed ? 'lg:pl-16' : 'lg:pl-72'}
      `}>
        <div className="max-w-full px-4 sm:px-6 lg:px-8 py-8">
          {/* Page Header */}
          <div className="mb-8">
            <h1 className="text-3xl font-bold text-foreground mb-2">Parent Dashboard</h1>
            <p className="text-muted-foreground">
              Monitor your children's academic progress and stay connected with their school
            </p>
          </div>

          {/* Main Dashboard Grid */}
          <div className="grid grid-cols-1 xl:grid-cols-12 gap-8">
            {/* Left Column - Child Selector & Academic Summary */}
            <div className="xl:col-span-3 space-y-6">
              {/* Child Selector */}
              <ChildSelector 
                selectedChild={selectedChild}
                onChildChange={handleChildChange}
              />

              {/* Academic Summary Cards */}
              <div className="space-y-4">
                <h2 className="text-lg font-semibold text-foreground">Academic Overview</h2>
                {academicSummaryData.map((data, index) => (
                  <AcademicSummaryCard
                    key={index}
                    title={data.title}
                    value={data.value}
                    subtitle={data.subtitle}
                    icon={data.icon}
                    trend={data.trend}
                    color={data.color}
                  />
                ))}
              </div>

              {/* Quick Actions Toolbar */}
              <QuickActionsToolbar />
            </div>

            {/* Center Column - Detailed Academic Information */}
            <div className="xl:col-span-6 space-y-6">
              {/* Recent Assignments */}
              <RecentAssignments />

              {/* Grade Trends Chart */}
              <GradeTrendsChart />

              {/* Teacher Feedback */}
              <TeacherFeedback />
            </div>

            {/* Right Column - Communication & Payments */}
            <div className="xl:col-span-3 space-y-6">
              {/* Communication Center */}
              <CommunicationCenter />

              {/* Fee Payment Shortcuts */}
              <FeePaymentShortcuts />
            </div>
          </div>

          {/* Mobile Responsive Stacked Layout */}
          <div className="xl:hidden mt-8 space-y-6">
            {/* Mobile view shows components in a single column */}
            <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
              {academicSummaryData.map((data, index) => (
                <AcademicSummaryCard
                  key={`mobile-${index}`}
                  title={data.title}
                  value={data.value}
                  subtitle={data.subtitle}
                  icon={data.icon}
                  trend={data.trend}
                  color={data.color}
                />
              ))}
            </div>
          </div>
        </div>
      </main>
    </div>
  );
};

export default ParentDashboard;