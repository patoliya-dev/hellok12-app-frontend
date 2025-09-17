import React from 'react';
import { cn } from '../../../../utils/cn'; // Assuming you have this utility for className merging

const WidgetCard = ({ title, value, leftIcon, rightIcon, className, children, titleStyle }) => (
  <div className={cn("bg-card rounded-md justify-around shadow-subtle p-4 flex flex-col", className)}>
    <div className="flex items-center justify-between space-x-2 mb-2">
      {leftIcon}
      <h3 className={cn("text-body2 font-medium text-foreground", titleStyle)}>{title}</h3>
      {rightIcon}
    </div>
    {children || <p className="text-h5 font-bold text-foreground">{value}</p>}
  </div>
);

export default WidgetCard;
