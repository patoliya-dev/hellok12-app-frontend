import React, { useState, useEffect } from 'react';
import Icon from '../../../components/AppIcon';
import Button from '../../../components/ui/Button';

const ProgressTrackingSection = () => {
  const [progressData, setProgressData] = useState({});
  const [achievements, setAchievements] = useState([]);

  useEffect(() => {
    // Mock progress data
    const mockProgress = {
      currentLevel: 12,
      xpPoints: 2450,
      xpToNextLevel: 550,
      learningStreak: 7,
      completedLessons: 45,
      totalLessons: 60,
      weeklyGoal: 5,
      weeklyCompleted: 3,
      weeklyHours: 12.5,
      subjects: [
        {
          name: "English",
          progress: 85,
          color: "bg-blue-500",
          lessons: 18,
          totalLessons: 20
        },
        {
          name: "Spanish",
          progress: 72,
          color: "bg-green-500",
          lessons: 15,
          totalLessons: 20
        },
        {
          name: "Japanese",
          progress: 60,
          color: "bg-purple-500",
          lessons: 12,
          totalLessons: 20
        }
      ]
    };

    const mockAchievements = [
      {
        id: 1,
        title: "Reading Champion",
        description: "Complete 10 reading exercises",
        icon: "BookOpen",
        color: "text-blue-500",
        bgColor: "bg-blue-100",
        earned: true,
        earnedDate: "2025-07-28"
      },
      {
        id: 2,
        title: "Streak Master",
        description: "7-day learning streak",
        icon: "Flame",
        color: "text-orange-500",
        bgColor: "bg-orange-100",
        earned: true,
        earnedDate: "2025-07-30"
      },
      {
        id: 3,
        title: "Grammar Guru",
        description: "Perfect score on 5 grammar tests",
        icon: "Award",
        color: "text-yellow-500",
        bgColor: "bg-yellow-100",
        earned: true,
        earnedDate: "2025-07-25"
      },
      {
        id: 4,
        title: "Conversation King",
        description: "Complete 20 speaking sessions",
        icon: "MessageCircle",
        color: "text-green-500",
        bgColor: "bg-green-100",
        earned: false,
        progress: 15,
        total: 20
      },
      {
        id: 5,
        title: "Quiz Master",
        description: "Score 90%+ on 10 quizzes",
        icon: "Brain",
        color: "text-purple-500",
        bgColor: "bg-purple-100",
        earned: false,
        progress: 7,
        total: 10
      }
    ];

    setProgressData(mockProgress);
    setAchievements(mockAchievements);
  }, []);

  const getProgressPercentage = () => {
    const totalXP = progressData.xpPoints + progressData.xpToNextLevel;
    return ((progressData.xpPoints / totalXP) * 100).toFixed(0);
  };

  return (
    <div className="space-y-6">
      {/* Level and XP Progress */}
      <div className="bg-card rounded-lg border border-border p-6">
        <div className="flex items-center justify-between mb-4">
          <div className="flex items-center space-x-2">
            <Icon name="Trophy" size={24} color="var(--color-primary)" />
            <h2 className="text-xl font-semibold text-foreground">Your Progress</h2>
          </div>
          <div className="text-right">
            <div className="text-sm font-bold text-primary">View Details</div>
          </div>
        </div>

        {/* XP Progress Bar */}
        {/* <div className="mb-6">
          <div className="flex justify-between text-sm mb-2">
            <span className="text-muted-foreground">Progress to Level {progressData.currentLevel + 1}</span>
            <span className="text-foreground">{  .xpToNextLevel} XP to go</span>
          </div>
          <div className="w-full bg-muted rounded-full h-3 overflow-hidden">
            <div 
              className="h-full bg-gradient-to-r from-primary to-secondary transition-all duration-500"
              style={{ width: `${getProgressPercentage()}%` }}
            />
          </div>
        </div> */}
        <div className='text-center'>
          <div className="relative w-20 h-20 mx-auto mb-3">
            <svg className="w-20 h-20 transform -rotate-90 z-1000" viewBox="0 0 36 36">
              <path
                className="text-muted stroke-current"
                strokeWidth="3"
                fill="none"
                d="M18 2.0845 a 15.9155 15.9155 0 0 1 0 31.831 a 15.9155 15.9155 0 0 1 0 -31.831"
              />
              <path
                className={`text-blue-500 stroke-current`}
                strokeWidth="3"
                strokeLinecap="round"
                fill="none"
                strokeDasharray={`${getProgressPercentage()}, 100`}
                d="M18 2.0845 a 15.9155 15.9155 0 0 1 0 31.831 a 15.9155 15.9155 0 0 1 0 -31.831"
              />
            </svg>
            <div className="absolute inset-0 flex items-center justify-center z-1000">
              <span className="text-sm font-semibold text-foreground">{getProgressPercentage()}%</span>
            </div>
          </div>
          <p className="text-sm font-medium text-foreground">Overall Progress</p>
        </div>

        {/* Stats Grid */}
        <div className="grid grid-cols-2 lg:grid-cols-3 gap-3">
          <div className="text-center p-3 bg-muted/50 rounded-lg">
            <div className="flex items-center justify-center mb-2">
              <Icon name="CalendarClock" size={20} color="var(--color-purple)" />
            </div>
            <div className="text-lg font-semibold text-foreground">{progressData.learningStreak}</div>
            <div className="text-xs text-muted-foreground">Upcoming Lessons</div>
          </div>

          <div className="text-center p-3 bg-muted/50 rounded-lg">
            <div className="flex items-center justify-center mb-2">
              <Icon name="BookOpen" size={20} color="var(--color-success)" />
            </div>
            <div className="text-lg font-semibold text-foreground">{progressData.completedLessons}</div>
            <div className="text-xs text-muted-foreground">Lessons Done</div>
          </div>

          <div className="text-center p-3 bg-muted/50 rounded-lg">
            <div className="flex items-center justify-center mb-2">
              <Icon name="Clock4" size={20} color="var(--color-primary)" />
            </div>
            <div className="text-lg font-semibold text-foreground">{progressData.weeklyHours} hrs</div>
            <div className="text-xs text-muted-foreground">Learning Time</div>
            <div className="text-xs text-muted-foreground">This Week</div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default ProgressTrackingSection;