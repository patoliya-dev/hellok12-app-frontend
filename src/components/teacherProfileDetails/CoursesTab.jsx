import React, { useState } from "react";
import Icon from "../ui/Icon";
import Button from "../ui/Button";
import Select from "../ui/Select";
import CourseCard from "./CourseCard";

const ClassesTab = ({ courses, teacherId }) => {
  // Type state as string | number | array to match Select onChange type
  const [sortBy, setSortBy] = useState("price-low");
  const [filterType, setFilterType] = useState("all");

  const sortOptions = [
    { value: "price-low", label: "Price: Low to High" },
    { value: "price-high", label: "Price: High to Low" },
    { value: "popularity", label: "Most Popular" },
  ];

  const typeOptions = [
    { value: "all", label: "All Courses" },
    { value: "1-on-1", label: "1-on-1 Courses" },
    { value: "group", label: "Group Courses" },
  ];

  const filteredAndSortedClasses = () => {
    let filtered = courses;

    // Filter by type
    if (filterType !== "all") {
      filtered = filtered?.filter((cls) => cls?.lessonType === filterType);
    }

    // Sort courses
    return filtered?.sort((a, b) => {
      switch (sortBy) {
        case "price-low":
          return a?.price - b?.price;
        case "price-high":
          return b?.price - a?.price;
        case "duration":
          return a?.duration - b?.duration;
        case "popularity":
          return (b?.enrolledCount || 0) - (a?.enrolledCount || 0);
        default:
          return 0;
      }
    });
  };

  const processedClasses = filteredAndSortedClasses();

  return (
    <div className="space-y-6">
      {/* Filter and Sort Controls */}
      <div className="flex flex-col sm:flex-row gap-4 p-4 bg-muted/30 rounded-lg">
        <div className="flex-1">
          <Select
            label="Filter by Type"
            options={typeOptions}
            value={filterType}
            onChange={(value) => setFilterType(value)}
            className="w-full"
          />
        </div>
        <div className="flex-1">
          <Select
            label="Sort by"
            options={sortOptions}
            value={sortBy}
            onChange={(value) => setSortBy(value)}
            className="w-full"
          />
        </div>
      </div>

      {/* Classes Summary */}
      <div className="flex items-center justify-between">
        <div>
          <h3 className="text-lg font-semibold text-foreground">
            Available Courses ({processedClasses?.length})
          </h3>
          <p className="text-sm text-text-secondary">
            Choose from 1-on-1 or group learning options
          </p>
        </div>
      </div>

      {/* Courses Grid */}
      {processedClasses?.length > 0 ? (
        <div className="grid gap-6 md:grid-cols-2">
          {processedClasses?.map((courseItem) => (
            <CourseCard
              key={courseItem?._id}
              courseItem={{
                ...courseItem,
                id: courseItem?._id.toString(), // Convert id to string for CourseCard
              }}
              teacherId={teacherId.toString()}
            />
          ))}
        </div>
      ) : (
        <div className="text-center py-12">
          <div className="w-16 h-16 bg-muted rounded-full flex items-center justify-center mx-auto mb-4">
            <Icon name="BookOpen" size={24} className="text-text-secondary" />
          </div>
          <h3 className="text-lg font-medium text-foreground mb-2">
            No Classes Found
          </h3>
          <p className="text-text-secondary mb-4">
            No courses match your current filter criteria.
          </p>
          <Button
            variant="outline"
            onClick={() => {
              setFilterType("all");
              setSortBy("price-low");
            }}
          >
            Clear Filters
          </Button>
        </div>
      )}
    </div>
  );
};

export default ClassesTab;
