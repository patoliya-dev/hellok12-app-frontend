import React from 'react';
import ClassScheduleWidget from './ClassScheduleWidget';
import QuickActionsPanel from './QuickActionsPanel';
import RealtimeNotifications from './RealtimeNotifications';

const OverviewTab = () => {
  return (
    <div className="space-y-6">
      {/* Top Row - Schedule and Quick Actions */}
      <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
        <ClassScheduleWidget />
        <QuickActionsPanel />
      </div>

      {/* Bottom Row - Notifications */}
      <div className="grid grid-cols-1">
        <RealtimeNotifications />
      </div>
    </div>
  );
};

export default OverviewTab;