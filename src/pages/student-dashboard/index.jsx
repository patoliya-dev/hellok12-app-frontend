import React, { useState, useEffect } from 'react';
import { Helmet } from 'react-helmet';
import GlobalNavigationHeader from '../../components/ui/GlobalNavigationHeader';
import RoleBasedSidebar from '../../components/ui/RoleBasedSidebar';
import NotificationPanel from '../../components/ui/NotificationPanel';
import UpcomingSessionsWidget from './components/UpcomingSessionsWidget';
import AssignmentsDueWidget from './components/AssignmentsDueWidget';
import RecentGradesWidget from './components/RecentGradesWidget';
import AnnouncementsWidget from './components/AnnouncementsWidget';
import QuickActionsWidget from './components/QuickActionsWidget';
import NotificationsPanelWidget from './components/NotificationsPanelWidget';
import Icon from '../../components/AppIcon';
import Button from '../../components/ui/Button';

const StudentDashboard = () => {
  const [sidebarCollapsed, setSidebarCollapsed] = useState(false);
  const [notificationPanelOpen, setNotificationPanelOpen] = useState(false);
  const [currentLanguage, setCurrentLanguage] = useState('en');
  const [greeting, setGreeting] = useState('');

  // Mock student data
  const studentData = {
    name: "Alex Johnson",
    studentId: "STU2025001",
    grade: "Grade 11",
    section: "A",
    avatar: "https://images.unsplash.com/photo-1507003211169-0a1dd7228f2d?w=150&h=150&fit=crop&crop=face",
    currentGPA: "3.85",
    totalCredits: 24,
    completedCredits: 18
  };

  // Set greeting based on time of day
  useEffect(() => {
    const hour = new Date().getHours();
    if (hour < 12) {
      setGreeting('Good Morning');
    } else if (hour < 17) {
      setGreeting('Good Afternoon');
    } else {
      setGreeting('Good Evening');
    }

    // Check for saved language preference
    const savedLanguage = localStorage.getItem('preferredLanguage') || 'en';
    setCurrentLanguage(savedLanguage);
  }, []);

  const toggleSidebar = () => {
    setSidebarCollapsed(!sidebarCollapsed);
  };

  const toggleNotificationPanel = () => {
    setNotificationPanelOpen(!notificationPanelOpen);
  };

  return (
    <>
      <Helmet>
        <title>Student Dashboard - EduPortal</title>
        <meta name="description" content="Access your academic information, assignments, grades, and school resources from your personalized student dashboard." />
        <meta name="keywords" content="student dashboard, academics, assignments, grades, school portal" />
      </Helmet>

      <div className="min-h-screen bg-background">
        {/* Global Navigation Header */}
        <GlobalNavigationHeader 
          userRole="student"
          userName={studentData.name}
          notificationCount={5}
        />

        {/* Role-based Sidebar */}
        <RoleBasedSidebar 
          userRole="student"
          isCollapsed={sidebarCollapsed}
          onToggle={toggleSidebar}
        />

        {/* Notification Panel */}
        <NotificationPanel 
          isOpen={notificationPanelOpen}
          onClose={toggleNotificationPanel}
          userRole="student"
        />

        {/* Main Content */}
        <main className={`
          pt-16 transition-all duration-300 ease-smooth min-h-screen
          ${sidebarCollapsed ? 'lg:ml-16' : 'lg:ml-72'}
          ${notificationPanelOpen ? 'lg:mr-80' : ''}
        `}>
          <div className="p-4 sm:p-6 lg:p-8 max-w-7xl mx-auto">
            {/* Welcome Section */}
            <div className="mb-8">
              <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between mb-6">
                <div className="flex items-center space-x-4 mb-4 sm:mb-0">
                  <div className="w-16 h-16 rounded-full overflow-hidden border-2 border-primary/20">
                    <img 
                      src={studentData.avatar} 
                      alt={studentData.name}
                      className="w-full h-full object-cover"
                      onError={(e) => {
                        e.target.src = '/assets/images/no_image.png';
                      }}
                    />
                  </div>
                  <div>
                    <h1 className="text-2xl font-bold text-foreground">
                      {greeting}, {studentData.name}!
                    </h1>
                    <p className="text-muted-foreground">
                      {studentData.grade} • Section {studentData.section} • ID: {studentData.studentId}
                    </p>
                  </div>
                </div>

                <div className="flex items-center space-x-4">
                  <div className="text-right">
                    <p className="text-sm text-muted-foreground">Current GPA</p>
                    <p className="text-xl font-semibold text-success">{studentData.currentGPA}</p>
                  </div>
                  <div className="text-right">
                    <p className="text-sm text-muted-foreground">Credits</p>
                    <p className="text-xl font-semibold text-primary">
                      {studentData.completedCredits}/{studentData.totalCredits}
                    </p>
                  </div>
                </div>
              </div>

              {/* Quick Stats */}
              <div className="grid grid-cols-2 sm:grid-cols-4 gap-4 mb-6">
                <div className="bg-card rounded-lg border border-border p-4 text-center">
                  <div className="w-8 h-8 bg-primary/10 rounded-lg flex items-center justify-center mx-auto mb-2">
                    <Icon name="Calendar" size={16} color="var(--color-primary)" />
                  </div>
                  <p className="text-2xl font-bold text-foreground">4</p>
                  <p className="text-sm text-muted-foreground">Classes Today</p>
                </div>
                <div className="bg-card rounded-lg border border-border p-4 text-center">
                  <div className="w-8 h-8 bg-warning/10 rounded-lg flex items-center justify-center mx-auto mb-2">
                    <Icon name="FileText" size={16} color="var(--color-warning)" />
                  </div>
                  <p className="text-2xl font-bold text-foreground">3</p>
                  <p className="text-sm text-muted-foreground">Due Soon</p>
                </div>
                <div className="bg-card rounded-lg border border-border p-4 text-center">
                  <div className="w-8 h-8 bg-success/10 rounded-lg flex items-center justify-center mx-auto mb-2">
                    <Icon name="Award" size={16} color="var(--color-success)" />
                  </div>
                  <p className="text-2xl font-bold text-foreground">2</p>
                  <p className="text-sm text-muted-foreground">New Grades</p>
                </div>
                <div className="bg-card rounded-lg border border-border p-4 text-center">
                  <div className="w-8 h-8 bg-accent/10 rounded-lg flex items-center justify-center mx-auto mb-2">
                    <Icon name="Bell" size={16} color="var(--color-accent)" />
                  </div>
                  <p className="text-2xl font-bold text-foreground">5</p>
                  <p className="text-sm text-muted-foreground">Notifications</p>
                </div>
              </div>
            </div>

            {/* Dashboard Widgets Grid */}
            <div className="grid grid-cols-1 lg:grid-cols-2 xl:grid-cols-3 gap-6 mb-8">
              {/* Upcoming Sessions - Full width on mobile, spans 2 columns on xl */}
              <div className="lg:col-span-2 xl:col-span-2">
                <UpcomingSessionsWidget />
              </div>

              {/* Quick Actions */}
              <div className="xl:col-span-1">
                <QuickActionsWidget />
              </div>

              {/* Assignments Due */}
              <div className="lg:col-span-1">
                <AssignmentsDueWidget />
              </div>

              {/* Recent Grades */}
              <div className="lg:col-span-1">
                <RecentGradesWidget />
              </div>

              {/* Notifications Panel Widget */}
              <div className="lg:col-span-1">
                <NotificationsPanelWidget />
              </div>

              {/* Announcements - Full width */}
              <div className="lg:col-span-2 xl:col-span-3">
                <AnnouncementsWidget />
              </div>
            </div>

            {/* Additional Actions */}
            <div className="bg-card rounded-lg border border-border shadow-subtle p-6">
              <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between">
                <div className="mb-4 sm:mb-0">
                  <h3 className="text-lg font-semibold text-foreground mb-2">Need Help?</h3>
                  <p className="text-sm text-muted-foreground">
                    Access support resources, contact your teachers, or get technical assistance.
                  </p>
                </div>
                <div className="flex flex-col sm:flex-row space-y-2 sm:space-y-0 sm:space-x-3">
                  <Button variant="outline" iconName="HelpCircle" iconPosition="left">
                    Help Center
                  </Button>
                  <Button variant="outline" iconName="MessageSquare" iconPosition="left">
                    Contact Support
                  </Button>
                  <Button variant="default" iconName="Phone" iconPosition="left">
                    Emergency Contact
                  </Button>
                </div>
              </div>
            </div>
          </div>
        </main>

        {/* Mobile Navigation Toggle */}
        <button
          onClick={toggleSidebar}
          className="fixed bottom-6 left-6 lg:hidden w-14 h-14 bg-primary text-primary-foreground rounded-full shadow-modal flex items-center justify-center z-40"
        >
          <Icon name="Menu" size={24} />
        </button>

        {/* Mobile Notification Toggle */}
        <button
          onClick={toggleNotificationPanel}
          className="fixed bottom-6 right-20 lg:hidden w-12 h-12 bg-surface border border-border text-foreground rounded-full shadow-elevated flex items-center justify-center z-40"
        >
          <Icon name="Bell" size={20} />
          <span className="absolute -top-1 -right-1 w-5 h-5 bg-error text-white text-xs rounded-full flex items-center justify-center">
            5
          </span>
        </button>
      </div>
    </>
  );
};

export default StudentDashboard;