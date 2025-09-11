import React, { useState, useEffect } from 'react';
import Icon from '../../../components/AppIcon';
import Image from '../../../components/AppImage';
import Button from '../../../components/ui/Button';

const RecentFeedbackCard = () => {
  const [feedbackData, setFeedbackData] = useState([]);

  useEffect(() => {
    // Mock recent feedback data
    const mockFeedback = [
      {
        id: 1,
        teacher: {
          name: "Ms. Sarah Johnson",
          avatar: "https://images.unsplash.com/photo-1494790108755-2616b612b786?w=150&h=150&fit=crop&crop=face",
          subject: "English Literature"
        },
        session: {
          date: "2025-07-29",
          topic: "Shakespeare\'s Romeo and Juliet"
        },
        rating: 5,
        feedback: `Excellent work on analyzing the character development in Act 2! Your understanding of the themes has improved significantly. Keep up the great effort with your reading comprehension.`,
        strengths: ["Reading Comprehension", "Critical Analysis", "Participation"],
        improvements: ["Vocabulary Building"],
        timestamp: "2 hours ago"
      },
      {
        id: 2,
        teacher: {
          name: "Mr. Carlos Rodriguez",
          avatar: "https://images.unsplash.com/photo-1472099645785-5658abf4ff4e?w=150&h=150&fit=crop&crop=face",
          subject: "Spanish Conversation"
        },
        session: {
          date: "2025-07-28",
          topic: "Daily Routines and Time Expressions"
        },
        rating: 4,
        feedback: `Great progress with pronunciation! You're becoming more confident in speaking. Focus on verb conjugations for our next session.`,
        strengths: ["Pronunciation", "Confidence", "Listening Skills"],
        improvements: ["Grammar", "Verb Conjugations"],
        timestamp: "1 day ago"
      },
      {
        id: 3,
        teacher: {
          name: "Ms. Yuki Tanaka",
          avatar: "https://images.unsplash.com/photo-1438761681033-6461ffad8d80?w=150&h=150&fit=crop&crop=face",
          subject: "Japanese Writing"
        },
        session: {
          date: "2025-07-27",
          topic: "Hiragana and Katakana Practice"
        },
        rating: 5,
        feedback: `Outstanding improvement in your character writing! Your stroke order is perfect and your handwriting is very neat. Ready for more complex characters.`,
        strengths: ["Character Writing", "Stroke Order", "Attention to Detail"],
        improvements: ["Reading Speed"],
        timestamp: "2 days ago"
      }
    ];

    setFeedbackData(mockFeedback);
  }, []);

  const renderStars = (rating) => {
    return Array.from({ length: 5 }, (_, index) => (
      <Icon
        key={index}
        name="Star"
        size={16}
        color={index < rating ? "var(--color-warning)" : "var(--color-muted-foreground)"}
        className={index < rating ? "fill-current" : ""}
      />
    ));
  };

  const getMotivationalMessage = (rating) => {
    if (rating === 5) return "Excellent work! 🌟";
    if (rating === 4) return "Great job! 👏";
    if (rating === 3) return "Good effort! 👍";
    return "Keep trying! 💪";
  };

  return (
    <div className="bg-card rounded-lg border border-border p-6">
      <div className="flex items-center justify-between mb-6">
        <div className="flex items-center space-x-2">
          <Icon name="MessageSquare" size={24} color="var(--color-primary)" />
          <h2 className="text-xl font-semibold text-foreground">Recent Feedback</h2>
        </div>
        <Button
          variant="outline"
          size="sm"
          iconName="Eye"
          iconPosition="left"
          iconSize={16}
        >
          View All
        </Button>
      </div>

      {feedbackData.length === 0 ? (
        <div className="text-center py-8">
          <Icon name="MessageSquare" size={48} color="var(--color-muted-foreground)" />
          <p className="text-muted-foreground mt-4">No feedback yet</p>
          <p className="text-sm text-muted-foreground">Complete a session to receive feedback!</p>
        </div>
      ) : (
        <div className="space-y-6">
          {feedbackData.map((feedback) => (
            <div
              key={feedback.id}
              className="p-4 rounded-lg border border-border bg-muted/30 hover:bg-muted/50 transition-micro"
            >
              {/* Teacher Info and Rating */}
              <div className="flex items-start justify-between mb-4">
                <div className="flex items-center space-x-3">
                  <div className="w-12 h-12 rounded-full overflow-hidden bg-muted">
                    <Image
                      src={feedback.teacher.avatar}
                      alt={feedback.teacher.name}
                      className="w-full h-full object-cover"
                    />
                  </div>
                  <div>
                    <h3 className="font-medium text-foreground">{feedback.teacher.name}</h3>
                    <p className="text-sm text-muted-foreground">{feedback.teacher.subject}</p>
                    <p className="text-xs text-muted-foreground">{feedback.timestamp}</p>
                  </div>
                </div>
                
                <div className="text-right">
                  <div className="flex items-center space-x-1 mb-1">
                    {renderStars(feedback.rating)}
                  </div>
                  <div className="text-sm font-medium text-success">
                    {getMotivationalMessage(feedback.rating)}
                  </div>
                </div>
              </div>

              {/* Session Info */}
              <div className="mb-4 p-3 bg-card rounded-lg border border-border">
                <div className="flex items-center justify-between">
                  <div className="flex items-center space-x-2">
                    <Icon name="BookOpen" size={16} color="var(--color-primary)" />
                    <span className="text-sm font-medium text-foreground">
                      {feedback.session.topic}
                    </span>
                  </div>
                  <span className="text-xs text-muted-foreground">
                    {new Date(feedback.session.date).toLocaleDateString()}
                  </span>
                </div>
              </div>

              {/* Feedback Text */}
              <div className="mb-4">
                <p className="text-sm text-foreground leading-relaxed">
                  {feedback.feedback}
                </p>
              </div>

              {/* Strengths and Improvements */}
              <div className="grid grid-cols-1 lg:grid-cols-2 gap-4 mb-4">
                {/* Strengths */}
                <div>
                  <div className="flex items-center space-x-2 mb-2">
                    <Icon name="CheckCircle" size={16} color="var(--color-success)" />
                    <span className="text-sm font-medium text-success">Strengths</span>
                  </div>
                  <div className="flex flex-wrap gap-1">
                    {feedback.strengths.map((strength, index) => (
                      <span
                        key={index}
                        className="px-2 py-1 bg-success/10 text-success text-xs rounded-full border border-success/20"
                      >
                        {strength}
                      </span>
                    ))}
                  </div>
                </div>

                {/* Areas for Improvement */}
                <div>
                  <div className="flex items-center space-x-2 mb-2">
                    <Icon name="Target" size={16} color="var(--color-warning)" />
                    <span className="text-sm font-medium text-warning">Focus Areas</span>
                  </div>
                  <div className="flex flex-wrap gap-1">
                    {feedback.improvements.map((improvement, index) => (
                      <span
                        key={index}
                        className="px-2 py-1 bg-warning/10 text-warning text-xs rounded-full border border-warning/20"
                      >
                        {improvement}
                      </span>
                    ))}
                  </div>
                </div>
              </div>

              {/* Action Buttons */}
              <div className="flex space-x-2">
                <Button
                  variant="ghost"
                  size="sm"
                  iconName="MessageCircle"
                  iconPosition="left"
                  iconSize={14}
                  className="flex-1"
                >
                  Reply
                </Button>
                
                <Button
                  variant="ghost"
                  size="sm"
                  iconName="Heart"
                  iconPosition="left"
                  iconSize={14}
                  className="flex-1"
                >
                  Thank Teacher
                </Button>
                
                <Button
                  variant="ghost"
                  size="sm"
                  iconName="Share"
                  iconPosition="left"
                  iconSize={14}
                  className="flex-1"
                >
                  Share
                </Button>
              </div>
            </div>
          ))}
        </div>
      )}

      {/* Feedback Summary */}
      {feedbackData.length > 0 && (
        <div className="mt-6 pt-6 border-t border-border">
          <div className="grid grid-cols-3 gap-4 text-center">
            <div>
              <div className="text-lg font-semibold text-success">
                {(feedbackData.reduce((sum, f) => sum + f.rating, 0) / feedbackData.length).toFixed(1)}
              </div>
              <div className="text-xs text-muted-foreground">Avg Rating</div>
            </div>
            <div>
              <div className="text-lg font-semibold text-primary">
                {feedbackData.length}
              </div>
              <div className="text-xs text-muted-foreground">Total Reviews</div>
            </div>
            <div>
              <div className="text-lg font-semibold text-warning">
                {feedbackData.filter(f => f.rating === 5).length}
              </div>
              <div className="text-xs text-muted-foreground">5-Star Reviews</div>
            </div>
          </div>
        </div>
      )}
    </div>
  );
};

export default RecentFeedbackCard;