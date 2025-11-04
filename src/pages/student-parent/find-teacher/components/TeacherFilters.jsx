import { useEffect, useState } from "react";
import Button from "../../../../components/ui/Button";
import { languageOptions } from "../../../../utils/utils";
import Input from "components/ui/Input";
import DateRangePicker from "components/ui/DateRangePicker";
import Select from "components/ui/Select";
import RangeSlider from "react-range-slider-input";
import "react-range-slider-input/dist/style.css";

export default function TeacherFilters({
  filters,
  onFiltersChange,
  schoolSlug,
}) {
  const [localFilters, setLocalFilters] = useState(filters);

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
      priceRange: [0, 100],
    };
    setLocalFilters(clearedFilters);
    onFiltersChange(clearedFilters);
  };

  const ageRangeOptions = [
    { value: "", label: "Select age range..." },
    { value: "0-3", label: "0 - 3 years" },
    { value: "4-5", label: "4 - 5 years" },
    { value: "6-10", label: "6 - 10 years" },
    { value: "11-14", label: "11 - 14 years" },
    { value: "15-18", label: "15 - 18 years" },
    { value: "18+", label: "18+ years old" },
  ];

  const schoolOptions = [
    { value: "", label: "Select school" },
    { value: "school1", label: "School 1" },
    { value: "school2", label: "School 2" },
  ];
  const experienceOptions = [
    { value: "", label: "Select experience..." },
    { value: "0-5", label: "0 - 5 years" },
    { value: "5-10", label: "5 - 10 years" },
    { value: "10-15", label: "10 - 15 years" },
    { value: "15-20", label: "15 - 20 years" },
    { value: "20+", label: "20 years above" },
  ];

  return (
    <div className="w-full max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 mt-6">
      {/* Dropdown Filters */}
      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4 mt-6">
        {/* School */}
        {!schoolSlug ? (
          <Select
            label="School"
            value={filters.school}
            onChange={(val) => handleChange("school", val)}
            options={schoolOptions}
          />
        ) : null}
        {/* Languages */}
        <Select
          label="Languages"
          value={filters.languages}
          onChange={(val) => handleChange("languages", val)}
          options={[
            { value: "", label: "Select languages..." },
            ...languageOptions,
          ]}
        />
        {/* Experience Level */}
        <Select
          label="Experience Level"
          value={filters.experience}
          onChange={(val) => handleChange("experience", val)}
          options={experienceOptions}
        />

        {/* Availability */}
        <div className="mb-2">
          <label className="text-sm font-medium leading-none peer-disabled:cursor-not-allowed peer-disabled:opacity-70 mb-2 block text-foreground">
            Availability
          </label>
          <DateRangePicker
            className="w-full border rounded-lg"
          />
        </div>

        {/* Students Age Range */}
        <Select
          label="Students Age Range"
          value={filters.ageRange}
          onChange={(val) => handleChange("ageRange", val)}
          options={ageRangeOptions}
        />

        {/* Filter by Rating */}
        <Select
          label="Rating"
          value={filters.rating}
          onChange={(val) => handleChange("rating", val)}
          options={[
            {
              value: "",
              label: (
                <span className="flex items-center">
                  {Array.from({ length: 5 }).map((_, idx) => (
                    <svg
                      key={idx}
                      xmlns="http://www.w3.org/2000/svg"
                      viewBox="0 0 20 20"
                      fill="#facc15"
                      className="w-4 h-4 mr-0.5"
                    >
                      <path d="M9.049 2.927c.3-.921 1.603-.921 1.902 0l1.286 3.966a1 1 0 00.95.69h4.175c.969 0 1.371 1.24.588 1.81l-3.382 2.455a1 1 0 00-.364 1.118l1.287 3.966c.3.921-.755 1.688-1.538 1.118l-3.382-2.455a1 1 0 00-1.175 0l-3.382 2.455c-.783.57-1.838-.197-1.539-1.118l1.287-3.966a1 1 0 00-.364-1.118L2.05 9.393c-.783-.57-.38-1.81.588-1.81h4.175a1 1 0 00.95-.69l1.286-3.966z" />
                    </svg>
                  ))}
                  <span className="ml-1">All Ratings</span>
                </span>
              ),
            },
            ...[5, 4, 3, 2, 1].map((n) => ({
              value: String(n),
              label: (
                <span className="flex items-center">
                  {Array.from({ length: n }).map((_, i) => (
                    <svg
                      key={"star_filled_" + i}
                      xmlns="http://www.w3.org/2000/svg"
                      viewBox="0 0 20 20"
                      fill="#facc15"
                      className="w-4 h-4 mr-0.5"
                    >
                      <path d="M9.049 2.927c.3-.921 1.603-.921 1.902 0l1.286 3.966a1 1 0 00.95.69h4.175c.969 0 1.371 1.24.588 1.81l-3.382 2.455a1 1 0 00-.364 1.118l1.287 3.966c.3.921-.755 1.688-1.538 1.118l-3.382-2.455a1 1 0 00-1.175 0l-3.382 2.455c-.783.57-1.838-.197-1.539-1.118l1.287-3.966a1 1 0 00-.364-1.118L2.05 9.393c-.783-.57-.38-1.81.588-1.81h4.175a1 1 0 00.95-.69l1.286-3.966z" />
                    </svg>
                  ))}
                  {Array.from({ length: 5 - n }).map((_, i) => (
                    <svg
                      key={"star_empty_" + i}
                      xmlns="http://www.w3.org/2000/svg"
                      viewBox="0 0 20 20"
                      fill="#e5e7eb"
                      className="w-4 h-4 mr-0.5"
                    >
                      <path d="M9.049 2.927c.3-.921 1.603-.921 1.902 0l1.286 3.966a1 1 0 00.95.69h4.175c.969 0 1.371 1.24.588 1.81l-3.382 2.455a1 1 0 00-.364 1.118l1.287 3.966c.3.921-.755 1.688-1.538 1.118l-3.382-2.455a1 1 0 00-1.175 0l-3.382 2.455c-.783.57-1.838-.197-1.539-1.118l1.287-3.966a1 1 0 00-.364-1.118L2.05 9.393c-.783-.57-.38-1.81.588-1.81h4.175a1 1 0 00.95-.69l1.286-3.966z" />
                    </svg>
                  ))}
                  <span className="ml-1">{n} Star</span>
                </span>
              ),
            })),
          ]}
        />

        {/* Price Range */}
        <div className="mb-6">
          <label className="text-sm font-medium leading-none peer-disabled:cursor-not-allowed peer-disabled:opacity-70 mb-2 block text-foreground">
            Price Range
          </label>
          <div className="flex w-full items-center gap-4 mt-5 ">
            <span className="text-xs text-[#2B67F6]">${filters?.priceRange[0] ?? 0}</span>
            <RangeSlider
              value={filters.priceRange}
              onInput={([min, max]) => {
                handleChange("priceRange", [min, max]);
              }}
              className="range-slider flex-1"
            />
            <span className="text-xs text-[#2B67F6]">${filters?.priceRange[1] ?? 100}</span>
          </div>
        </div>
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
