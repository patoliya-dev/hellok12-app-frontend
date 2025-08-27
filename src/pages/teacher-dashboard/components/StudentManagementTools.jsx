import React, { useState } from 'react';
import Icon from '../../../components/AppIcon';

const StudentManagementTools = () => {
  const [selectedClass, setSelectedClass] = useState('Grade 10A');
  const [searchTerm, setSearchTerm] = useState('');

  const classes = [
    { id: 1, name: 'Grade 10A', subject: 'Mathematics', students: 28 },
    { id: 2, name: 'Grade 11B', subject: 'Physics', students: 24 },
    { id: 3, name: 'Grade 9C', subject: 'Mathematics', students: 26 }
  ];

  const students = [
    {
      id: 1,
      name: "Emma Johnson",
      avatar: "https://images.unsplash.com/photo-1494790108755-2616b612b786?w=150",
      grade: "A-",
      attendance: 95,
      lastActive: "2 hours ago",
      status: "active"
    },
    {
      id: 2,
      name: "Michael Chen",
      avatar: "https://images.unsplash.com/photo-1507003211169-0a1dd7228f2d?w=150",
      grade: "B+",
      attendance: 88,
      lastActive: "1 day ago",
      status: "active"
    },
    {
      id: 3,
      name: "Sarah Williams",
      avatar: "https://images.unsplash.com/photo-1438761681033-6461ffad8d80?w=150",
      grade: "A",
      attendance: 92,
      lastActive: "3 hours ago",
      status: "active"
    },
    {
      id: 4,
      name: "David Rodriguez",
      avatar: "https://images.unsplash.com/photo-1472099645785-5658abf4ff4e?w=150",
      grade: "B",
      attendance: 78,
      lastActive: "5 days ago",
      status: "concern"
    }
  ];

  const getStatusColor = (status) => {
    switch (status) {
      case 'active':
        return 'bg-success/10 text-success';
      case 'concern':
        return 'bg-warning/10 text-warning';
      default:
        return 'bg-muted text-muted-foreground';
    }
  };

  const filteredStudents = students.filter(student =>
    student.name.toLowerCase().includes(searchTerm.toLowerCase())
  );

  return (
    <div className="bg-card rounded-lg border border-border shadow-subtle">
      <div className="p-6 border-b border-border">
        <div className="flex items-center justify-between mb-4">
          <h3 className="text-lg font-semibold text-foreground">Student Management</h3>
          <div className="flex items-center space-x-2">
            <button className="p-2 text-muted-foreground hover:text-foreground hover:bg-muted rounded-lg transition-smooth">
              <Icon name="Download" size={16} />
            </button>
            <button className="p-2 text-muted-foreground hover:text-foreground hover:bg-muted rounded-lg transition-smooth">
              <Icon name="Filter" size={16} />
            </button>
          </div>
        </div>

        <div className="flex flex-col sm:flex-row gap-4">
          <select
            value={selectedClass}
            onChange={(e) => setSelectedClass(e.target.value)}
            className="px-3 py-2 border border-border rounded-lg bg-surface text-foreground focus:outline-none focus:ring-2 focus:ring-primary focus:border-transparent"
          >
            {classes.map((cls) => (
              <option key={cls.id} value={cls.name}>
                {cls.name} - {cls.subject} ({cls.students} students)
              </option>
            ))}
          </select>

          <div className="relative flex-1">
            <div className="absolute inset-y-0 left-0 pl-3 flex items-center pointer-events-none">
              <Icon name="Search" size={16} color="var(--color-muted-foreground)" />
            </div>
            <input
              type="text"
              placeholder="Search students..."
              value={searchTerm}
              onChange={(e) => setSearchTerm(e.target.value)}
              className="block w-full pl-10 pr-3 py-2 border border-border rounded-lg bg-surface text-foreground placeholder-muted-foreground focus:outline-none focus:ring-2 focus:ring-primary focus:border-transparent"
            />
          </div>
        </div>
      </div>

      <div className="p-6">
        <div className="space-y-4">
          {filteredStudents.map((student) => (
            <div
              key={student.id}
              className="flex items-center justify-between p-4 bg-surface hover:bg-muted/50 border border-border rounded-lg transition-smooth"
            >
              <div className="flex items-center space-x-4">
                <div className="relative">
                  <img
                    src={student.avatar}
                    alt={student.name}
                    className="w-12 h-12 rounded-full object-cover"
                    onError={(e) => {
                      e.target.src = '/assets/images/no_image.png';
                    }}
                  />
                  <div className={`absolute -bottom-1 -right-1 w-4 h-4 rounded-full border-2 border-surface ${getStatusColor(student.status)}`} />
                </div>
                
                <div>
                  <h4 className="font-medium text-foreground">{student.name}</h4>
                  <div className="flex items-center space-x-4 text-sm text-muted-foreground">
                    <span>Grade: {student.grade}</span>
                    <span>Attendance: {student.attendance}%</span>
                    <span>Last active: {student.lastActive}</span>
                  </div>
                </div>
              </div>

              <div className="flex items-center space-x-2">
                <button className="p-2 text-muted-foreground hover:text-foreground hover:bg-muted rounded-lg transition-smooth">
                  <Icon name="MessageSquare" size={16} />
                </button>
                <button className="p-2 text-muted-foreground hover:text-foreground hover:bg-muted rounded-lg transition-smooth">
                  <Icon name="User" size={16} />
                </button>
                <button className="p-2 text-muted-foreground hover:text-foreground hover:bg-muted rounded-lg transition-smooth">
                  <Icon name="MoreVertical" size={16} />
                </button>
              </div>
            </div>
          ))}
        </div>

        {filteredStudents.length === 0 && (
          <div className="text-center py-8">
            <Icon name="Users" size={48} color="var(--color-muted-foreground)" />
            <h4 className="mt-4 text-lg font-medium text-foreground">No students found</h4>
            <p className="mt-2 text-sm text-muted-foreground">
              Try adjusting your search or filter criteria
            </p>
          </div>
        )}
      </div>
    </div>
  );
};

export default StudentManagementTools;