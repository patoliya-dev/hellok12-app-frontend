import React, { useState } from 'react';
import Icon from '../../../components/AppIcon';
import Button from '../../../components/ui/Button';

const QuickActionsWidget = () => {
  const [isExpanded, setIsExpanded] = useState(false);

  const quickActions = [
    {
      id: 1,
      title: "View Schedule",
      description: "Check today\'s classes and events",
      icon: "Calendar",
      color: "primary",
      action: () => console.log('View Schedule'),
      shortcut: "Ctrl+S"
    },
    {
      id: 2,
      title: "Submit Assignment",
      description: "Upload your completed work",
      icon: "Upload",
      color: "success",
      action: () => console.log('Submit Assignment'),
      shortcut: "Ctrl+U"
    },
    {
      id: 3,
      title: "Join Virtual Class",
      description: "Enter online classroom",
      icon: "Video",
      color: "warning",
      action: () => console.log('Join Virtual Class'),
      shortcut: "Ctrl+J"
    },
    {
      id: 4,
      title: "Access Library",
      description: "Browse digital resources",
      icon: "Library",
      color: "accent",
      action: () => console.log('Access Library'),
      shortcut: "Ctrl+L"
    },
    {
      id: 5,
      title: "Message Teacher",
      description: "Send a message to instructor",
      icon: "MessageSquare",
      color: "secondary",
      action: () => console.log('Message Teacher'),
      shortcut: "Ctrl+M"
    },
    {
      id: 6,
      title: "Check Grades",
      description: "View your academic performance",
      icon: "Award",
      color: "success",
      action: () => console.log('Check Grades'),
      shortcut: "Ctrl+G"
    },
    {
      id: 7,
      title: "Download Materials",
      description: "Get course resources",
      icon: "Download",
      color: "primary",
      action: () => console.log('Download Materials'),
      shortcut: "Ctrl+D"
    },
    {
      id: 8,
      title: "Study Groups",
      description: "Find or create study groups",
      icon: "Users",
      color: "accent",
      action: () => console.log('Study Groups'),
      shortcut: "Ctrl+T"
    }
  ];

  const getColorClasses = (color) => {
    const colorMap = {
      primary: {
        bg: 'bg-primary/10 hover:bg-primary/20',
        text: 'text-primary',
        border: 'border-primary/20'
      },
      success: {
        bg: 'bg-success/10 hover:bg-success/20',
        text: 'text-success',
        border: 'border-success/20'
      },
      warning: {
        bg: 'bg-warning/10 hover:bg-warning/20',
        text: 'text-warning',
        border: 'border-warning/20'
      },
      accent: {
        bg: 'bg-accent/10 hover:bg-accent/20',
        text: 'text-accent',
        border: 'border-accent/20'
      },
      secondary: {
        bg: 'bg-secondary/10 hover:bg-secondary/20',
        text: 'text-secondary',
        border: 'border-secondary/20'
      }
    };
    return colorMap[color] || colorMap.primary;
  };

  const displayedActions = isExpanded ? quickActions : quickActions.slice(0, 6);

  return (
    <div className="bg-card rounded-lg border border-border shadow-subtle p-6">
      <div className="flex items-center justify-between mb-6">
        <div className="flex items-center space-x-3">
          <div className="w-10 h-10 bg-accent/10 rounded-lg flex items-center justify-center">
            <Icon name="Zap" size={20} color="var(--color-accent)" />
          </div>
          <div>
            <h2 className="text-lg font-semibold text-foreground">Quick Actions</h2>
            <p className="text-sm text-muted-foreground">Frequently used tools</p>
          </div>
        </div>
        <Button 
          variant="ghost" 
          size="sm" 
          iconName={isExpanded ? "ChevronUp" : "ChevronDown"}
          onClick={() => setIsExpanded(!isExpanded)}
        >
          {isExpanded ? 'Less' : 'More'}
        </Button>
      </div>

      <div className="grid grid-cols-2 lg:grid-cols-3 gap-4">
        {displayedActions.map((action) => {
          const colors = getColorClasses(action.color);
          return (
            <button
              key={action.id}
              onClick={action.action}
              className={`
                p-4 rounded-lg border transition-smooth text-left group
                ${colors.bg} ${colors.border} hover:shadow-subtle
              `}
            >
              <div className="flex items-center space-x-3 mb-3">
                <div className={`w-8 h-8 rounded-lg flex items-center justify-center bg-surface border ${colors.border}`}>
                  <Icon name={action.icon} size={16} className={colors.text} />
                </div>
                <div className="flex-1 min-w-0">
                  <h3 className="text-sm font-medium text-foreground truncate group-hover:text-foreground">
                    {action.title}
                  </h3>
                </div>
              </div>
              
              <p className="text-xs text-muted-foreground mb-3 line-clamp-2">
                {action.description}
              </p>
              
              <div className="flex items-center justify-between">
                <span className={`text-xs font-medium ${colors.text}`}>
                  Click to access
                </span>
                <span className="text-xs text-muted-foreground bg-muted px-2 py-1 rounded">
                  {action.shortcut}
                </span>
              </div>
            </button>
          );
        })}
      </div>

      {/* Floating Action Button for Mobile */}
      <div className="fixed bottom-6 right-6 lg:hidden z-40">
        <button
          onClick={() => setIsExpanded(!isExpanded)}
          className="w-14 h-14 bg-primary text-primary-foreground rounded-full shadow-modal flex items-center justify-center hover:bg-primary/90 transition-smooth"
        >
          <Icon name="Plus" size={24} />
        </button>
      </div>

      {/* Keyboard Shortcuts Info */}
      <div className="mt-6 pt-4 border-t border-border">
        <div className="flex items-center justify-between">
          <div className="flex items-center space-x-2">
            <Icon name="Keyboard" size={16} className="text-muted-foreground" />
            <span className="text-sm text-muted-foreground">Keyboard shortcuts available</span>
          </div>
          <Button variant="ghost" size="sm" iconName="HelpCircle">
            Help
          </Button>
        </div>
      </div>
    </div>
  );
};

export default QuickActionsWidget;