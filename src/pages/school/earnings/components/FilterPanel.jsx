import React, { useState } from "react";
import Icon from "../../../../components/AppIcon";
import Button from "../../../../components/ui/Button";
import Select from "../../../../components/ui/Select";
import {
  amountRangeOptions,
  lessonTypeOptions,
  paymentStatusOptions,
} from "../data";
import DateRangePicker from "components/ui/DateRangePicker";

const FilterPanel = ({ filters, onFiltersChange }) => {
  const [isOpen, setIsOpen] = useState(false);
  const [clearDateRange, setClearDateRange] = useState(false);

  const handleFilterChange = (key, value) => {
    onFiltersChange({
      ...filters,
      [key]: value,
    });
  };

  const clearFilters = () => {
    onFiltersChange({
      lessonType: "all",
      paymentStatus: "all",
      amountRange: "all",
      dateRange: {
        startDate: "",
        endDate: "",
      },
    });
    setClearDateRange(true);
  };

  const hasActiveFilters = Object.values(filters)?.some(
    (value) =>
      value !== "all" && value?.startDate !== "" && value?.endDate !== ""
  );

  return (
    <div className="mb-6">
      <div className="flex items-center justify-between mb-4">
        <h3 className="text-lg font-semibold text-foreground">Filters</h3>
        <div className="flex items-center space-x-2">
          {hasActiveFilters && (
            <Button
              variant="ghost"
              size="sm"
              onClick={clearFilters}
              iconName="X"
              iconPosition="left"
            >
              Clear
            </Button>
          )}
          <Button
            variant="ghost"
            size="icon"
            onClick={() => setIsOpen(!isOpen)}
            className="md:hidden"
          >
            <Icon name={isOpen ? "ChevronUp" : "ChevronDown"} size={20} />
          </Button>
        </div>
      </div>
      <div className={`space-y-4 ${isOpen ? "block" : "hidden md:block"}`}>
        <div className="flex justify-between items-center flex-wrap">
          <div className="flex items-center flex-wrap gap-4">
            <Select
              label="Lesson Type"
              options={lessonTypeOptions}
              value={filters?.lessonType}
              onChange={(value) => handleFilterChange("lessonType", value)}
              className="w-[300px]"
            />

            <Select
              label="Payment Status"
              options={paymentStatusOptions}
              value={filters?.paymentStatus}
              onChange={(value) => handleFilterChange("paymentStatus", value)}
              className="w-[300px]"
            />

            <Select
              label="Amount Range"
              options={amountRangeOptions}
              value={filters?.amountRange}
              onChange={(value) => handleFilterChange("amountRange", value)}
              className="w-[300px]"
            />
          </div>
          <DateRangePicker
            onChange={(value) => handleFilterChange("dateRange", value)}
            onClear={clearDateRange}
          />
        </div>

        {hasActiveFilters && (
          <div className="flex flex-wrap gap-2 pt-2 border-t border-border">
            <span className="text-sm text-muted-foreground">
              Active filters:
            </span>
            {filters?.lessonType !== "all" && (
              <span className="inline-flex items-center px-2 py-1 rounded-full text-xs bg-primary/10 text-primary">
                {
                  lessonTypeOptions?.find(
                    (opt) => opt?.value === filters?.lessonType
                  )?.label
                }
              </span>
            )}
            {filters?.paymentStatus !== "all" && (
              <span className="inline-flex items-center px-2 py-1 rounded-full text-xs bg-secondary/10 text-secondary">
                {
                  paymentStatusOptions?.find(
                    (opt) => opt?.value === filters?.paymentStatus
                  )?.label
                }
              </span>
            )}
            {filters?.amountRange !== "all" && (
              <span className="inline-flex items-center px-2 py-1 rounded-full text-xs bg-accent/10 text-accent">
                {
                  amountRangeOptions?.find(
                    (opt) => opt?.value === filters?.amountRange
                  )?.label
                }
              </span>
            )}
            {filters?.dateRange?.startDate !== "" &&
              filters?.dateRange?.endDate !== "" && (
                <span className="inline-flex items-center px-2 py-1 rounded-full text-xs text-brand-gray-800">
                  {filters?.dateRange?.startDate?.toLocaleDateString("en-US", {
                    month: "short",
                    day: "numeric",
                  }) +
                    " - " +
                    filters?.dateRange?.endDate?.toLocaleDateString("en-US", {
                      month: "short",
                      day: "numeric",
                    })}
                </span>
              )}
          </div>
        )}
      </div>
    </div>
  );
};

export default FilterPanel;
