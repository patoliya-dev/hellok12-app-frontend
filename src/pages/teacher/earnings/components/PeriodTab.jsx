import React from "react";
import { periods } from "../data";

const PeriodTabs = ({ selectedPeriod, onPeriodChange }) => {
  return (
    <div className="bg-muted rounded-lg p-1 inline-flex">
      {periods?.map((period) => (
        <button
          key={period?.key}
          onClick={() => onPeriodChange(period?.key)}
          className={`px-4 py-2 rounded-md text-sm font-medium transition-smooth ${
            selectedPeriod === period?.key
              ? "bg-primary text-primary-foreground shadow-card"
              : "text-muted-foreground hover:text-foreground hover:bg-background"
          }`}
        >
          {period?.label}
        </button>
      ))}
    </div>
  );
};

export default PeriodTabs;
