import React from 'react';
import Icon from '../../../components/AppIcon';
import Button from '../../../components/ui/Button';

const RecentGradesWidget = () => {
  const recentGrades = [
    {
      id: 1,
      subject: "Mathematics",
      assignment: "Midterm Exam",
      grade: "A-",
      score: 88,
      maxScore: 100,
      date: "2025-07-28",
      trend: "up",
      previousScore: 82,
      teacher: "Dr. Sarah Johnson"
    },
    {
      id: 2,
      subject: "Physics",
      assignment: "Lab Report 3",
      grade: "B+",
      score: 87,
      maxScore: 100,
      date: "2025-07-26",
      trend: "up",
      previousScore: 79,
      teacher: "Prof. Michael Chen"
    },
    {
      id: 3,
      subject: "English Literature",
      assignment: "Essay Analysis",
      grade: "A",
      score: 94,
      maxScore: 100,
      date: "2025-07-25",
      trend: "stable",
      previousScore: 93,
      teacher: "Ms. Emily Davis"
    },
    {
      id: 4,
      subject: "Chemistry",
      assignment: "Quiz 4",
      grade: "B",
      score: 78,
      maxScore: 100,
      date: "2025-07-24",
      trend: "down",
      previousScore: 85,
      teacher: "Dr. Robert Wilson"
    }
  ];

  const getGradeColor = (grade) => {
    if (grade.startsWith('A')) return 'text-success';
    if (grade.startsWith('B')) return 'text-primary';
    if (grade.startsWith('C')) return 'text-warning';
    return 'text-error';
  };

  const getGradeBg = (grade) => {
    if (grade.startsWith('A')) return 'bg-success/10';
    if (grade.startsWith('B')) return 'bg-primary/10';
    if (grade.startsWith('C')) return 'bg-warning/10';
    return 'bg-error/10';
  };

  const getTrendIcon = (trend) => {
    const icons = {
      up: 'TrendingUp',
      down: 'TrendingDown',
      stable: 'Minus'
    };
    return icons[trend] || 'Minus';
  };

  const getTrendColor = (trend) => {
    const colors = {
      up: 'text-success',
      down: 'text-error',
      stable: 'text-muted-foreground'
    };
    return colors[trend] || 'text-muted-foreground';
  };

  const calculateGPA = () => {
    const gradePoints = {
      'A+': 4.0, 'A': 4.0, 'A-': 3.7,
      'B+': 3.3, 'B': 3.0, 'B-': 2.7,
      'C+': 2.3, 'C': 2.0, 'C-': 1.7,
      'D': 1.0, 'F': 0.0
    };
    
    const totalPoints = recentGrades.reduce((sum, grade) => {
      return sum + (gradePoints[grade.grade] || 0);
    }, 0);
    
    return (totalPoints / recentGrades.length).toFixed(2);
  };

  return (
    <div className="bg-card rounded-lg border border-border shadow-subtle p-6">
      <div className="flex items-center justify-between mb-6">
        <div className="flex items-center space-x-3">
          <div className="w-10 h-10 bg-success/10 rounded-lg flex items-center justify-center">
            <Icon name="Award" size={20} color="var(--color-success)" />
          </div>
          <div>
            <h2 className="text-lg font-semibold text-foreground">Recent Grades</h2>
            <p className="text-sm text-muted-foreground">Current GPA: {calculateGPA()}</p>
          </div>
        </div>
        <Button variant="ghost" size="sm" iconName="BarChart3">
          Analytics
        </Button>
      </div>

      <div className="space-y-4">
        {recentGrades.map((grade) => (
          <div
            key={grade.id}
            className="p-4 bg-muted/30 rounded-lg hover:bg-muted/50 transition-smooth"
          >
            <div className="flex items-center justify-between mb-3">
              <div className="flex items-center space-x-3 flex-1">
                <div className={`w-12 h-12 rounded-lg flex items-center justify-center ${getGradeBg(grade.grade)}`}>
                  <span className={`text-lg font-bold ${getGradeColor(grade.grade)}`}>
                    {grade.grade}
                  </span>
                </div>
                
                <div className="flex-1 min-w-0">
                  <h3 className="text-sm font-medium text-foreground mb-1 truncate">
                    {grade.assignment}
                  </h3>
                  <p className="text-xs text-muted-foreground mb-1">{grade.subject}</p>
                  <div className="flex items-center space-x-4 text-xs text-muted-foreground">
                    <span>{grade.score}/{grade.maxScore} points</span>
                    <span>•</span>
                    <span>{new Date(grade.date).toLocaleDateString()}</span>
                  </div>
                </div>
              </div>

              <div className="flex items-center space-x-3 ml-4">
                <div className="flex items-center space-x-1">
                  <Icon 
                    name={getTrendIcon(grade.trend)} 
                    size={16} 
                    className={getTrendColor(grade.trend)}
                  />
                  <span className={`text-xs font-medium ${getTrendColor(grade.trend)}`}>
                    {grade.trend === 'up' && `+${grade.score - grade.previousScore}`}
                    {grade.trend === 'down' && `${grade.score - grade.previousScore}`}
                    {grade.trend === 'stable' && '0'}
                  </span>
                </div>
              </div>
            </div>

            <div className="flex items-center justify-between">
              <div className="flex items-center space-x-2">
                <span className="text-xs text-muted-foreground">
                  Teacher: {grade.teacher}
                </span>
              </div>
              
              <div className="flex items-center space-x-2">
                <Button variant="ghost" size="xs" iconName="Eye">
                  Details
                </Button>
                <Button variant="ghost" size="xs" iconName="MessageSquare">
                  Feedback
                </Button>
              </div>
            </div>

            {/* Progress Bar */}
            <div className="mt-3">
              <div className="w-full bg-muted rounded-full h-2">
                <div 
                  className={`h-2 rounded-full transition-all duration-300 ${
                    grade.grade.startsWith('A') ? 'bg-success' :
                    grade.grade.startsWith('B') ? 'bg-primary' :
                    grade.grade.startsWith('C') ? 'bg-warning' : 'bg-error'
                  }`}
                  style={{ width: `${(grade.score / grade.maxScore) * 100}%` }}
                />
              </div>
            </div>
          </div>
        ))}
      </div>

      <div className="mt-6 pt-4 border-t border-border">
        <Button variant="ghost" fullWidth iconName="Award" iconPosition="left">
          View Grade Book
        </Button>
      </div>
    </div>
  );
};

export default RecentGradesWidget;