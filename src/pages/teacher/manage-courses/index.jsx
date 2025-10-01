import { useState, useEffect, useMemo } from "react";
import Button from "components/ui/Button";
import RoleBasedHeader from "../../../components/ui/RoleBasedHeader";
import Icon from "components/AppIcon";
import CourseFilter from "./components/CourseFilter";
import CourseTable from "./components/CourseTable";
import { mockCourses } from "./data";
import { useNavigate } from "react-router-dom";

const ManageCourses = () => {
  const navigate = useNavigate();
  const [searchTerm, setSearchTerm] = useState("");
  const [showFilter, setShowFilter] = useState(false);
  const [courses, setCourses] = useState(mockCourses);
  const [currentPage, setCurrentPage] = useState(1);
  const [filters, setFilters] = useState({
    language: "",
    status: "",
    priceRange: "",
    trialAvailable: "",
    dateRange: { start: "", end: "" },
  });
  const [sortConfig, setSortConfig] = useState({
    key: "title",
    direction: "desc",
  });
  const [courseCount, setCourseCount] = useState([
    { label: "Total Courses", count: 0 },
    { label: "Active Courses", count: 0 },
  ]);

  const itemsPerPage = 10;

  useEffect(() => {
    const totalCourseCount = courses.length;
    const activeCourseCount = courses.filter(
      (course) => course.status === "active"
    ).length;

    setCourseCount([
      { label: "Total Courses", count: totalCourseCount },
      { label: "Active Courses", count: activeCourseCount },
    ]);
  }, []);

  // Reset to first page when filters change
  useEffect(() => {
    setCurrentPage(1);
  }, [filters]);

  const handleFilterClick = () => {
    setFilters({
      language: "",
      status: "",
      priceRange: "",
      trialAvailable: "",
      dateRange: { start: "", end: "" },
    });
    setShowFilter(!showFilter);
  };

  const handleFiltersChange = (newFilters) => {
    setFilters(newFilters);
  };

  // Filter and sort courses
  const processedCourses = useMemo(() => {
    let filtered = [...courses];

    // Apply filters
    if (searchTerm && searchTerm.length > 0) {
      filtered = filtered?.filter(
        (course) =>
          course?.title?.toLowerCase()?.includes(searchTerm?.toLowerCase()) ||
          course?.description
            ?.toLowerCase()
            ?.includes(searchTerm?.toLowerCase()) ||
          course?.teacher?.toLowerCase()?.includes(searchTerm?.toLowerCase())
      );
    }

    if (filters?.language) {
      filtered = filtered?.filter(
        (course) => course?.language?.toLowerCase() === filters?.language
      );
    }

    if (filters?.status) {
      filtered = filtered?.filter(
        (course) => course?.status === filters?.status
      );
    }

    if (filters?.trialAvailable) {
      filtered = filtered?.filter((course) =>
        filters?.trialAvailable === "yes"
          ? course?.trialAvailable
          : !course?.trialAvailable
      );
    }

    if (filters?.priceRange) {
      filtered = filtered?.filter((course) => {
        const price = course?.price;
        switch (filters?.priceRange) {
          case "0-50":
            return price >= 0 && price <= 50;
          case "51-100":
            return price >= 51 && price <= 100;
          case "101-200":
            return price >= 101 && price <= 200;
          case "201-500":
            return price >= 201 && price <= 500;
          case "500+":
            return price > 500;
          default:
            return true;
        }
      });
    }

    if (filters?.dateRange?.startDate) {
      filtered = filtered?.filter(
        (course) =>
          new Date(course.startDate) >= new Date(filters?.dateRange?.startDate)
      );
    }

    if (filters?.dateRange?.endDate) {
      filtered = filtered?.filter(
        (course) =>
          new Date(course.endDate) <= new Date(filters?.dateRange?.endDate)
      );
    }

    // Apply sorting
    filtered?.sort((a, b) => {
      let aValue = a?.[sortConfig?.key];
      let bValue = b?.[sortConfig?.key];

      if (typeof aValue === "string") {
        aValue = aValue?.toLowerCase();
        bValue = bValue?.toLowerCase();
      }

      if (aValue < bValue) {
        return sortConfig?.direction === "asc" ? -1 : 1;
      }
      if (aValue > bValue) {
        return sortConfig?.direction === "asc" ? 1 : -1;
      }
      return 0;
    });

    return filtered;
  }, [searchTerm, courses, filters, sortConfig]);

  // Pagination
  const totalPages = Math.ceil(processedCourses?.length / itemsPerPage);
  const paginatedCourses = processedCourses?.slice(
    (currentPage - 1) * itemsPerPage,
    currentPage * itemsPerPage
  );

  const handleSort = (key) => {
    setSortConfig((prevConfig) => ({
      key,
      direction:
        prevConfig?.key === key && prevConfig?.direction === "asc"
          ? "desc"
          : "asc",
    }));
  };

  const handlePageChange = (page) => {
    setCurrentPage(page);
  };

  const handleEditCourse = (course) => {
    alert("Course edited successfully!");
  };

  const handleDuplicateCourse = (course) => {
    const duplicatedCourse = {
      ...course,
      id: Date.now()?.toString(),
      title: `${course?.title} (Copy)`,
      status: "draft",
      studentCount: 0,
      createdAt: new Date()?.toISOString()?.split("T")?.[0],
    };
    setCourses([...courses, duplicatedCourse]);
  };

  const handleDeleteCourse = (courseId) => {
    setCourses(courses?.filter((course) => course?.id !== courseId));
  };

  const handleCreateCourseClick = () => {
    navigate("/teacher/create-course");
  };

  return (
    <div className="min-h-screen bg-background">
      {/* Header */}
      <RoleBasedHeader />
      <main className="max-w-[1450px] mx-auto px-4 sm:px-6 lg:px-8 pt-16 pb-20 lg:pb-8">
        <section className="my-8 flex flex-col gap-y-6 lg:gap-y-0 lg:flex-row lg:justify-between lg:items-center">
          <div>
            <h1 className="text-2xl font-semibold text-foreground mb-2">
              Manage Courses & Lessons
            </h1>
            <p className="text-muted-foreground">
              Create, schedule, and manage your educational offerings
            </p>
          </div>
          <div className="flex items-center gap-x-12 flex-wrap lg:flex-nowrap gap-y-4">
            {courseCount.map((item, index) => (
              <div
                key={index}
                className={`${
                  index !== courseCount.length - 1
                    ? "pr-6 xl:pr-16 border-r border-[#CECECE]"
                    : ""
                }`}
              >
                <h3 className="text-2xl font-bold text-brand-gray-800">
                  {item?.count}
                </h3>
                <span className="text-sm text-brand-gray-500">
                  {item?.label}
                </span>
              </div>
            ))}
            <Button size="sm" iconName="Plus" onClick={handleCreateCourseClick}>
              Create New Course
            </Button>
          </div>
        </section>
        <section className="my-8">
          <div className="flex flex-row gap-3">
            <div className="relative w-full">
              <Icon
                name="Search"
                size={16}
                color="var(--color-muted-foreground)"
                className="absolute left-3 top-1/2 transform -translate-y-1/2"
              />
              <input
                type="text"
                placeholder="Search courses by name, description, or teacher..."
                value={searchTerm}
                onChange={(e) => setSearchTerm(e.target.value)}
                className="pl-10 pr-4 py-2 border border-border rounded-lg bg-input text-foreground placeholder:text-muted-foreground focus:outline-none focus:ring-2 focus:ring-ring w-full"
              />
            </div>

            <Button
              variant="ghost"
              iconName="Funnel"
              iconSize={22}
              className="text-primary"
              onClick={handleFilterClick}
            ></Button>
          </div>
        </section>
        {showFilter && (
          <CourseFilter
            filters={filters}
            onFiltersChange={handleFiltersChange}
          />
        )}
        <CourseTable
          data={paginatedCourses}
          onSort={handleSort}
          sortConfig={sortConfig}
          currentPage={currentPage}
          totalPages={totalPages}
          totalItems={processedCourses?.length}
          onPageChange={handlePageChange}
          onEdit={handleEditCourse}
          onDuplicate={handleDuplicateCourse}
          onDelete={handleDeleteCourse}
        />
      </main>
    </div>
  );
};

export default ManageCourses;
