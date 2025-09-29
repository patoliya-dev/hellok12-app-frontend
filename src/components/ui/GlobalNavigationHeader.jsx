import React, { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import Icon from '../AppIcon';
import { useDispatch } from 'react-redux';
import { logout } from 'reducers/auth/authSlice';
const GlobalNavigationHeader = ({ userRole = 'student', userName = 'John Doe', notificationCount = 3 }) => {
  const dispatch = useDispatch();
  const navigate = useNavigate();
  const [showNotifications, setShowNotifications] = useState(false);
  const [showProfile, setShowProfile] = useState(false);
  const [showSearch, setShowSearch] = useState(false);

  const getRoleDisplayName = (role) => {
    const roleMap = {
      student: 'Student',
      parent: 'Parent',
      teacher: 'Teacher',
      school: 'School Admin',
    };
    return roleMap[role] || 'User';
  };

  const handleLogout = () => {
    dispatch(logout());
    navigate('/login', { replace: true });
  };

  return (
    <header className="fixed top-0 left-0 right-0 z-50 bg-surface border-b border-border shadow-subtle">
      <div className="max-w-full px-4 sm:px-6 lg:px-8">
        <div className="flex items-center justify-between h-16">
          {/* Logo and Brand */}
          <div className="flex items-center space-x-4">
            {/* <div className="flex items-center">
              <div className="w-8 h-8 bg-primary rounded-lg flex items-center justify-center">
                <Icon name="GraduationCap" size={20} color="white" />
              </div>
              <span className="ml-2 text-xl font-semibold text-foreground">EduPortal</span>
            </div> */}

            {/* Role Indicator */}
            {/* <div className="hidden md:flex items-center">
              <span className="text-sm text-muted-foreground">|</span>
              <span className="ml-2 text-sm font-medium text-primary">{getRoleDisplayName(userRole)}</span>
            </div> */}
          </div>

          {/* Center - Search */}
          <div className="flex-1 max-w-lg mx-4 hidden lg:block">
            {/* <div className="relative">
              <div className="absolute inset-y-0 left-0 pl-3 flex items-center pointer-events-none">
                <Icon name="Search" size={16} color="var(--color-muted-foreground)" />
              </div>
              <input
                type="text"
                placeholder="Search courses, assignments, students..."
                className="block w-full pl-10 pr-3 py-2 border border-border rounded-lg bg-muted/50 text-sm placeholder-muted-foreground focus:outline-none focus:ring-2 focus:ring-primary focus:border-transparent transition-smooth"
                onFocus={() => setShowSearch(true)}
                onBlur={() => setShowSearch(false)}
              />
            </div> */}
          </div>

          {/* Right side utilities */}
          <div className="flex items-center space-x-2">
            {/* Mobile Search */}
            {/* <button className="lg:hidden p-2 text-muted-foreground hover:text-foreground hover:bg-muted rounded-lg transition-smooth">
              <Icon name="Search" size={20} />
            </button> */}

            {/* Notifications */}
            {/* <div className="relative">
              <button
                onClick={() => setShowNotifications(!showNotifications)}
                className="relative p-2 text-muted-foreground hover:text-foreground hover:bg-muted rounded-lg transition-smooth"
              >
                <Icon name="Bell" size={20} />
                {notificationCount > 0 && (
                  <span className="absolute -top-1 -right-1 h-5 w-5 bg-error text-white text-xs rounded-full flex items-center justify-center">
                    {notificationCount > 9 ? '9+' : notificationCount}
                  </span>
                )}
              </button>
            </div> */}

            {/* Quick Actions */}
            {/* <button className="hidden md:flex p-2 text-muted-foreground hover:text-foreground hover:bg-muted rounded-lg transition-smooth">
              <Icon name="Plus" size={20} />
            </button> */}

            {/* Profile Dropdown */}
            <div className="relative">
              <button
                onClick={() => setShowProfile(!showProfile)}
                className="flex items-center space-x-2 p-2 text-muted-foreground hover:text-foreground hover:bg-muted rounded-lg transition-smooth"
              >
                <div className="w-8 h-8 bg-primary/10 rounded-full flex items-center justify-center">
                  <Icon name="User" size={16} color="var(--color-primary)" />
                </div>
                <span className="hidden md:block text-sm font-medium text-foreground">{userName}</span>
                <Icon name="ChevronDown" size={14} />
              </button>

              {/* Profile Dropdown Menu */}
              {showProfile && (
                <div className="absolute right-0 mt-2 w-56 bg-popover border border-border rounded-lg shadow-elevated z-50">
                  <div className="px-4 py-3 border-b border-border">
                    <p className="text-sm font-medium text-foreground">{userName}</p>
                    <p className="text-xs text-muted-foreground">{getRoleDisplayName(userRole)}</p>
                  </div>
                  <div className="py-1">
                    <button className="flex items-center w-full px-4 py-2 text-sm text-foreground hover:bg-muted transition-smooth">
                      <Icon name="User" size={16} className="mr-3" />
                      Profile Settings
                    </button>
                    <button className="flex items-center w-full px-4 py-2 text-sm text-foreground hover:bg-muted transition-smooth">
                      <Icon name="Settings" size={16} className="mr-3" />
                      Preferences
                    </button>
                    <button className="flex items-center w-full px-4 py-2 text-sm text-foreground hover:bg-muted transition-smooth">
                      <Icon name="HelpCircle" size={16} className="mr-3" />
                      Help & Support
                    </button>
                    <div className="border-t border-border mt-1 pt-1">
                      <button
                        onClick={handleLogout}
                        className="flex items-center w-full px-4 py-2 text-sm text-error hover:bg-error/10 transition-smooth"
                      >
                        <Icon name="LogOut" size={16} className="mr-3" />
                        Sign Out
                      </button>
                    </div>
                  </div>
                </div>
              )}
            </div>
          </div>
        </div>
      </div>
    </header>
  );
};

export default GlobalNavigationHeader;