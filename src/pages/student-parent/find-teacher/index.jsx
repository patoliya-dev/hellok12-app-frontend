import React, { useState, useEffect, useCallback } from "react";
import { Funnel } from "lucide-react";
import SearchBar from "../../../components/ui/SearchBar";
import TeacherGrid from "./components/TeacherGrid";
import Button from "../../../components/ui/Button";
import TeacherFilters from "./components/TeacherFilters";
import RoleBasedHeader from "components/ui/RoleBasedHeader";
import { fetchTeachers } from "../../../services/teachers/findTeachers.service";

const itemsPerPage = 8;

const FindTeacher = () => {
  const [searchQuery, setSearchQuery] = useState("");
  const [loading, setLoading] = useState(false);
  const [teachers, setTeachers] = useState([]);
  const [offset, setOffset] = useState(0);
  const [hasMore, setHasMore] = useState(true);
  const [showFilters, setShowFilters] = useState(false);
  const [filters, setFilters] = useState({
    school: "",
    languages: "",
    experience: "",
    availability: "",
    ageRange: "",
    rating: "",
    price: "",
    onlineStatus: "",
    lessonType: "",
    name: "",
  });
  const [quickFilters, setQuickFilters] = useState({
    mode: [], // ['online', 'in-person']
    lessonType: [], // ['group', '1-on-1']
    isTrialAvailable: false,
  });

  // Handle quick filter toggle
  const handleQuickFilterToggle = (filterType, value) => {
    setQuickFilters((prev) => {
      if (filterType === "isTrialAvailable") {
        return { ...prev, isTrialAvailable: !prev.isTrialAvailable };
      }

      const currentValues = prev[filterType];
      const newValues = currentValues.includes(value)
        ? currentValues.filter((v) => v !== value)
        : [...currentValues, value];

      return { ...prev, [filterType]: newValues };
    });
  };

  // 🔹 Check if a filter is active
  const isFilterActive = (filterType, value) => {
    if (filterType === "isTrialAvailable") {
      return quickFilters.isTrialAvailable;
    }
    return quickFilters[filterType].includes(value);
  };

  // 🔹 Fetch teachers function (load more or reset)
  const loadTeachers = async (loadMore = false) => {
    if (loading) return;
    setLoading(true);

    try {
      const currentOffset = loadMore ? offset : 0;

      const response = await fetchTeachers(
        {
          ...filters,
          name: searchQuery,
          ...quickFilters,
        },
        {
          limit: itemsPerPage,
          offset: currentOffset,
        }
      );

      const newTeachers = response?.data || [];

      setTeachers((prev) =>
        loadMore ? [...prev, ...newTeachers] : newTeachers
      );
      setOffset(currentOffset + newTeachers.length);
      setHasMore(newTeachers.length === itemsPerPage); // if less than limit, no more data
    } catch (err) {
      console.error("Failed to load teachers:", err);
      setTeachers([]);
    } finally {
      setLoading(false);
    }
  };

  // When filters or search change — reset pagination
  useEffect(() => {
    setOffset(0);
    loadTeachers(false);
  }, [filters, searchQuery, quickFilters]);

  const handleSearchChange = (query) => setSearchQuery(query);
  const handleFilterChange = (newFilters) => setFilters(newFilters);

  return (
    <div className="min-h-screen bg-background">
      <RoleBasedHeader />
      <main className="pt-16">
        {/* Hero Section */}
        <div className="max-w-4xl mx-auto px-4 sm:px-6 lg:px-8 py-20">
          <div className="text-center">
            <h1 className="text-3xl sm:text-4xl font-heading font-bold text-foreground mb-4">
              Find Your Perfect Language Teacher
            </h1>
            <p className="text-lg text-text-secondary max-w-2xl mx-auto">
              Connect with qualified instructors from around the world.
            </p>
          </div>
        </div>

        {/* Search + Filter */}
        <div className="flex max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 relative">
          <div className="flex-1">
            <SearchBar onSearch={handleSearchChange} />
          </div>
          <div className="ml-6 h-12">
            <Button
              className="bg-muted-600 hover:bg-muted-700 h-full p-4 border border-muted-100 cursor-pointer"
              onClick={() => setShowFilters((prev) => !prev)}
            >
              <Funnel size={50} className="h-6 w-5 text-primary" />
            </Button>
          </div>
        </div>

        {/* Filters */}
        {showFilters && (
          <div className="">
            <TeacherFilters
              filters={filters}
              onFiltersChange={(value) => handleFilterChange(value)}
            />
          </div>
        )}

        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 flex items-center justify-between gap-3 my-8">
          {/* Filter Buttons */}
          <div className="flex flex-wrap gap-3">
            <Button
              variant="outline"
              onClick={() => handleQuickFilterToggle("mode", "online")}
              className={`cursor-pointer transition-colors ${
                isFilterActive("mode", "online")
                  ? "bg-primary text-white border-blue-200 hover:bg-blue-500"
                  : "hover:bg-primary border-muted-1 bg-transparent"
              }`}
            >
              Online
            </Button>
            <Button
              variant="outline"
              onClick={() => handleQuickFilterToggle("mode", "in-person")}
              className={`cursor-pointer transition-colors ${
                isFilterActive("mode", "in-person")
                  ? "bg-primary text-white border-blue-200 hover:bg-blue-500"
                  : "hover:bg-primary border-muted-1 bg-transparent"
              }`}
            >
              In-Person
            </Button>
            <Button
              variant="outline"
              onClick={() => handleQuickFilterToggle("lessonType", "group")}
              className={`cursor-pointer transition-colors ${
                isFilterActive("lessonType", "group")
                  ? "bg-primary text-white border-blue-200 hover:bg-blue-500"
                  : "hover:bg-primary border-muted-1 bg-transparent"
              }`}
            >
              Group
            </Button>
            <Button
              variant="outline"
              onClick={() => handleQuickFilterToggle("lessonType", "1-on-1")}
              className={`cursor-pointer transition-colors ${
                isFilterActive("lessonType", "1-on-1")
                  ? "bg-primary text-white border-blue-200 hover:bg-blue-500"
                  : "hover:bg-primary border-muted-1 bg-transparent"
              }`}
            >
              1-on-1
            </Button>
            <Button
              variant="outline"
              onClick={() => handleQuickFilterToggle("isTrialAvailable")}
              className={`cursor-pointer transition-colors ${
                isFilterActive("isTrialAvailable")
                  ? "bg-primary text-white border-blue-200 hover:bg-blue-500"
                  : "hover:bg-primary border-muted-1 bg-transparent"
              }`}
            >
              Trial Lessons
            </Button>
          </div>
          {/* Teacher Count */}
          <div className="text-sm text-gray-800 whitespace-nowrap">
            {teachers.length}{" "}
            <span className="text-gray-500">teachers found</span>
          </div>
        </div>

        {/* Teacher Grid */}
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
          <TeacherGrid
            teachers={teachers}
            loading={loading}
            hasMore={hasMore}
            onLoadMore={() => loadTeachers(true)}
          />
        </div>
      </main>
    </div>
  );
};

export default FindTeacher;
