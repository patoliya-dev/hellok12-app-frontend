// components/DateRangePicker.jsx
import React, { useState } from "react";
import { DateRange } from "react-date-range";
import { format } from "date-fns";
import "react-date-range/dist/styles.css"; // main style
import "react-date-range/dist/theme/default.css"; // theme css
import { Calendar } from "lucide-react"; // icon library (or use any)
import Icon from "components/AppIcon";

const DateRangePicker = ({ onChange }) => {
  const [showPicker, setShowPicker] = useState(false);
  const [range, setRange] = useState([
    {
      startDate: new Date(),
      endDate: new Date(),
      key: "selection",
    },
  ]);

  const handleSelect = (ranges) => {
    setRange([ranges.selection]);
    onChange?.(ranges.selection);
  };

  return (
    <div className="relative inline-block">
      {/* Display input box */}
      <button
        onClick={() => setShowPicker(!showPicker)}
        className="flex items-center gap-2 border border-border bg-input rounded-md px-3 py-2"
      >
        <Icon name={"Calendar"} size={16} />
        <span className="font-medium text-sm text-brand-gray-800">
          {format(range[0].startDate, "MMM dd, yyyy")} -{" "}
          {format(range[0].endDate, "MMM dd, yyyy")}
        </span>
      </button>

      {/* Dropdown Calendar */}
      {showPicker && (
        <div className="absolute mt-2 z-50 bg-white border rounded-lg shadow-lg">
          <DateRange
            ranges={range}
            onChange={handleSelect}
            moveRangeOnFirstSelection={false}
            editableDateInputs={true}
          />
          <div className="flex justify-end p-2">
            <button
              onClick={() => setShowPicker(false)}
              className="px-3 py-1 text-sm bg-blue-600 text-white rounded-md"
            >
              Done
            </button>
          </div>
        </div>
      )}
    </div>
  );
};

export default DateRangePicker;
