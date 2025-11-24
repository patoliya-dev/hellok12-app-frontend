import React from "react";
import Icon from "../../../../components/AppIcon";

const MetricsCard = ({
  title,
  value,
  subtitle,
  icon,
  trend,
  trendValue,
  color = "primary",
}) => {
  const colorClasses = {
    primary: "bg-primary/10 text-primary border-primary/20",
    success: "bg-success/10 text-success border-success/20",
    warning: "bg-warning/10 text-warning border-warning/20",
    accent: "bg-accent/10 text-accent border-accent/20",
  };

  return (
    <div className="bg-card border border-border rounded-lg p-6 shadow-soft hover:shadow-elevated transition-smooth">
      <div className="flex items-start justify-between">
        <div className="flex-1">
          <p className="text-sm font-medium text-muted-foreground mb-1">
            {title}
          </p>
          <p className="text-3xl font-bold text-foreground mb-2">{value}</p>
          {subtitle && (
            <p className="text-sm text-muted-foreground">{subtitle}</p>
          )}
        </div>
        <div
          className={`w-12 h-12 rounded-lg flex items-center justify-center ${colorClasses?.[color]}`}
        >
          <Icon name={icon} size={24} />
        </div>
      </div>
    </div>
  );
};

export default MetricsCard;
