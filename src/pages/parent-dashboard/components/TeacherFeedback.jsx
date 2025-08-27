import React, { useState } from 'react';
import Icon from '../../../components/AppIcon';
import Button from '../../../components/ui/Button';
import Image from '../../../components/AppImage';

const TeacherFeedback = () => {
  const [expandedFeedback, setExpandedFeedback] = useState(null);

  const feedback = [
    {
      id: 1,
      teacher: "Ms. Rodriguez",
      subject: "Mathematics",
      avatar: "https://images.unsplash.com/photo-1494790108755-2616b612b786?w=100&h=100&fit=crop&crop=face",
      date: "2025-07-28",
      type: "positive",
      title: "Excellent Progress in Algebra",
      message: `Emma has shown remarkable improvement in algebraic concepts this month. Her problem-solving approach has become more systematic and she's demonstrating strong analytical thinking.\n\nShe actively participates in class discussions and helps other students understand complex problems. I'm particularly impressed with her work on quadratic equations.\n\nRecommendation: Continue with the current pace and consider advanced problem sets for additional challenge.`,
      rating: 5
    },
    {
      id: 2,
      teacher: "Mr. Thompson",
      subject: "Science",
      avatar: "https://images.unsplash.com/photo-1472099645785-5658abf4ff4e?w=100&h=100&fit=crop&crop=face",
      date: "2025-07-26",
      type: "constructive",
      title: "Lab Work Improvement Needed",
      message: `Emma shows great enthusiasm for science concepts but needs to focus more on following lab procedures carefully.\n\nHer theoretical understanding is excellent, but practical application requires more attention to detail. She sometimes rushes through experiments without proper observation.\n\nRecommendation: Encourage slower, more methodical approach to lab work. Consider additional practice with measurement tools.`,
      rating: 3
    },
    {
      id: 3,
      teacher: "Mrs. Davis",
      subject: "English",
      avatar: "https://images.unsplash.com/photo-1438761681033-6461ffad8d80?w=100&h=100&fit=crop&crop=face",
      date: "2025-07-25",
      type: "positive",
      title: "Outstanding Creative Writing",
      message: `Emma's creative writing has flourished this semester. Her recent short story submission demonstrated sophisticated vocabulary and compelling narrative structure.\n\nShe shows excellent understanding of literary devices and applies them effectively in her own work. Her peer review contributions are thoughtful and constructive.\n\nRecommendation: Consider entering her work in the school's literary magazine competition.`,
      rating: 5
    }
  ];

  const getFeedbackTypeColor = (type) => {
    const colors = {
      positive: "text-success bg-success/10 border-success/20",
      constructive: "text-warning bg-warning/10 border-warning/20",
      concern: "text-error bg-error/10 border-error/20"
    };
    return colors[type] || colors.positive;
  };

  const getRatingStars = (rating) => {
    return Array.from({ length: 5 }, (_, index) => (
      <Icon
        key={index}
        name={index < rating ? "Star" : "Star"}
        size={14}
        color={index < rating ? "var(--color-warning)" : "var(--color-muted-foreground)"}
        className={index < rating ? "fill-current" : ""}
      />
    ));
  };

  const toggleExpanded = (id) => {
    setExpandedFeedback(expandedFeedback === id ? null : id);
  };

  return (
    <div className="bg-card rounded-lg border border-border shadow-subtle">
      <div className="p-6 border-b border-border">
        <div className="flex items-center justify-between">
          <h2 className="text-lg font-semibold text-foreground">Teacher Feedback</h2>
          <Button variant="ghost" size="sm" iconName="MessageSquare">
            Message Teachers
          </Button>
        </div>
      </div>

      <div className="divide-y divide-border max-h-96 overflow-y-auto">
        {feedback.map((item) => (
          <div key={item.id} className="p-6">
            <div className="flex items-start space-x-4">
              <div className="w-12 h-12 rounded-full overflow-hidden bg-muted flex-shrink-0">
                <Image
                  src={item.avatar}
                  alt={item.teacher}
                  className="w-full h-full object-cover"
                />
              </div>
              
              <div className="flex-1 min-w-0">
                <div className="flex items-center justify-between mb-2">
                  <div>
                    <h3 className="font-medium text-foreground">{item.teacher}</h3>
                    <div className="flex items-center space-x-2 text-sm text-muted-foreground">
                      <span>{item.subject}</span>
                      <span>•</span>
                      <span>{new Date(item.date).toLocaleDateString()}</span>
                    </div>
                  </div>
                  
                  <div className="flex items-center space-x-2">
                    <div className="flex items-center space-x-1">
                      {getRatingStars(item.rating)}
                    </div>
                    <div className={`px-2 py-1 rounded-full border text-xs font-medium ${getFeedbackTypeColor(item.type)}`}>
                      {item.type === 'positive' ? 'Positive' : item.type === 'constructive' ? 'Constructive' : 'Concern'}
                    </div>
                  </div>
                </div>

                <h4 className="font-medium text-foreground mb-2">{item.title}</h4>
                
                <div className="text-sm text-muted-foreground">
                  {expandedFeedback === item.id ? (
                    <div className="whitespace-pre-line">{item.message}</div>
                  ) : (
                    <div className="line-clamp-2">{item.message}</div>
                  )}
                </div>

                <div className="mt-3 flex items-center justify-between">
                  <Button
                    variant="ghost"
                    size="sm"
                    onClick={() => toggleExpanded(item.id)}
                    iconName={expandedFeedback === item.id ? "ChevronUp" : "ChevronDown"}
                  >
                    {expandedFeedback === item.id ? "Show Less" : "Read More"}
                  </Button>
                  
                  <div className="flex items-center space-x-2">
                    <Button variant="ghost" size="sm" iconName="Reply">
                      Reply
                    </Button>
                    <Button variant="ghost" size="sm" iconName="Calendar">
                      Schedule Meeting
                    </Button>
                  </div>
                </div>
              </div>
            </div>
          </div>
        ))}
      </div>
    </div>
  );
};

export default TeacherFeedback;