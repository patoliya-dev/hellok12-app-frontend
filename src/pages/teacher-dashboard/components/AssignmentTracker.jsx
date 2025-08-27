import React, { useState } from 'react';
import Icon from '../../../components/AppIcon';

const AssignmentTracker = () => {
  const [activeFilter, setActiveFilter] = useState('all');

  const assignments = [
    {
      id: 1,
      title: "Quadratic Equations Worksheet",
      class: "Grade 10A",
      dueDate: "2025-08-02",
      submitted: 24,
      total: 28,
      graded: 18,
      status: "active",
      priority: "high"
    },
    {
      id: 2,
      title: "Physics Lab Report - Motion",
      class: "Grade 11B",
      dueDate: "2025-08-05",
      submitted: 20,
      total: 24,
      graded: 15,
      status: "active",
      priority: "medium"
    },
    {
      id: 3,
      title: "Algebra Practice Problems",
      class: "Grade 9C",
      dueDate: "2025-07-28",
      submitted: 26,
      total: 26,
      graded: 26,
      status: "completed",
      priority: "low"
    },
    {
      id: 4,
      title: "Geometry Proofs Assignment",
      class: "Grade 10A",
      dueDate: "2025-08-10",
      submitted: 0,
      total: 28,
      graded: 0,
      status: "draft",
      priority: "medium"
    }
  ];

  const getStatusColor = (status) => {
    switch (status) {
      case 'active':
        return 'bg-primary/10 text-primary border-primary/20';
      case 'completed':
        return 'bg-success/10 text-success border-success/20';
      case 'draft':
        return 'bg-muted text-muted-foreground border-border';
      default:
        return 'bg-muted text-muted-foreground border-border';
    }
  };

  const getPriorityColor = (priority) => {
    switch (priority) {
      case 'high':
        return 'text-error';
      case 'medium':
        return 'text-warning';
      case 'low':
        return 'text-success';
      default:
        return 'text-muted-foreground';
    }
  };

  const getProgressPercentage = (submitted, total) => {
    return total > 0 ? Math.round((submitted / total) * 100) : 0;
  };

  const getGradingPercentage = (graded, submitted) => {
    return submitted > 0 ? Math.round((graded / submitted) * 100) : 0;
  };

  const filteredAssignments = assignments.filter(assignment => {
    if (activeFilter === 'all') return true;
    if (activeFilter === 'pending') return assignment.submitted < assignment.total;
    if (activeFilter === 'grading') return assignment.graded < assignment.submitted;
    return assignment.status === activeFilter;
  });

  return (
    <div className="bg-card rounded-lg border border-border shadow-subtle">
      <div className="p-6 border-b border-border">
        <div className="flex items-center justify-between mb-4">
          <h3 className="text-lg font-semibold text-foreground">Assignment Tracker</h3>
          <button className="flex items-center space-x-2 px-4 py-2 bg-primary text-primary-foreground rounded-lg hover:bg-primary/90 transition-smooth">
            <Icon name="Plus" size={16} />
            <span>New Assignment</span>
          </button>
        </div>

        <div className="flex flex-wrap gap-2">
          {['all', 'active', 'pending', 'grading', 'completed'].map((filter) => (
            <button
              key={filter}
              onClick={() => setActiveFilter(filter)}
              className={`px-3 py-1 text-sm rounded-full transition-smooth capitalize ${
                activeFilter === filter
                  ? 'bg-primary text-primary-foreground'
                  : 'bg-muted text-muted-foreground hover:bg-muted/80'
              }`}
            >
              {filter}
            </button>
          ))}
        </div>
      </div>

      <div className="p-6">
        <div className="space-y-4">
          {filteredAssignments.map((assignment) => (
            <div
              key={assignment.id}
              className={`p-4 rounded-lg border transition-smooth hover:shadow-sm ${getStatusColor(assignment.status)}`}
            >
              <div className="flex items-start justify-between mb-3">
                <div className="flex-1">
                  <div className="flex items-center space-x-2 mb-1">
                    <h4 className="font-medium text-foreground">{assignment.title}</h4>
                    <Icon 
                      name="Circle" 
                      size={8} 
                      className={getPriorityColor(assignment.priority)}
                    />
                  </div>
                  <div className="flex items-center space-x-4 text-sm text-muted-foreground">
                    <span className="flex items-center space-x-1">
                      <Icon name="Users" size={14} />
                      <span>{assignment.class}</span>
                    </span>
                    <span className="flex items-center space-x-1">
                      <Icon name="Calendar" size={14} />
                      <span>Due: {new Date(assignment.dueDate).toLocaleDateString()}</span>
                    </span>
                  </div>
                </div>
                
                <div className="flex items-center space-x-2">
                  <button className="p-1 text-muted-foreground hover:text-foreground transition-smooth">
                    <Icon name="Edit" size={16} />
                  </button>
                  <button className="p-1 text-muted-foreground hover:text-foreground transition-smooth">
                    <Icon name="MoreVertical" size={16} />
                  </button>
                </div>
              </div>

              <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                <div>
                  <div className="flex items-center justify-between mb-2">
                    <span className="text-sm text-muted-foreground">Submissions</span>
                    <span className="text-sm font-medium text-foreground">
                      {assignment.submitted}/{assignment.total}
                    </span>
                  </div>
                  <div className="w-full bg-muted rounded-full h-2">
                    <div
                      className="bg-primary h-2 rounded-full transition-all duration-300"
                      style={{ width: `${getProgressPercentage(assignment.submitted, assignment.total)}%` }}
                    />
                  </div>
                </div>

                <div>
                  <div className="flex items-center justify-between mb-2">
                    <span className="text-sm text-muted-foreground">Graded</span>
                    <span className="text-sm font-medium text-foreground">
                      {assignment.graded}/{assignment.submitted}
                    </span>
                  </div>
                  <div className="w-full bg-muted rounded-full h-2">
                    <div
                      className="bg-success h-2 rounded-full transition-all duration-300"
                      style={{ width: `${getGradingPercentage(assignment.graded, assignment.submitted)}%` }}
                    />
                  </div>
                </div>
              </div>

              <div className="flex items-center justify-between mt-4 pt-3 border-t border-border">
                <div className="flex items-center space-x-2">
                  <span className={`px-2 py-1 text-xs rounded-full capitalize ${getStatusColor(assignment.status)}`}>
                    {assignment.status}
                  </span>
                </div>
                
                <div className="flex items-center space-x-2">
                  <button className="flex items-center space-x-1 px-3 py-1 text-sm text-primary hover:bg-primary/10 rounded transition-smooth">
                    <Icon name="Eye" size={14} />
                    <span>View</span>
                  </button>
                  {assignment.submitted > assignment.graded && (
                    <button className="flex items-center space-x-1 px-3 py-1 text-sm text-success hover:bg-success/10 rounded transition-smooth">
                      <Icon name="Award" size={14} />
                      <span>Grade</span>
                    </button>
                  )}
                </div>
              </div>
            </div>
          ))}
        </div>

        {filteredAssignments.length === 0 && (
          <div className="text-center py-8">
            <Icon name="FileText" size={48} color="var(--color-muted-foreground)" />
            <h4 className="mt-4 text-lg font-medium text-foreground">No assignments found</h4>
            <p className="mt-2 text-sm text-muted-foreground">
              Create your first assignment to get started
            </p>
          </div>
        )}
      </div>
    </div>
  );
};

export default AssignmentTracker;