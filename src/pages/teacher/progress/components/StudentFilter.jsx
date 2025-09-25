import { useState } from "react";
import Select from "components/ui/Select";
import { courseOptions, courses, timeOptions } from "../data";
import Input from "components/ui/Input";

const StudentFilter = ({ filters, onFiltersChange }) => {
  const [localFilters, setLocalFilters] = useState(filters);

  const handleFilterChange = (key, value) => {
    const updatedFilters = { ...localFilters, [key]: value };
    setLocalFilters(updatedFilters);
    onFiltersChange(updatedFilters);
  };

  const handleDateRangeChange = (type, value) => {
    const updatedFilters = {
      ...localFilters,
      dateRange: {
        ...localFilters?.dateRange,
        [type]: value,
      },
    };
    setLocalFilters(updatedFilters);
    onFiltersChange(updatedFilters);
  };

  return (
    <section className="my-8">
      <div className="bg-card border border-border rounded-lg flex flex-col sm:flex-row gap-8 items-center p-6 flex-wrap lg:flex-nowrap">
        <Select
          label="Course"
          placeholder="Select a course"
          value={localFilters?.courseName}
          options={courseOptions}
          onChange={(value) => handleFilterChange("courseName", value)}
          className="w-full"
        />
        <Select
          label="Lesson Filter"
          placeholder="Select a lesson"
          value={localFilters?.lessonName}
          options={
            localFilters?.courseName === "all"
              ? []
              : courses.find((c) => c.courseName === localFilters?.courseName)
                  ?.lessons
          }
          onChange={(value) => handleFilterChange("lessonName", value)}
          className="w-full"
          searchable={true}
          disabled={localFilters?.courseName === "all"}
        />
        <Select
          label="Time"
          placeholder="Select time"
          value={localFilters?.time}
          options={timeOptions}
          onChange={(value) => handleFilterChange("time", value)}
          className="w-full"
        />
        <Input
          label="Start Date"
          type="date"
          value={localFilters?.dateRange?.start}
          onChange={(e) => handleDateRangeChange("start", e?.target?.value)}
          className="w-full border-border"
        />
        <Input
          label="End Date"
          type="date"
          value={localFilters?.dateRange?.end}
          onChange={(e) => handleDateRangeChange("end", e?.target?.value)}
          className="w-full border-border"
        />
      </div>
    </section>
  );
};

export default StudentFilter;
