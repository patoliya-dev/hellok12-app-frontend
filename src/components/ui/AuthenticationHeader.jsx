import React from 'react';
import Icon from '../AppIcon';

const AuthenticationHeader = () => {
  return (
    <header className="fixed top-0 left-0 right-0 z-50 bg-surface border-b border-border">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="flex items-center justify-between h-16">
          {/* Logo */}
          <div className="flex items-center">
            <div className="flex-shrink-0">
              <div className="flex items-center space-x-2">
                <div className="w-8 h-8 bg-primary rounded-lg flex items-center justify-center">
                  <Icon name="GraduationCap" size={20} color="white" />
                </div>
                <span className="text-xl font-semibold text-foreground">EduPortal</span>
              </div>
            </div>
          </div>

          {/* Right side utilities */}
          <div className="flex items-center space-x-4">
            {/* Language Selector */}
            <div className="relative">
              <button className="flex items-center space-x-1 px-3 py-2 text-sm text-muted-foreground hover:text-foreground transition-smooth rounded-lg hover:bg-muted">
                <Icon name="Globe" size={16} />
                <span>EN</span>
                <Icon name="ChevronDown" size={14} />
              </button>
            </div>

            {/* Help Link */}
            <button className="flex items-center space-x-1 px-3 py-2 text-sm text-muted-foreground hover:text-foreground transition-smooth rounded-lg hover:bg-muted">
              <Icon name="HelpCircle" size={16} />
              <span className="hidden sm:inline">Help</span>
            </button>
          </div>
        </div>
      </div>
    </header>
  );
};

export default AuthenticationHeader;