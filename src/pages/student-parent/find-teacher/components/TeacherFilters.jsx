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
  const [priceInputs, setPriceInputs] = useState({
    min: "",
    max: "",
  });

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
      price: "",
    };
    setPriceInputs({ min: "", max: "" });
    setLocalFilters(clearedFilters);
    onFiltersChange(clearedFilters);
  };

  const handlePriceInputChange = (index, rawValue) => {
    // Update local state immediately for free typing
    if (index === 0) {
      setPriceInputs((prev) => ({ ...prev, min: rawValue }));
    } else {
      setPriceInputs((prev) => ({ ...prev, max: rawValue }));
    }
  };

  const handlePriceInputBlur = (index) => {
    const minBound = 0;
    const maxBound = 500;
    const [filterMin, filterMax] = filters.price || [minBound, maxBound];

    // Don’t update filters until user entered both
    if (priceInputs.min === "" && priceInputs.max === "") return;

    const parsedMin = Number(priceInputs.min);
    const parsedMax = Number(priceInputs.max);

    const validMin = Number.isNaN(parsedMin) ? filterMin : parsedMin;
    const validMax = Number.isNaN(parsedMax) ? filterMax : parsedMax;

    if (index === 0) {
      const nextMin = Math.max(minBound, Math.min(validMin, validMax));
      handleChange("price", [nextMin, validMax]);
      setPriceInputs({ min: nextMin, max: validMax });
    } else {
      const nextMax = Math.min(maxBound, Math.max(validMax, validMin));
      handleChange("price", [validMin, nextMax]);
      setPriceInputs({ min: validMin, max: nextMax });
    }
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
          searchable
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
          <DateRangePicker className="w-full border rounded-lg" />
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
          <div className="flex w-full items-center gap-4 ">
            <div className="flex items-center gap-2 w-28">
              <span className="text-xs text-foreground">Min</span>
              <Input
                type="number"
                className="h-9 px-2 border-2 border-border"
                min={0}
                max={100}
                value={priceInputs.min}
                onChange={(e) => handlePriceInputChange(0, e.target.value)}
                onBlur={() => handlePriceInputBlur(0)}
              />
            </div>
            <div className="flex items-center gap-2 w-28">
              <span className="text-xs text-foreground">Max</span>
              <Input
                type="number"
                className="h-9 px-2 border-2 border-border"
                min={0}
                max={100}
                value={priceInputs.max}
                onChange={(e) => handlePriceInputChange(1, e.target.value)}
                onBlur={() => handlePriceInputBlur(1)}
              />
            </div>
          </div>
          <div className="flex w-full items-center gap-4 mt-5">
            <span className="text-xs text-[#2B67F6]">
              {Array.isArray(filters.price) && filters.price.length > 0
                ? `$${filters.price[0]}`
                : "--"}
            </span>
            <RangeSlider
              min={0}
              max={500}
              value={
                Array.isArray(filters.price) && filters.price.length === 2
                  ? filters.price
                  : [0, 0] // visually empty range
              }
              onInput={([min, max]) => {
                handleChange("price", [min, max]);
                setPriceInputs({ min, max });
              }}
              className="range-slider flex-1"
            />
            <span className="text-xs text-[#2B67F6]">
              {Array.isArray(filters.price) && filters.price.length > 0
                ? `$${filters.price[1]}`
                : "--"}
            </span>
          </div>
        </div>
        <div className="flex items-start mt-5">
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
