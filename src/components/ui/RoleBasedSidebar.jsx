import React, { useState } from 'react';
import { useLocation } from 'react-router-dom';
import Icon from '../AppIcon';

const RoleBasedSidebar = ({ userRole = 'student', isCollapsed = false, onToggle }) => {
  const location = useLocation();
  const [expandedSections, setExpandedSections] = useState({});

  const toggleSection = (sectionKey) => {
    setExpandedSections(prev => ({
      ...prev,
      [sectionKey]: !prev[sectionKey]
    }));
  };

  const isActive = (path) => {
    return location.pathname === path;
  };

  const getNavigationItems = () => {
    const commonItems = [
      {
        key: 'dashboard',
        label: 'Dashboard',
        icon: 'LayoutDashboard',
        path: `/${userRole}-dashboard`,
        active: isActive(`/${userRole}-dashboard`)
      }
    ];

    const roleSpecificItems = {
      student: [
        {
          key: 'courses',
          label: 'My Courses',
          icon: 'BookOpen',
          path: '/student/courses',
          active: isActive('/student/courses')
        },
        {
          key: 'assignments',
          label: 'Assignments',
          icon: 'FileText',
          path: '/student/assignments',
          active: isActive('/student/assignments'),
          badge: '3'
        },
        {
          key: 'grades',
          label: 'Grades',
          icon: 'Award',
          path: '/student/grades',
          active: isActive('/student/grades')
        },
        {
          key: 'schedule',
          label: 'Schedule',
          icon: 'Calendar',
          path: '/student/schedule',
          active: isActive('/student/schedule')
        },
        {
          key: 'resources',
          label: 'Resources',
          icon: 'Library',
          path: '/student/resources',
          active: isActive('/student/resources')
        }
      ],
      parent: [
        {
          key: 'children',
          label: 'My Children',
          icon: 'Users',
          path: '/parent/children',
          active: isActive('/parent/children')
        },
        {
          key: 'progress',
          label: 'Academic Progress',
          icon: 'TrendingUp',
          path: '/parent/progress',
          active: isActive('/parent/progress')
        },
        {
          key: 'communications',
          label: 'Communications',
          icon: 'MessageSquare',
          path: '/parent/communications',
          active: isActive('/parent/communications'),
          badge: '2'
        },
        {
          key: 'events',
          label: 'School Events',
          icon: 'Calendar',
          path: '/parent/events',
          active: isActive('/parent/events')
        },
        {
          key: 'payments',
          label: 'Payments',
          icon: 'CreditCard',
          path: '/parent/payments',
          active: isActive('/parent/payments')
        }
      ],
      teacher: [
        {
          key: 'classes',
          label: 'My Classes',
          icon: 'Users',
          path: '/teacher/classes',
          active: isActive('/teacher/classes')
        },
        {
          key: 'assignments',
          label: 'Assignments',
          icon: 'FileText',
          path: '/teacher/assignments',
          active: isActive('/teacher/assignments')
        },
        {
          key: 'gradebook',
          label: 'Gradebook',
          icon: 'BookOpen',
          path: '/teacher/gradebook',
          active: isActive('/teacher/gradebook')
        },
        {
          key: 'attendance',
          label: 'Attendance',
          icon: 'CheckSquare',
          path: '/teacher/attendance',
          active: isActive('/teacher/attendance')
        },
        {
          key: 'resources',
          label: 'Teaching Resources',
          icon: 'Library',
          path: '/teacher/resources',
          active: isActive('/teacher/resources')
        }
      ]
    };

    return [...commonItems, ...(roleSpecificItems[userRole] || [])];
  };

  const getQuickActions = () => {
    const quickActions = {
      student: [
        { label: 'Submit Assignment', icon: 'Upload', action: () => console.log('Submit assignment') },
        { label: 'Join Class', icon: 'Video', action: () => console.log('Join class') }
      ],
      parent: [
        { label: 'Message Teacher', icon: 'MessageSquare', action: () => console.log('Message teacher') },
        { label: 'Schedule Meeting', icon: 'Calendar', action: () => console.log('Schedule meeting') }
      ],
      teacher: [
        { label: 'Create Assignment', icon: 'Plus', action: () => console.log('Create assignment') },
        { label: 'Take Attendance', icon: 'CheckSquare', action: () => console.log('Take attendance') }
      ]
    };

    return quickActions[userRole] || [];
  };

  return (
    <>
      {/* Mobile Backdrop */}
      {!isCollapsed && (
        <div 
          className="fixed inset-0 bg-black/50 z-40 lg:hidden"
          onClick={onToggle}
        />
      )}

      {/* Sidebar */}
      <aside className={`
        fixed top-16 left-0 bottom-0 z-50 bg-surface border-r border-border shadow-subtle
        transform transition-transform duration-300 ease-smooth
        ${isCollapsed ? '-translate-x-full lg:translate-x-0' : 'translate-x-0'}
        ${isCollapsed ? 'lg:w-16' : 'w-80 lg:w-72'}
      `}>
        <div className="flex flex-col h-full">
          {/* Sidebar Header */}
          <div className="flex items-center justify-between p-4 border-b border-border">
            {!isCollapsed && (
              <h2 className="text-lg font-semibold text-foreground">Navigation</h2>
            )}
            <button
              onClick={onToggle}
              className="p-2 text-muted-foreground hover:text-foreground hover:bg-muted rounded-lg transition-smooth"
            >
              <Icon name={isCollapsed ? "ChevronRight" : "ChevronLeft"} size={16} />
            </button>
          </div>

          {/* Navigation Items */}
          <nav className="flex-1 overflow-y-auto p-4 space-y-2">
            {getNavigationItems().map((item) => (
              <a
                key={item.key}
                href={item.path}
                className={`
                  flex items-center space-x-3 px-3 py-2 rounded-lg transition-smooth
                  ${item.active 
                    ? 'bg-primary text-primary-foreground shadow-sm' 
                    : 'text-foreground hover:bg-muted hover:text-foreground'
                  }
                  ${isCollapsed ? 'justify-center' : ''}
                `}
              >
                <Icon name={item.icon} size={20} />
                {!isCollapsed && (
                  <>
                    <span className="flex-1 text-sm font-medium">{item.label}</span>
                    {item.badge && (
                      <span className="bg-accent text-accent-foreground text-xs px-2 py-1 rounded-full">
                        {item.badge}
                      </span>
                    )}
                  </>
                )}
              </a>
            ))}
          </nav>

          {/* Quick Actions */}
          {!isCollapsed && getQuickActions().length > 0 && (
            <div className="p-4 border-t border-border">
              <h3 className="text-sm font-medium text-muted-foreground mb-3">Quick Actions</h3>
              <div className="space-y-2">
                {getQuickActions().map((action, index) => (
                  <button
                    key={index}
                    onClick={action.action}
                    className="flex items-center space-x-3 w-full px-3 py-2 text-sm text-foreground hover:bg-muted rounded-lg transition-smooth"
                  >
                    <Icon name={action.icon} size={16} />
                    <span>{action.label}</span>
                  </button>
                ))}
              </div>
            </div>
          )}

          {/* Sidebar Footer */}
          <div className="p-4 border-t border-border">
            {isCollapsed ? (
              <button className="w-full p-2 text-muted-foreground hover:text-foreground hover:bg-muted rounded-lg transition-smooth">
                <Icon name="Settings" size={20} />
              </button>
            ) : (
              <button className="flex items-center space-x-3 w-full px-3 py-2 text-sm text-muted-foreground hover:text-foreground hover:bg-muted rounded-lg transition-smooth">
                <Icon name="Settings" size={16} />
                <span>Settings</span>
              </button>
            )}
          </div>
        </div>
      </aside>
    </>
  );
};

export default RoleBasedSidebar;