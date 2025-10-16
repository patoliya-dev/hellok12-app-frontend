import React, { useState } from "react";
import Input from "./Input";

export default function WeeklySchedule(formData, handleInputChange) {
  const [selectedDate, setSelectedDate] = useState(formData?.schedule?.date || "2025-08-22");
  const [selectedTime, setSelectedTime] = useState(formData?.schedule?.time || "10:00 AM");

  const times = [
    { label: "09:00 AM", disabled: true },
    { label: "10:00 AM" },
    { label: "14:00 PM" },
    { label: "15:00 PM" },
  ];

  return (
    <div className="w-full my-6">
      <h3 className="text-sm font-medium text-brand-gray-800 mb-2">
        Schedule
      </h3>

      <div className="flex flex-col sm:flex-row sm:items-center border border-border rounded-lg px-4 py-3 shadow-sm bg-white gap-y-4 sm:gap-y-0">
        {/* Date Picker using your Input */}
        <div className="flex items-center border-r pr-4">
          <Input
            type="date"
            value={selectedDate}
            onChange={(e) => {
              setSelectedDate(e.target.value);
              handleInputChange(e?.target?.value)
            }}
            className=""
          />
        </div>

        {/* Time Buttons */}
        <div className="flex flex-col sm:flex-row sm:items-center space-y-4 sm:space-y-0 sm:space-x-2 sm:px-4">
          {times.map((time) => (
            <button
              key={time.label}
              disabled={time.disabled}
              onClick={() => {
                if (!time.disabled) {
                  handleInputChange(time.label)
                  setSelectedTime(time.label)
                }
              }}
              className={`px-4 py-1.5 text-sm rounded-md border transition 
                ${
                  time.disabled
                    ? "bg-gray-100 text-gray-400 cursor-not-allowed"
                    : selectedTime === time.label
                    ? "bg-blue-600 text-white border-blue-600"
                    : "bg-white text-gray-700 hover:bg-gray-50 border-gray-300"
                }`}
            >
              {time.label}
            </button>
          ))}
        </div>
      </div>
    </div>
  );
}
