"use client";

import { useEffect, useState } from "react";
import Button from "../../../../components/ui/Button";

export default function TeacherFilters({
  filters,
  onFiltersChange,
  schoolSlug,
}) {
  const [localFilters, setLocalFilters] = useState < FilterState > filters;

  useEffect(() => {
    setLocalFilters(filters);
  }, [filters]);

  const handleChange = (key, value) => {
    const newFilters = { ...localFilters, [key]: value };
    setLocalFilters(newFilters);
    onFiltersChange(newFilters);
  };

  const handleClearFilters = () => {
    const clearedFilters = {
      school: "",
      languages: "",
      experience: "",
      availability: "",
      ageRange: "",
      rating: "",
      priceRange: "",
    };
    setLocalFilters(clearedFilters);
    onFiltersChange(clearedFilters);
  };

  return (
    <div className="w-full max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 mt-6">
      {/* Dropdown Filters */}
      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4 mt-6">
        {/* School */}
        {!schoolSlug ? (
          <select
            value={filters.school}
            onChange={(e) => handleChange("school", e.target.value)}
            className="w-full border rounded-lg px-4 py-2"
          >
            <option value="">Select school</option>
            <option value="school1">School 1</option>
            <option value="school2">School 2</option>
          </select>
        ) : null}

        {/* Languages */}
        <select
          value={filters.languages}
          onChange={(e) => handleChange("languages", e.target.value)}
          className="w-full border rounded-lg px-4 py-2"
        >
          <option value="">Select languages...</option>
          <option value="english">English</option>
          <option value="spanish">Spanish</option>
          <option value="french">French</option>
        </select>

        {/* Experience Level */}
        <select
          value={filters.experience}
          onChange={(e) => handleChange("experience", e.target.value)}
          className="w-full border rounded-lg px-4 py-2"
        >
          <option value="">Select experience...</option>
          <option value="beginner">Beginner</option>
          <option value="intermediate">Intermediate</option>
          <option value="expert">Expert</option>
        </select>

        {/* Availability */}
        <select
          value={filters.availability}
          onChange={(e) => handleChange("availability", e.target.value)}
          className="w-full border rounded-lg px-4 py-2"
        >
          <option value="">Select availability...</option>
          <option value="morning">Morning</option>
          <option value="evening">Evening</option>
          <option value="weekend">Weekend</option>
        </select>

        {/* Students Age Range */}
        <select
          value={filters.ageRange}
          onChange={(e) => handleChange("ageRange", e.target.value)}
          className="w-full border rounded-lg px-4 py-2"
        >
          <option value="">Select age range...</option>
          <option value="kids">Kids (5-12)</option>
          <option value="teens">Teens (13-19)</option>
          <option value="adults">Adults (20+)</option>
        </select>

        {/* Filter by Rating */}
        <select
          value={filters.rating}
          onChange={(e) => handleChange("rating", e.target.value)}
          className="w-full border rounded-lg px-4 py-2"
        >
          <option value="">All Ratings</option>
          <option value="4plus">4 Stars & Above</option>
          <option value="3plus">3 Stars & Above</option>
        </select>

        {/* Price Range */}
        <select
          value={filters.priceRange}
          onChange={(e) => handleChange("priceRange", e.target.value)}
          className="w-full border rounded-lg px-4 py-2"
        >
          <option value="">Select price range...</option>
          <option value="0-20">$0 - $20</option>
          <option value="20-50">$20 - $50</option>
          <option value="50-100">$50 - $100</option>
        </select>
        <div className="flex items-end">
          <Button
            variant="outline"
            onClick={handleClearFilters}
            className="w-full hover:bg-destructive/10 hover:text-destructive border-muted-200 bg-transparent"
          >
            Clear Filters
          </Button>
        </div>
      </div>
    </div>
  );
}
