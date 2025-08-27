import React from 'react';
import Icon from '../../../components/AppIcon';
import Button from '../../../components/ui/Button';

const RecentAssignments = () => {
  const assignments = [
    {
      id: 1,
      subject: "Mathematics",
      title: "Algebra Practice Set 3",
      dueDate: "2025-08-02",
      status: "submitted",
      grade: "A-",
      submittedDate: "2025-07-29",
      teacher: "Ms. Rodriguez"
    },
    {
      id: 2,
      subject: "Science",
      title: "Solar System Research Project",
      dueDate: "2025-08-05",
      status: "in_progress",
      progress: 75,
      teacher: "Mr. Thompson"
    },
    {
      id: 3,
      subject: "English",
      title: "Book Report - To Kill a Mockingbird",
      dueDate: "2025-08-08",
      status: "not_started",
      teacher: "Mrs. Davis"
    },
    {
      id: 4,
      subject: "History",
      title: "World War II Timeline",
      dueDate: "2025-07-28",
      status: "overdue",
      teacher: "Mr. Wilson"
    }
  ];

  const getStatusBadge = (status, grade = null) => {
    const statusConfig = {
      submitted: { 
        color: "bg-success/10 text-success border-success/20", 
        icon: "CheckCircle", 
        text: grade ? `Submitted • ${grade}` : "Submitted" 
      },
      in_progress: { 
        color: "bg-warning/10 text-warning border-warning/20", 
        icon: "Clock", 
        text: "In Progress" 
      },
      not_started: { 
        color: "bg-muted text-muted-foreground border-border", 
        icon: "Circle", 
        text: "Not Started" 
      },
      overdue: { 
        color: "bg-error/10 text-error border-error/20", 
        icon: "AlertCircle", 
        text: "Overdue" 
      }
    };
    return statusConfig[status];
  };

  const formatDate = (dateString) => {
    const date = new Date(dateString);
    const today = new Date();
    const diffTime = date - today;
    const diffDays = Math.ceil(diffTime / (1000 * 60 * 60 * 24));
    
    if (diffDays === 0) return "Due today";
    if (diffDays === 1) return "Due tomorrow";
    if (diffDays > 0) return `Due in ${diffDays} days`;
    return `${Math.abs(diffDays)} days overdue`;
  };

  return (
    <div className="bg-card rounded-lg border border-border shadow-subtle">
      <div className="p-6 border-b border-border">
        <div className="flex items-center justify-between">
          <h2 className="text-lg font-semibold text-foreground">Recent Assignments</h2>
          <Button variant="ghost" size="sm" iconName="ExternalLink">
            View All
          </Button>
        </div>
      </div>

      <div className="divide-y divide-border">
        {assignments.map((assignment) => {
          const statusBadge = getStatusBadge(assignment.status, assignment.grade);
          
          return (
            <div key={assignment.id} className="p-6 hover:bg-muted/50 transition-smooth">
              <div className="flex items-start justify-between mb-3">
                <div className="flex-1">
                  <div className="flex items-center space-x-2 mb-1">
                    <span className="text-xs font-medium text-primary bg-primary/10 px-2 py-1 rounded">
                      {assignment.subject}
                    </span>
                    <span className="text-xs text-muted-foreground">•</span>
                    <span className="text-xs text-muted-foreground">{assignment.teacher}</span>
                  </div>
                  <h3 className="font-medium text-foreground mb-1">{assignment.title}</h3>
                  <p className="text-sm text-muted-foreground">{formatDate(assignment.dueDate)}</p>
                </div>
                
                <div className={`px-3 py-1 rounded-full border text-xs font-medium flex items-center space-x-1 ${statusBadge.color}`}>
                  <Icon name={statusBadge.icon} size={12} />
                  <span>{statusBadge.text}</span>
                </div>
              </div>

              {assignment.status === 'in_progress' && assignment.progress && (
                <div className="mb-3">
                  <div className="flex items-center justify-between text-xs text-muted-foreground mb-1">
                    <span>Progress</span>
                    <span>{assignment.progress}%</span>
                  </div>
                  <div className="w-full bg-muted rounded-full h-2">
                    <div 
                      className="bg-primary h-2 rounded-full transition-smooth" 
                      style={{ width: `${assignment.progress}%` }}
                    ></div>
                  </div>
                </div>
              )}

              {assignment.submittedDate && (
                <div className="text-xs text-muted-foreground">
                  Submitted on {new Date(assignment.submittedDate).toLocaleDateString()}
                </div>
              )}
            </div>
          );
        })}
      </div>
    </div>
  );
};

export default RecentAssignments;