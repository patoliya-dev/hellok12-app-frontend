import React from 'react';
import Icon from '../../../components/AppIcon';
import Button from '../../../components/ui/Button';

const AssignmentsDueWidget = () => {
  const assignments = [
    {
      id: 1,
      title: "Calculus Problem Set 5",
      subject: "Mathematics",
      dueDate: "2025-07-31",
      dueTime: "11:59 PM",
      priority: "high",
      status: "pending",
      progress: 0,
      type: "homework"
    },
    {
      id: 2,
      title: "Physics Lab Report",
      subject: "Physics",
      dueDate: "2025-08-02",
      dueTime: "09:00 AM",
      priority: "medium",
      status: "in-progress",
      progress: 65,
      type: "lab-report"
    },
    {
      id: 3,
      title: "Essay: Modern Literature",
      subject: "English",
      dueDate: "2025-08-05",
      dueTime: "02:00 PM",
      priority: "medium",
      status: "pending",
      progress: 0,
      type: "essay"
    },
    {
      id: 4,
      title: "Chemistry Quiz Preparation",
      subject: "Chemistry",
      dueDate: "2025-08-01",
      dueTime: "10:00 AM",
      priority: "high",
      status: "pending",
      progress: 0,
      type: "quiz"
    }
  ];

  const getPriorityColor = (priority) => {
    const colors = {
      high: 'text-error',
      medium: 'text-warning',
      low: 'text-success'
    };
    return colors[priority] || 'text-muted-foreground';
  };

  const getPriorityBg = (priority) => {
    const colors = {
      high: 'bg-error/10',
      medium: 'bg-warning/10',
      low: 'bg-success/10'
    };
    return colors[priority] || 'bg-muted';
  };

  const getTypeIcon = (type) => {
    const icons = {
      homework: 'BookOpen',
      'lab-report': 'FlaskConical',
      essay: 'PenTool',
      quiz: 'HelpCircle'
    };
    return icons[type] || 'FileText';
  };

  const getDaysUntilDue = (dueDate) => {
    const today = new Date();
    const due = new Date(dueDate);
    const diffTime = due - today;
    const diffDays = Math.ceil(diffTime / (1000 * 60 * 60 * 24));
    
    if (diffDays === 0) return 'Due today';
    if (diffDays === 1) return 'Due tomorrow';
    if (diffDays < 0) return `${Math.abs(diffDays)} days overdue`;
    return `${diffDays} days left`;
  };

  return (
    <div className="bg-card rounded-lg border border-border shadow-subtle p-6">
      <div className="flex items-center justify-between mb-6">
        <div className="flex items-center space-x-3">
          <div className="w-10 h-10 bg-warning/10 rounded-lg flex items-center justify-center">
            <Icon name="FileText" size={20} color="var(--color-warning)" />
          </div>
          <div>
            <h2 className="text-lg font-semibold text-foreground">Assignments Due</h2>
            <p className="text-sm text-muted-foreground">4 pending tasks</p>
          </div>
        </div>
        <Button variant="ghost" size="sm" iconName="Plus">
          Add Task
        </Button>
      </div>

      <div className="space-y-4">
        {assignments.map((assignment) => (
          <div
            key={assignment.id}
            className="p-4 bg-muted/30 rounded-lg hover:bg-muted/50 transition-smooth"
          >
            <div className="flex items-start justify-between mb-3">
              <div className="flex items-start space-x-3 flex-1">
                <div className="flex-shrink-0">
                  <div className={`w-10 h-10 rounded-lg flex items-center justify-center ${getPriorityBg(assignment.priority)}`}>
                    <Icon 
                      name={getTypeIcon(assignment.type)} 
                      size={16} 
                      className={getPriorityColor(assignment.priority)}
                    />
                  </div>
                </div>
                
                <div className="flex-1 min-w-0">
                  <h3 className="text-sm font-medium text-foreground mb-1 truncate">
                    {assignment.title}
                  </h3>
                  <p className="text-xs text-muted-foreground mb-2">{assignment.subject}</p>
                  
                  <div className="flex items-center space-x-4 text-xs text-muted-foreground">
                    <span className="flex items-center">
                      <Icon name="Calendar" size={12} className="mr-1" />
                      {getDaysUntilDue(assignment.dueDate)}
                    </span>
                    <span className="flex items-center">
                      <Icon name="Clock" size={12} className="mr-1" />
                      {assignment.dueTime}
                    </span>
                  </div>
                </div>
              </div>

              <div className="flex items-center space-x-2 ml-4">
                <span className={`inline-flex items-center px-2 py-1 rounded-full text-xs font-medium ${getPriorityBg(assignment.priority)} ${getPriorityColor(assignment.priority)}`}>
                  {assignment.priority}
                </span>
              </div>
            </div>

            {assignment.progress > 0 && (
              <div className="mb-3">
                <div className="flex items-center justify-between text-xs text-muted-foreground mb-1">
                  <span>Progress</span>
                  <span>{assignment.progress}%</span>
                </div>
                <div className="w-full bg-muted rounded-full h-2">
                  <div 
                    className="bg-primary h-2 rounded-full transition-all duration-300"
                    style={{ width: `${assignment.progress}%` }}
                  />
                </div>
              </div>
            )}

            <div className="flex items-center justify-between">
              <div className="flex items-center space-x-2">
                <Button variant="ghost" size="xs" iconName="Eye">
                  View
                </Button>
                <Button variant="ghost" size="xs" iconName="Edit">
                  Edit
                </Button>
              </div>
              
              <Button 
                variant={assignment.status === 'pending' ? 'default' : 'outline'} 
                size="xs"
                iconName={assignment.status === 'pending' ? 'Play' : 'CheckCircle'}
              >
                {assignment.status === 'pending' ? 'Start' : 'Continue'}
              </Button>
            </div>
          </div>
        ))}
      </div>

      <div className="mt-6 pt-4 border-t border-border">
        <Button variant="ghost" fullWidth iconName="FileText" iconPosition="left">
          View All Assignments
        </Button>
      </div>
    </div>
  );
};

export default AssignmentsDueWidget;