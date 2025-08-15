import React, { useState } from 'react';
import Icon from '../../../components/AppIcon';

const ClassScheduleWidget = () => {
  const [selectedDate, setSelectedDate] = useState(new Date());
  
  const todayClasses = [
    {
      id: 1,
      subject: "Mathematics",
      grade: "Grade 10A",
      time: "09:00 - 10:30",
      room: "Room 201",
      enrolled: 28,
      status: "current"
    },
    {
      id: 2,
      subject: "Physics",
      grade: "Grade 11B",
      time: "11:00 - 12:30",
      room: "Lab 3",
      enrolled: 24,
      status: "upcoming"
    },
    {
      id: 3,
      subject: "Mathematics",
      grade: "Grade 9C",
      time: "14:00 - 15:30",
      room: "Room 201",
      enrolled: 26,
      status: "upcoming"
    }
  ];

  const getStatusColor = (status) => {
    switch (status) {
      case 'current':
        return 'bg-success/10 text-success border-success/20';
      case 'upcoming':
        return 'bg-primary/10 text-primary border-primary/20';
      default:
        return 'bg-muted text-muted-foreground border-border';
    }
  };

  return (
    <div className="bg-card rounded-lg border border-border p-6 shadow-subtle">
      <div className="flex items-center justify-between mb-6">
        <h3 className="text-lg font-semibold text-foreground">Today's Schedule</h3>
        <div className="flex items-center space-x-2">
          <button className="p-2 text-muted-foreground hover:text-foreground hover:bg-muted rounded-lg transition-smooth">
            <Icon name="Calendar" size={16} />
          </button>
          <button className="p-2 text-muted-foreground hover:text-foreground hover:bg-muted rounded-lg transition-smooth">
            <Icon name="MoreHorizontal" size={16} />
          </button>
        </div>
      </div>

      <div className="space-y-4">
        {todayClasses.map((classItem) => (
          <div
            key={classItem.id}
            className={`p-4 rounded-lg border transition-smooth hover:shadow-sm ${getStatusColor(classItem.status)}`}
          >
            <div className="flex items-center justify-between mb-2">
              <div className="flex items-center space-x-3">
                <div className="w-10 h-10 bg-primary/10 rounded-lg flex items-center justify-center">
                  <Icon name="BookOpen" size={20} color="var(--color-primary)" />
                </div>
                <div>
                  <h4 className="font-medium text-foreground">{classItem.subject}</h4>
                  <p className="text-sm text-muted-foreground">{classItem.grade}</p>
                </div>
              </div>
              {classItem.status === 'current' && (
                <span className="px-2 py-1 bg-success text-success-foreground text-xs rounded-full">
                  Live
                </span>
              )}
            </div>
            
            <div className="flex items-center justify-between text-sm">
              <div className="flex items-center space-x-4">
                <span className="flex items-center space-x-1 text-muted-foreground">
                  <Icon name="Clock" size={14} />
                  <span>{classItem.time}</span>
                </span>
                <span className="flex items-center space-x-1 text-muted-foreground">
                  <Icon name="MapPin" size={14} />
                  <span>{classItem.room}</span>
                </span>
                <span className="flex items-center space-x-1 text-muted-foreground">
                  <Icon name="Users" size={14} />
                  <span>{classItem.enrolled} students</span>
                </span>
              </div>
              
              <div className="flex items-center space-x-2">
                <button className="p-1 text-muted-foreground hover:text-foreground transition-smooth">
                  <Icon name="UserCheck" size={16} />
                </button>
                <button className="p-1 text-muted-foreground hover:text-foreground transition-smooth">
                  <Icon name="MessageSquare" size={16} />
                </button>
              </div>
            </div>
          </div>
        ))}
      </div>

      <div className="mt-6 pt-4 border-t border-border">
        <button className="w-full flex items-center justify-center space-x-2 py-2 text-sm text-primary hover:bg-primary/10 rounded-lg transition-smooth">
          <Icon name="Calendar" size={16} />
          <span>View Full Schedule</span>
        </button>
      </div>
    </div>
  );
};

export default ClassScheduleWidget;