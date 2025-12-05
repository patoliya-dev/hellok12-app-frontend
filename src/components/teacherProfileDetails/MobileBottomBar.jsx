import React from 'react';
import Button from '../../components/ui/Button';

const MobileBottomBar = ({
  onViewAllClasses,
  onQuickContact,
  classCount
}) => {
  return (
    <div className="fixed bottom-0 left-0 right-0 bg-card border-t border-border p-4 lg:hidden z-50">
      <div className="flex items-center gap-3">
        <Button
          variant="outline"
          size="lg"
          iconName="MessageCircle"
          className="flex-1"
          onClick={onQuickContact}
        >
          Contact
        </Button>
        <Button
          variant="default"
          size="lg"
          iconName="Calendar"
          iconPosition="left"
          className="flex-2"
          onClick={onViewAllClasses}
        >
          View Classes ({classCount})
        </Button>
      </div>
    </div>
  );
};

export default MobileBottomBar;
