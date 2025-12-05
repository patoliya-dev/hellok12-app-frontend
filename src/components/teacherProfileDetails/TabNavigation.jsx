import React from "react";
import Icon from "../../components/ui/Icon";

const TabNavigation = ({ activeTab, onTabChange, classesBadgeCount = 0, reviewsBadgeCount = 0 }) => {
  const tabs = [
    { id: "about", label: "About", icon: "User" },
    { id: "courses", label: "Courses", icon: "BookOpen", badge: classesBadgeCount },
    { id: "reviews", label: "Reviews", icon: "Star", badge: reviewsBadgeCount },
    { id: "highlights", label: "Highlights", icon: "Clapperboard" }
  ];

  return (
    <div className="bg-card border-b border-border sticky top-16 z-50">
      <div className="max-w-7xl mx-auto px-4 lg:px-6">
        <nav className="flex" role="tablist">
          {tabs.map((tab) => (
            <button
              key={tab.id}
              role="tab"
              aria-selected={activeTab === tab.id}
              aria-controls={`${tab.id}-panel`}
              className={`flex items-center gap-2 px-4 py-4 text-sm font-medium border-b-2 transition-smooth ${activeTab === tab.id
                ? "text-primary border-primary"
                : "text-text-secondary border-transparent hover:text-foreground hover:border-border"
                }`}
              onClick={() => onTabChange(tab.id)}
            >
              <Icon name={tab.icon} size={16} />
              <span>{tab.label}</span>
            </button>
          ))}
        </nav>
      </div>
    </div>
  );
};

export default TabNavigation;
