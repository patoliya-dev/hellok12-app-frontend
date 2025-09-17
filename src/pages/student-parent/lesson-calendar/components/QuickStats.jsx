import React from 'react';

const StatItem = ({ label, value, color }) => (
  <div className="flex items-center justify-between">
    <span className="text-sm text-muted-foreground">{label}</span>
    <span className={`font-medium text-${color ? color : 'foreground'}`}>{value}</span>
  </div>
);

const QuickStats = ({ stats }) => {
  return (
    <div className="bg-card p-6 rounded-lg border border-border">
      <h3 className="font-semibold text-foreground">Quick Stats</h3>
      <div className="mt-4 space-y-3">
        <StatItem label="Total Lessons" value={stats.total} />
        <StatItem label="Pending" value={stats.pending} color={'accent'} />
        <StatItem label="Completed" value={stats.completed} color={'secondary'} />
      </div>
    </div>
  );
};

export default QuickStats;
