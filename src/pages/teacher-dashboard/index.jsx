import React, { useState } from 'react';
import GlobalNavigationHeader from '../../components/ui/GlobalNavigationHeader';
import RoleBasedSidebar from '../../components/ui/RoleBasedSidebar';
import Icon from '../../components/AppIcon';
import OverviewTab from './components/OverviewTab';
import StudentManagementTab from './components/StudentManagementTab';
import AssignmentTrackingTab from './components/AssignmentTrackingTab';

const TeacherDashboard = () => {
  const [activeTab, setActiveTab] = useState('overview');
  const [sidebarCollapsed, setSidebarCollapsed] = useState(false);

  const tabs = [
    {
      id: 'overview',
      label: 'Overview',
      icon: 'LayoutDashboard',
      component: OverviewTab
    },
    {
      id: 'students',
      label: 'Student Management',
      icon: 'Users',
      component: StudentManagementTab
    },
    {
      id: 'assignments',
      label: 'Assignment Tracking',
      icon: 'FileText',
      component: AssignmentTrackingTab
    }
  ];

  const ActiveComponent = tabs.find(tab => tab.id === activeTab)?.component || OverviewTab;

  const teacherStats = [
    {
      label: 'Total Students',
      value: '78',
      change: '+5',
      changeType: 'positive',
      icon: 'Users'
    },
    {
      label: 'Active Classes',
      value: '3',
      change: '0',
      changeType: 'neutral',
      icon: 'BookOpen'
    },
    {
      label: 'Pending Grades',
      value: '24',
      change: '-8',
      changeType: 'positive',
      icon: 'Award'
    },
    {
      label: 'This Week\'s Classes',
      value: '15',
      change: '+2',
      changeType: 'positive',
      icon: 'Calendar'
    }
  ];

  const getChangeColor = (type) => {
    switch (type) {
      case 'positive':
        return 'text-success';
      case 'negative':
        return 'text-error';
      default:
        return 'text-muted-foreground';
    }
  };

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
              <div className="flex items-center space-x-3">
                <button className="lg:hidden p-2 text-muted-foreground hover:text-foreground hover:bg-muted rounded-lg transition-smooth">
                  <Icon name="Menu" size={20} />
                </button>
                <button className="flex items-center space-x-2 px-4 py-2 bg-primary text-primary-foreground rounded-lg hover:bg-primary/90 transition-smooth">
                  <Icon name="Plus" size={16} />
                  <span className="hidden sm:inline">Quick Action</span>
                </button>
              </div>
            </div>

            {/* Stats Cards */}
            <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-6 mb-8">
              {teacherStats.map((stat, index) => (
                <div key={index} className="bg-card rounded-lg border border-border p-6 shadow-subtle">
                  <div className="flex items-center justify-between">
                    <div>
                      <p className="text-sm text-muted-foreground">{stat.label}</p>
                      <p className="text-2xl font-bold text-foreground mt-1">{stat.value}</p>
                      {stat.change !== '0' && (
                        <div className="flex items-center mt-2">
                          <Icon 
                            name={stat.changeType === 'positive' ? 'TrendingUp' : 'TrendingDown'} 
                            size={14} 
                            className={getChangeColor(stat.changeType)}
                          />
                          <span className={`text-sm ml-1 ${getChangeColor(stat.changeType)}`}>
                            {stat.change}
                          </span>
                          <span className="text-sm text-muted-foreground ml-1">this week</span>
                        </div>
                      )}
                    </div>
                    <div className="w-12 h-12 bg-primary/10 rounded-lg flex items-center justify-center">
                      <Icon name={stat.icon} size={24} color="var(--color-primary)" />
                    </div>
                  </div>
                </div>
              ))}
            </div>
          </div>

          {/* Tab Navigation */}
          <div className="mb-6">
            <div className="border-b border-border">
              <nav className="flex space-x-8">
                {tabs.map((tab) => (
                  <button
                    key={tab.id}
                    onClick={() => setActiveTab(tab.id)}
                    className={`
                      flex items-center space-x-2 py-4 px-1 border-b-2 font-medium text-sm transition-smooth
                      ${activeTab === tab.id
                        ? 'border-primary text-primary' :'border-transparent text-muted-foreground hover:text-foreground hover:border-muted'
                      }
                    `}
                  >
                    <Icon name={tab.icon} size={16} />
                    <span>{tab.label}</span>
                  </button>
                ))}
              </nav>
            </div>
          </div>

          {/* Tab Content */}
          <div className="min-h-[600px]">
            <ActiveComponent />
          </div>
        </div>
      </main>
    </div>
  );
};

export default TeacherDashboard;