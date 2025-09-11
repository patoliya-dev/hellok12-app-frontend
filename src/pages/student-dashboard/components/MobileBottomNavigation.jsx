import React from 'react';
import { useNavigate, useLocation } from 'react-router-dom';
import Icon from '../../../components/AppIcon';

const MobileBottomNavigation = () => {
  const navigate = useNavigate();
  const location = useLocation();

  const navigationItems = [
    {
      id: 'dashboard',
      label: 'Home',
      icon: 'Home',
      path: '/student-dashboard',
      badge: null
    },
    {
      id: 'bookings',
      label: 'Bookings',
      icon: 'Calendar',
      path: '/booking-system',
      badge: null
    },
    {
      id: 'games',
      label: 'Games',
      icon: 'Gamepad2',
      path: '/student-dashboard/games',
      badge: 'New'
    },
    {
      id: 'progress',
      label: 'Progress',
      icon: 'TrendingUp',
      path: '/student-dashboard/progress',
      badge: null
    },
    {
      id: 'messages',
      label: 'Messages',
      icon: 'MessageCircle',
      path: '/student-dashboard/messages',
      badge: '3'
    }
  ];

  const handleNavigation = (path) => {
    navigate(path);
  };

  const isActive = (path) => {
    return location.pathname === path;
  };

  return (
    <div className="fixed bottom-0 left-0 right-0 bg-card border-t border-border z-1000 lg:hidden">
      <div className="flex items-center justify-around py-2">
        {navigationItems.map((item) => (
          <button
            key={item.id}
            onClick={() => handleNavigation(item.path)}
            className={`relative flex flex-col items-center justify-center p-2 min-w-0 flex-1 transition-micro ${
              isActive(item.path)
                ? 'text-primary' :'text-muted-foreground hover:text-foreground'
            }`}
          >
            {/* Badge */}
            {item.badge && (
              <div className="absolute -top-1 -right-1 bg-error text-error-foreground text-xs px-1.5 py-0.5 rounded-full font-medium min-w-[18px] text-center">
                {item.badge}
              </div>
            )}

            {/* Icon */}
            <div className={`mb-1 ${isActive(item.path) ? 'scale-110' : ''} transition-transform duration-200`}>
              <Icon 
                name={item.icon} 
                size={20} 
                color={isActive(item.path) ? 'var(--color-primary)' : 'currentColor'} 
              />
            </div>

            {/* Label */}
            <span className={`text-xs font-medium truncate ${
              isActive(item.path) ? 'text-primary' : 'text-muted-foreground'
            }`}>
              {item.label}
            </span>

            {/* Active Indicator */}
            {isActive(item.path) && (
              <div className="absolute top-0 left-1/2 transform -translate-x-1/2 w-8 h-0.5 bg-primary rounded-full" />
            )}
          </button>
        ))}
      </div>
    </div>
  );
};

export default MobileBottomNavigation;