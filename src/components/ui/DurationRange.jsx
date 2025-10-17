import React, { useState } from "react";

export default function DurationRange({ formData, handleInputChange }) {
  // Duration in minutes
  const [duration, setDuration] = useState(60);

  const handleChange = (e) => {
    setDuration(Number(e.target.value));
    handleInputChange("schedule.duration", Number(e.target.value))
  };

  return (
    <div className="w-full max-w-md mb-4">
      {/* Label + Current Value */}
      <label className="block text-sm font-medium text-brand-gray-800 mb-2">
        Duration{" "}
        <span className="text-sm text-brand-gray-500 ml-1">
          ({duration} min)
        </span>
      </label>

      {/* Range Input */}
      <input
        type="range"
        min="30"
        max="60"
        step="15"
        value={formData?.schedule?.duration || duration}
        onChange={handleChange}
        className="w-full h-2 bg-muted rounded-lg appearance-none cursor-pointer accent-blue-600"
      />

      {/* Step Labels */}
      <div className="flex justify-between text-xs text-brand-gray-500 mt-2">
        <span>30 min</span>
        <span>45 min</span>
        <span>60 min</span>
        {/* <span>75 min</span>
        <span>90 min</span> */}
      </div>
    </div>
  );
}
