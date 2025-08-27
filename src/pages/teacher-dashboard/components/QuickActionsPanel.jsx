import React from 'react';
import Icon from '../../../components/AppIcon';

const QuickActionsPanel = () => {
  const quickActions = [
    {
      id: 1,
      title: "Take Attendance",
      description: "Mark attendance for current class",
      icon: "UserCheck",
      color: "bg-success/10 text-success",
      action: () => console.log('Take attendance')
    },
    {
      id: 2,
      title: "Create Assignment",
      description: "Add new assignment for students",
      icon: "FileText",
      color: "bg-primary/10 text-primary",
      action: () => console.log('Create assignment')
    },
    {
      id: 3,
      title: "Grade Submissions",
      description: "Review and grade pending work",
      icon: "Award",
      color: "bg-warning/10 text-warning",
      badge: "12",
      action: () => console.log('Grade submissions')
    },
    {
      id: 4,
      title: "Message Parents",
      description: "Send updates to parents",
      icon: "MessageSquare",
      color: "bg-accent/10 text-accent",
      action: () => console.log('Message parents')
    },
    {
      id: 5,
      title: "Upload Resources",
      description: "Share materials with students",
      icon: "Upload",
      color: "bg-secondary/10 text-secondary",
      action: () => console.log('Upload resources')
    },
    {
      id: 6,
      title: "Schedule Meeting",
      description: "Book parent-teacher conference",
      icon: "Calendar",
      color: "bg-muted text-muted-foreground",
      action: () => console.log('Schedule meeting')
    }
  ];

  return (
    <div className="bg-card rounded-lg border border-border p-6 shadow-subtle">
      <div className="flex items-center justify-between mb-6">
        <h3 className="text-lg font-semibold text-foreground">Quick Actions</h3>
        <button className="p-2 text-muted-foreground hover:text-foreground hover:bg-muted rounded-lg transition-smooth">
          <Icon name="Settings" size={16} />
        </button>
      </div>

      <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
        {quickActions.map((action) => (
          <button
            key={action.id}
            onClick={action.action}
            className="relative p-4 text-left bg-surface hover:bg-muted/50 border border-border rounded-lg transition-smooth group"
          >
            <div className="flex items-start space-x-3">
              <div className={`w-10 h-10 rounded-lg flex items-center justify-center ${action.color}`}>
                <Icon name={action.icon} size={20} />
              </div>
              <div className="flex-1 min-w-0">
                <h4 className="font-medium text-foreground group-hover:text-primary transition-smooth">
                  {action.title}
                </h4>
                <p className="text-sm text-muted-foreground mt-1">
                  {action.description}
                </p>
              </div>
              {action.badge && (
                <span className="absolute -top-2 -right-2 w-6 h-6 bg-error text-error-foreground text-xs rounded-full flex items-center justify-center">
                  {action.badge}
                </span>
              )}
            </div>
          </button>
        ))}
      </div>

      <div className="mt-6 pt-4 border-t border-border">
        <button className="w-full flex items-center justify-center space-x-2 py-2 text-sm text-muted-foreground hover:text-foreground hover:bg-muted rounded-lg transition-smooth">
          <Icon name="Plus" size={16} />
          <span>Customize Actions</span>
        </button>
      </div>
    </div>
  );
};

export default QuickActionsPanel;