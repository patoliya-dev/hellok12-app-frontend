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
    price: [0, 1000],
    onlineStatus: "",
    lessonType: "",
  });

  // 🔹 Fetch teachers function (load more or reset)
  const loadTeachers = async (loadMore = false) => {
    if (loading) return;
    setLoading(true);

    try {
      const currentOffset = loadMore ? offset : 0;

      const response = await fetchTeachers(filters, {
        limit: itemsPerPage,
        offset: currentOffset,
      });

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
  }, [filters, searchQuery]);

  const handleSearchChange = (query) => setSearchQuery(query);
  const handleFilterChange = (newFilters) => setFilters(newFilters);
  const handleQuickFilter = (filterType, value) =>
    setFilters((prev) => ({
      ...prev,
      [filterType]: prev[filterType] === value ? "" : value,
    }));

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
              onClick={() => handleQuickFilter("onlineStatus", "online")}
            >
              Online
            </Button>
            <Button
              variant="outline"
              className="hover:bg-primary border-muted-1 bg-transparent cursor-pointer"
              onClick={() => handleQuickFilter("lessonType", "group")}
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
            {teachers.length} <span className="text-gray-500">teachers found</span>
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
