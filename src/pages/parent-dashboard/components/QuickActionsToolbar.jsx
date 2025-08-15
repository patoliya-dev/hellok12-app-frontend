import React from 'react';
import Icon from '../../../components/AppIcon';
import Button from '../../../components/ui/Button';

const QuickActionsToolbar = () => {
  const quickActions = [
    {
      id: 'absence',
      title: 'Report Absence',
      description: 'Notify school about student absence',
      icon: 'UserX',
      color: 'warning',
      action: () => console.log('Report absence')
    },
    {
      id: 'permission',
      title: 'Permission Slips',
      description: 'Sign digital permission forms',
      icon: 'FileSignature',
      color: 'primary',
      badge: '2',
      action: () => console.log('Permission slips')
    },
    {
      id: 'resources',
      title: 'Download Resources',
      description: 'Access study materials and forms',
      icon: 'Download',
      color: 'success',
      action: () => console.log('Download resources')
    },
    {
      id: 'schedule',
      title: 'View Schedule',
      description: 'Check class timetable and events',
      icon: 'Calendar',
      color: 'secondary',
      action: () => console.log('View schedule')
    },
    {
      id: 'transport',
      title: 'Bus Tracking',
      description: 'Track school bus location',
      icon: 'Bus',
      color: 'accent',
      action: () => console.log('Bus tracking')
    },
    {
      id: 'emergency',
      title: 'Emergency Contact',
      description: 'Quick access to emergency numbers',
      icon: 'Phone',
      color: 'error',
      action: () => console.log('Emergency contact')
    }
  ];

  const getColorClasses = (color) => {
    const colors = {
      primary: "bg-primary/10 text-primary border-primary/20 hover:bg-primary/20",
      success: "bg-success/10 text-success border-success/20 hover:bg-success/20",
      warning: "bg-warning/10 text-warning border-warning/20 hover:bg-warning/20",
      error: "bg-error/10 text-error border-error/20 hover:bg-error/20",
      secondary: "bg-secondary/10 text-secondary border-secondary/20 hover:bg-secondary/20",
      accent: "bg-accent/10 text-accent border-accent/20 hover:bg-accent/20"
    };
    return colors[color] || colors.primary;
  };

  return (
    <div className="bg-card rounded-lg border border-border shadow-subtle">
      <div className="p-6 border-b border-border">
        <div className="flex items-center justify-between">
          <h2 className="text-lg font-semibold text-foreground">Quick Actions</h2>
          <Button variant="ghost" size="sm" iconName="Settings">
            Customize
          </Button>
        </div>
      </div>

      <div className="p-6">
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-4">
          {quickActions.map((action) => (
            <button
              key={action.id}
              onClick={action.action}
              className={`
                relative p-4 rounded-lg border transition-smooth text-left
                ${getColorClasses(action.color)}
              `}
            >
              {action.badge && (
                <div className="absolute -top-2 -right-2 w-6 h-6 bg-error text-error-foreground text-xs rounded-full flex items-center justify-center font-medium">
                  {action.badge}
                </div>
              )}
              
              <div className="flex items-start space-x-3">
                <div className="flex-shrink-0">
                  <Icon name={action.icon} size={24} />
                </div>
                <div className="flex-1 min-w-0">
                  <h3 className="font-medium mb-1">{action.title}</h3>
                  <p className="text-sm opacity-80 line-clamp-2">{action.description}</p>
                </div>
              </div>
            </button>
          ))}
        </div>

        {/* Emergency Contact Section */}
        <div className="mt-6 p-4 bg-error/5 border border-error/20 rounded-lg">
          <div className="flex items-center space-x-3">
            <div className="w-10 h-10 bg-error/10 rounded-full flex items-center justify-center">
              <Icon name="AlertTriangle" size={20} color="var(--color-error)" />
            </div>
            <div className="flex-1">
              <h3 className="font-medium text-error">Emergency Contacts</h3>
              <p className="text-sm text-error/80">School Office: (555) 123-4567 • Nurse: (555) 123-4568</p>
            </div>
            <Button variant="outline" size="sm" iconName="Phone">
              Call
            </Button>
          </div>
        </div>

        {/* Frequently Used Actions */}
        <div className="mt-6">
          <h3 className="font-medium text-foreground mb-3">Frequently Used</h3>
          <div className="flex flex-wrap gap-2">
            {[
              { label: 'Attendance Report', icon: 'BarChart3' },
              { label: 'Grade Summary', icon: 'Award' },
              { label: 'Message Teacher', icon: 'MessageSquare' },
              { label: 'School Calendar', icon: 'Calendar' }
            ].map((item, index) => (
              <button
                key={index}
                className="flex items-center space-x-2 px-3 py-2 bg-muted hover:bg-muted/80 rounded-lg text-sm font-medium text-foreground transition-smooth"
              >
                <Icon name={item.icon} size={16} />
                <span>{item.label}</span>
              </button>
            ))}
          </div>
        </div>
      </div>
    </div>
  );
};

export default QuickActionsToolbar;