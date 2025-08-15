import React from 'react';
import Icon from '../../../components/AppIcon';

const AcademicSummaryCard = ({ title, value, subtitle, icon, trend, color = "primary" }) => {
  const getColorClasses = (colorType) => {
    const colors = {
      primary: "bg-primary/10 text-primary border-primary/20",
      success: "bg-success/10 text-success border-success/20",
      warning: "bg-warning/10 text-warning border-warning/20",
      error: "bg-error/10 text-error border-error/20"
    };
    return colors[colorType] || colors.primary;
  };

  const getTrendIcon = () => {
    if (trend > 0) return { name: "TrendingUp", color: "var(--color-success)" };
    if (trend < 0) return { name: "TrendingDown", color: "var(--color-error)" };
    return { name: "Minus", color: "var(--color-muted-foreground)" };
  };

  const trendIcon = getTrendIcon();

  return (
    <div className="bg-card rounded-lg border border-border p-6 shadow-subtle hover:shadow-elevated transition-smooth">
      <div className="flex items-center justify-between mb-4">
        <div className={`w-12 h-12 rounded-lg flex items-center justify-center ${getColorClasses(color)}`}>
          <Icon name={icon} size={24} />
        </div>
        {trend !== undefined && (
          <div className="flex items-center space-x-1">
            <Icon name={trendIcon.name} size={16} color={trendIcon.color} />
            <span className={`text-sm font-medium ${trend > 0 ? 'text-success' : trend < 0 ? 'text-error' : 'text-muted-foreground'}`}>
              {Math.abs(trend)}%
            </span>
          </div>
        )}
      </div>
      
      <div className="space-y-1">
        <h3 className="text-2xl font-bold text-foreground">{value}</h3>
        <p className="text-sm font-medium text-foreground">{title}</p>
        {subtitle && (
          <p className="text-xs text-muted-foreground">{subtitle}</p>
        )}
      </div>
    </div>
  );
};

export default AcademicSummaryCard;