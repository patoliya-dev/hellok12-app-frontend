import React, { useState, useEffect, useCallback } from "react";
import { Funnel } from "lucide-react";
import SearchBar from "../../../components/ui/SearchBar";
import TeacherGrid from "./components/TeacherGrid";
import Button from "../../../components/ui/Button";
import TeacherFilters from "./components/TeacherFilters";
import { mockTeachers } from "../../../services/mockApi";
import RoleBasedHeader from "components/ui/RoleBasedHeader";

const itemsPerPage = 8;

const FindTeacher = () => {
  const [searchQuery, setSearchQuery] = useState("");
  const [loading, setLoading] = useState(false);
  const [filteredTeachers, setFilteredTeachers] = useState([]);
  const [visibleCount, setVisibleCount] = useState(itemsPerPage);
  const [showFilters, setShowFilters] = useState(false);
  const [filters, setFilters] = useState({
    school: "",
    languages: "",
    experience: "",
    availability: "",
    ageRange: "",
    rating: "",
    priceRange: [0, 1000],
    onlineStatus: "",
    lessonType: "",
  });

  // Filter teachers based on search query
  const filterTeachers = useCallback(() => {
    const query = searchQuery.toLowerCase();
    return mockTeachers.filter((teacher) => {
      // Search query filter
      const matchesSearch =
        !query ||
        teacher.name.toLowerCase().includes(query) ||
        teacher.title.toLowerCase().includes(query) ||
        teacher.languages.some((lang) => lang.toLowerCase().includes(query)) ||
        teacher.specialties.some((spec) => spec.toLowerCase().includes(query));

      // Language filter
      const matchesLanguage =
        !filters.languages ||
        teacher.languages.some(
          (lang) => lang.toLowerCase() === filters.languages.toLowerCase()
        );

      // Experience filter
      const matchesExperience =
        !filters.experience ||
        (() => {
          switch (filters.experience) {
            case "beginner":
              return teacher.experience <= 3;
            case "intermediate":
              return teacher.experience > 3 && teacher.experience <= 7;
            case "expert":
              return teacher.experience > 7;
            default:
              return true;
          }
        })();

      // Availability filter
      const matchesAvailability =
        !filters.availability ||
        teacher.availability.some((avail) =>
          avail.toLowerCase().includes(filters.availability.toLowerCase())
        );

      // Rating filter
      const matchesRating =
        !filters.rating ||
        (() => {
          switch (filters.rating) {
            case "4plus":
              return teacher.rating >= 4.0;
            case "3plus":
              return teacher.rating >= 3.0;
            default:
              return true;
          }
        })();

      // Price range filter
      const matchesPriceRange =
        !filters.priceRange ||
        (() => {
          const [min, max] = filters.priceRange;
          return teacher.hourlyRate >= min && teacher.hourlyRate <= max;
        })();

      // Online status filter
      const matchesOnlineStatus =
        !filters.onlineStatus ||
        (() => {
          switch (filters.onlineStatus) {
            case "online":
              return teacher.isOnline;
            case "offline":
              return !teacher.isOnline;
            default:
              return true;
          }
        })();

      return (
        matchesSearch &&
        matchesLanguage &&
        matchesExperience &&
        matchesAvailability &&
        matchesRating &&
        matchesPriceRange &&
        matchesOnlineStatus
      );
    });
  }, [searchQuery, filters]);

  // Update filtered teachers on search change
  useEffect(() => {
    setLoading(true);
    const filtered = filterTeachers();
    setFilteredTeachers(filtered);
    setVisibleCount(itemsPerPage); // reset to first 8 whenever search changes
    setLoading(false);
  }, [searchQuery, filters, filterTeachers]);

  const handleSearchChange = (query) => setSearchQuery(query);

  const handleFilterChange = (newFilters) => {
    setFilters(newFilters);
  };

  const handleQuickFilter = (filterType, value) => {
    setFilters((prev) => ({
      ...prev,
      [filterType]: prev[filterType] === value ? "" : value,
    }));
  };

  // Load more simply increases the visible count
  const handleLoadMore = () => {
    setVisibleCount((prev) => prev + itemsPerPage);
  };

  // Slice the teachers to show only up to visibleCount
  const displayedTeachers = filteredTeachers.slice(0, visibleCount);
  const hasMore = visibleCount < filteredTeachers.length;

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
              className="bg-blue-50 border-blue-200 text-blue-700 hover:bg-blue-100 cursor-pointer"
            >
              Online
            </Button>
            <Button
              variant="outline"
              className="hover:bg-primary  border-muted-1 bg-transparent cursor-pointer"
            >
              In-Person
            </Button>
            <Button
              variant="outline"
              className="hover:bg-primary border-muted-1 bg-transparent cursor-pointer"
            >
              Group
            </Button>
            <Button
              variant="outline"
              className="hover:bg-primary border-muted-1 bg-transparent cursor-pointer"
            >
              1-on-1
            </Button>
            <Button
              variant="outline"
              className="hover:bg-primary border-muted-1 bg-transparent cursor-pointer"
            >
              Curriculum-Aligned Games
            </Button>
            <Button
              variant="outline"
              className="hover:bg-primary border-muted-1 bg-transparent cursor-pointer"
            >
              Trial Lessons
            </Button>
          </div>
          {/* Teacher Count */}
          <div className="text-sm text-gray-800 whitespace-nowrap">
            {filteredTeachers.length}{" "}
            <span className="text-gray-500">teachers found</span>
          </div>
        </div>

        {/* Teachers List */}
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
          <TeacherGrid
            teachers={displayedTeachers}
            loading={loading}
            hasMore={hasMore}
            onLoadMore={handleLoadMore}
          />
        </div>
      </main>
    </div>
  );
};

export default FindTeacher;
