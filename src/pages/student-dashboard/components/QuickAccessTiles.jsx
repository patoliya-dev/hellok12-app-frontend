import React from 'react';
import { useNavigate } from 'react-router-dom';
import Icon from '../../../components/AppIcon';
import Button from '../../../components/ui/Button';

const QuickAccessTiles = () => {
  const navigate = useNavigate();

  const quickAccessItems = [
    {
      id: 1,
      title: "Join Virtual Classroom",
      description: "Enter your live session",
      icon: "Video",
      color: "text-blue-500",
      bgColor: "bg-blue-50",
      borderColor: "border-blue-200",
      action: () => {
        // Mock join classroom action
        window.open('https://meet.google.com/sample-room', '_blank');
      },
      badge: "Live",
      badgeColor: "bg-red-500"
    },
    {
      id: 2,
      title: "Curriculum Materials",
      description: "Access your learning content",
      icon: "BookOpen",
      color: "text-green-500",
      bgColor: "bg-green-50",
      borderColor: "border-green-200",
      action: () => {
        // Navigate to curriculum section
        console.log('Navigate to curriculum');
      },
      badge: "Updated",
      badgeColor: "bg-green-500"
    },
    {
      id: 3,
      title: "Educational Games",
      description: "Play and learn together",
      icon: "Gamepad2",
      color: "text-purple-500",
      bgColor: "bg-purple-50",
      borderColor: "border-purple-200",
      action: () => {
        // Navigate to games section
        console.log('Navigate to games');
      },
      badge: "New",
      badgeColor: "bg-purple-500"
    },
    {
      id: 4,
      title: "Book New Session",
      description: "Schedule your next lesson",
      icon: "Calendar",
      color: "text-orange-500",
      bgColor: "bg-orange-50",
      borderColor: "border-orange-200",
      action: () => {
        navigate('/booking-system');
      }
    },
    {
      id: 5,
      title: "Messages",
      description: "Chat with teachers & classmates",
      icon: "MessageCircle",
      color: "text-indigo-500",
      bgColor: "bg-indigo-50",
      borderColor: "border-indigo-200",
      action: () => {
        console.log('Navigate to messages');
      },
      badge: "3",
      badgeColor: "bg-red-500"
    },
    {
      id: 6,
      title: "Homework & Assignments",
      description: "View pending tasks",
      icon: "FileText",
      color: "text-teal-500",
      bgColor: "bg-teal-50",
      borderColor: "border-teal-200",
      action: () => {
        console.log('Navigate to assignments');
      },
      badge: "2 Due",
      badgeColor: "bg-yellow-500"
    }
  ];

  return (
    <div className="bg-card rounded-lg border border-border p-6">
      <div className="flex items-center justify-between mb-6">
        <div className="flex items-center space-x-2">
          <Icon name="Zap" size={24} color="var(--color-primary)" />
          <h2 className="text-xl font-semibold text-foreground">Quick Access</h2>
        </div>
      </div>

      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-4">
        {quickAccessItems.map((item) => (
          <div
            key={item.id}
            className={`relative p-4 rounded-lg border-2 ${item.borderColor} ${item.bgColor} hover:shadow-soft transition-all duration-200 cursor-pointer group`}
            onClick={item.action}
          >
            {/* Badge */}
            {item.badge && (
              <div className={`absolute -top-2 -right-2 ${item.badgeColor} text-white text-xs px-2 py-1 rounded-full font-medium`}>
                {item.badge}
              </div>
            )}

            {/* Icon */}
            <div className="flex items-center justify-center w-12 h-12 rounded-lg bg-white mb-4 group-hover:scale-110 transition-transform duration-200">
              <Icon name={item.icon} size={24} color={item.color.replace('text-', 'var(--color-')} />
            </div>

            {/* Content */}
            <div className="space-y-2">
              <h3 className="font-semibold text-foreground group-hover:text-primary transition-colors">
                {item.title}
              </h3>
              <p className="text-sm text-muted-foreground">
                {item.description}
              </p>
            </div>

            {/* Hover Arrow */}
            <div className="absolute bottom-4 right-4 opacity-0 group-hover:opacity-100 transition-opacity duration-200">
              <Icon name="ArrowRight" size={16} color="var(--color-primary)" />
            </div>
          </div>
        ))}
      </div>

      {/* Additional Actions */}
      <div className="mt-6 pt-6 border-t border-border">
        <div className="flex flex-col sm:flex-row gap-3">
          <Button
            variant="outline"
            size="sm"
            iconName="HelpCircle"
            iconPosition="left"
            iconSize={16}
            className="flex-1"
          >
            Need Help?
          </Button>
          
          <Button
            variant="outline"
            size="sm"
            iconName="Settings"
            iconPosition="left"
            iconSize={16}
            className="flex-1"
          >
            Settings
          </Button>
          
          <Button
            variant="default"
            size="sm"
            iconName="Star"
            iconPosition="left"
            iconSize={16}
            className="flex-1"
          >
            Rate App
          </Button>
        </div>
      </div>
    </div>
  );
};

export default QuickAccessTiles;