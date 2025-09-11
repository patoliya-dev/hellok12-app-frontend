import React, { useState, useEffect } from 'react';
import Icon from '../../../components/AppIcon';
import Button from '../../../components/ui/Button';

const GamificationElements = () => {
  const [gamificationData, setGamificationData] = useState({});
  const [recentActivities, setRecentActivities] = useState([]);

  useEffect(() => {
    // Mock gamification data
    const mockData = {
      currentLevel: 12,
      xpPoints: 2450,
      xpToNextLevel: 550,
      totalXP: 3000,
      learningStreak: 7,
      longestStreak: 15,
      coinsEarned: 1250,
      gemsCollected: 45,
      powerUps: {
        doubleXP: 3,
        streakFreeze: 2,
        hintBonus: 5
      },
      weeklyChallenge: {
        title: "Grammar Master",
        description: "Complete 10 grammar exercises this week",
        progress: 7,
        total: 10,
        reward: "50 XP + Grammar Badge",
        timeLeft: "3 days"
      },
      leaderboard: {
        position: 3,
        totalStudents: 150,
        pointsToNext: 125
      }
    };

    const mockActivities = [
      {
        id: 1,
        type: "xp_earned",
        title: "XP Earned",
        description: "Completed English Literature quiz",
        points: 50,
        icon: "Star",
        color: "text-yellow-500",
        timestamp: "5 minutes ago"
      },
      {
        id: 2,
        type: "streak_milestone",
        title: "Streak Milestone!",
        description: "7-day learning streak achieved",
        points: 100,
        icon: "Flame",
        color: "text-orange-500",
        timestamp: "2 hours ago"
      },
      {
        id: 3,
        type: "badge_earned",
        title: "New Badge",
        description: "Reading Champion badge unlocked",
        points: 75,
        icon: "Award",
        color: "text-purple-500",
        timestamp: "1 day ago"
      },
      {
        id: 4,
        type: "coins_earned",
        title: "Coins Earned",
        description: "Perfect score on Spanish quiz",
        points: 25,
        icon: "Coins",
        color: "text-yellow-600",
        timestamp: "2 days ago"
      }
    ];

    setGamificationData(mockData);
    setRecentActivities(mockActivities);
  }, []);

  const getProgressPercentage = () => {
    return (gamificationData.xpPoints / gamificationData.totalXP) * 100;
  };

  const getChallengeProgress = () => {
    if (!gamificationData.weeklyChallenge) return 0;
    return (gamificationData.weeklyChallenge.progress / gamificationData.weeklyChallenge.total) * 100;
  };

  return (
    <div className="space-y-6">
      {/* Level Progress Card */}
      <div className="bg-gradient-to-r from-primary/10 to-secondary/10 rounded-lg border border-primary/20 p-6">
        <div className="flex items-center justify-between mb-4">
          <div className="flex items-center space-x-3">
            <div className="w-12 h-12 bg-primary rounded-full flex items-center justify-center">
              <Icon name="Trophy" size={24} color="white" />
            </div>
            <div>
              <h2 className="text-xl font-bold text-foreground">Level {gamificationData.currentLevel}</h2>
              <p className="text-sm text-muted-foreground">Learning Champion</p>
            </div>
          </div>
          
          <div className="text-right">
            <div className="text-2xl font-bold text-primary">{gamificationData.xpPoints}</div>
            <div className="text-sm text-muted-foreground">XP Points</div>
          </div>
        </div>

        {/* XP Progress Bar */}
        <div className="mb-4">
          <div className="flex justify-between text-sm mb-2">
            <span className="text-muted-foreground">Progress to Level {gamificationData.currentLevel + 1}</span>
            <span className="text-foreground">{gamificationData.xpToNextLevel} XP to go</span>
          </div>
          <div className="w-full bg-muted rounded-full h-3 overflow-hidden">
            <div 
              className="h-full bg-gradient-to-r from-primary to-secondary transition-all duration-500"
              style={{ width: `${getProgressPercentage()}%` }}
            />
          </div>
        </div>

        {/* Stats Grid */}
        <div className="grid grid-cols-4 gap-3">
          <div className="text-center">
            <div className="flex items-center justify-center mb-1">
              <Icon name="Flame" size={16} color="var(--color-accent)" />
            </div>
            <div className="text-lg font-bold text-foreground">{gamificationData.learningStreak}</div>
            <div className="text-xs text-muted-foreground">Day Streak</div>
          </div>
          
          <div className="text-center">
            <div className="flex items-center justify-center mb-1">
              <Icon name="Coins" size={16} color="var(--color-warning)" />
            </div>
            <div className="text-lg font-bold text-foreground">{gamificationData.coinsEarned}</div>
            <div className="text-xs text-muted-foreground">Coins</div>
          </div>
          
          <div className="text-center">
            <div className="flex items-center justify-center mb-1">
              <Icon name="Gem" size={16} color="var(--color-success)" />
            </div>
            <div className="text-lg font-bold text-foreground">{gamificationData.gemsCollected}</div>
            <div className="text-xs text-muted-foreground">Gems</div>
          </div>
          
          <div className="text-center">
            <div className="flex items-center justify-center mb-1">
              <Icon name="Crown" size={16} color="var(--color-primary)" />
            </div>
            <div className="text-lg font-bold text-foreground">#{gamificationData.leaderboard?.position}</div>
            <div className="text-xs text-muted-foreground">Rank</div>
          </div>
        </div>
      </div>

      {/* Weekly Challenge */}
      {gamificationData.weeklyChallenge && (
        <div className="bg-card rounded-lg border border-border p-6">
          <div className="flex items-center justify-between mb-4">
            <div className="flex items-center space-x-2">
              <Icon name="Target" size={24} color="var(--color-accent)" />
              <h3 className="text-lg font-semibold text-foreground">Weekly Challenge</h3>
            </div>
            <div className="text-sm text-muted-foreground">
              {gamificationData.weeklyChallenge.timeLeft} left
            </div>
          </div>

          <div className="mb-4">
            <h4 className="font-medium text-foreground mb-1">
              {gamificationData.weeklyChallenge.title}
            </h4>
            <p className="text-sm text-muted-foreground mb-3">
              {gamificationData.weeklyChallenge.description}
            </p>
            
            <div className="flex justify-between text-sm mb-2">
              <span className="text-muted-foreground">Progress</span>
              <span className="text-foreground">
                {gamificationData.weeklyChallenge.progress}/{gamificationData.weeklyChallenge.total}
              </span>
            </div>
            
            <div className="w-full bg-muted rounded-full h-2 overflow-hidden">
              <div 
                className="h-full bg-accent transition-all duration-500"
                style={{ width: `${getChallengeProgress()}%` }}
              />
            </div>
          </div>

          <div className="flex items-center justify-between">
            <div className="flex items-center space-x-2">
              <Icon name="Gift" size={16} color="var(--color-success)" />
              <span className="text-sm text-success font-medium">
                Reward: {gamificationData.weeklyChallenge.reward}
              </span>
            </div>
            
            <Button variant="outline" size="sm">
              View Details
            </Button>
          </div>
        </div>
      )}

      {/* Power-ups */}
      <div className="bg-card rounded-lg border border-border p-6">
        <div className="flex items-center justify-between mb-4">
          <div className="flex items-center space-x-2">
            <Icon name="Zap" size={24} color="var(--color-warning)" />
            <h3 className="text-lg font-semibold text-foreground">Power-ups</h3>
          </div>
          <Button variant="outline" size="sm" iconName="ShoppingCart" iconPosition="left" iconSize={16}>
            Shop
          </Button>
        </div>

        <div className="grid grid-cols-3 gap-4">
          <div className="text-center p-3 bg-muted/50 rounded-lg">
            <div className="w-10 h-10 bg-yellow-100 rounded-full flex items-center justify-center mx-auto mb-2">
              <Icon name="Zap" size={20} color="var(--color-warning)" />
            </div>
            <div className="text-sm font-medium text-foreground">Double XP</div>
            <div className="text-xs text-muted-foreground mb-2">2x experience points</div>
            <div className="text-lg font-bold text-warning">{gamificationData.powerUps?.doubleXP}</div>
          </div>
          
          <div className="text-center p-3 bg-muted/50 rounded-lg">
            <div className="w-10 h-10 bg-blue-100 rounded-full flex items-center justify-center mx-auto mb-2">
              <Icon name="Shield" size={20} color="var(--color-primary)" />
            </div>
            <div className="text-sm font-medium text-foreground">Streak Freeze</div>
            <div className="text-xs text-muted-foreground mb-2">Protect your streak</div>
            <div className="text-lg font-bold text-primary">{gamificationData.powerUps?.streakFreeze}</div>
          </div>
          
          <div className="text-center p-3 bg-muted/50 rounded-lg">
            <div className="w-10 h-10 bg-green-100 rounded-full flex items-center justify-center mx-auto mb-2">
              <Icon name="Lightbulb" size={20} color="var(--color-success)" />
            </div>
            <div className="text-sm font-medium text-foreground">Hint Bonus</div>
            <div className="text-xs text-muted-foreground mb-2">Extra hints in games</div>
            <div className="text-lg font-bold text-success">{gamificationData.powerUps?.hintBonus}</div>
          </div>
        </div>
      </div>

      {/* Recent Activities */}
      <div className="bg-card rounded-lg border border-border p-6">
        <div className="flex items-center justify-between mb-4">
          <div className="flex items-center space-x-2">
            <Icon name="Activity" size={24} color="var(--color-primary)" />
            <h3 className="text-lg font-semibold text-foreground">Recent Activities</h3>
          </div>
        </div>

        <div className="space-y-3">
          {recentActivities.map((activity) => (
            <div
              key={activity.id}
              className="flex items-center justify-between p-3 bg-muted/30 rounded-lg hover:bg-muted/50 transition-micro"
            >
              <div className="flex items-center space-x-3">
                <div className={`w-8 h-8 rounded-full bg-white flex items-center justify-center ${activity.color}`}>
                  <Icon name={activity.icon} size={16} />
                </div>
                <div>
                  <div className="font-medium text-foreground text-sm">{activity.title}</div>
                  <div className="text-xs text-muted-foreground">{activity.description}</div>
                </div>
              </div>
              
              <div className="text-right">
                <div className="text-sm font-bold text-success">+{activity.points} XP</div>
                <div className="text-xs text-muted-foreground">{activity.timestamp}</div>
              </div>
            </div>
          ))}
        </div>

        <div className="mt-4 pt-4 border-t border-border">
          <Button variant="outline" size="sm" className="w-full">
            View All Activities
          </Button>
        </div>
      </div>
    </div>
  );
};

export default GamificationElements;