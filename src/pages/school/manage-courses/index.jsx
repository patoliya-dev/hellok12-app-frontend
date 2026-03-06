import { useState, useEffect } from "react";
import { useDispatch, useSelector } from "react-redux";
import { useNavigate } from "react-router-dom";
import Button from "components/ui/Button";
import RoleBasedHeader from "../../../components/ui/RoleBasedHeader";
import Icon from "components/AppIcon";
import CourseFilter from "./components/CourseFilter";
import CourseTable from "./components/CourseTable";
import {
  fetchCourses,
  removeCourse,
  duplicateCourse,
} from "../../../reducers/courses/courseThunks";
import PageLoaderOverlay from 'components/ui/PageLoaderOverlay';
import { selectPageLoading } from '../../../reducers/ui/pageLoaderSlice';

const ManageCourses = () => {
  const navigate = useNavigate();
  const dispatch = useDispatch();
  // Page loader state
  const pageLoading = useSelector(selectPageLoading);

  // Redux course list state
  const { items: courses, pagination, loading, error } = useSelector(
    (state) => state.courseList
  );

  const [searchTerm, setSearchTerm] = useState("");
  const [showFilter, setShowFilter] = useState(false);
  const [filters, setFilters] = useState({
    language: "",
    status: "",
    priceRange: "",
    isTrialAvailable: "",
    dateRange: { start: "", end: "" },
  });
  const [sortConfig, setSortConfig] = useState({
    key: "title",
    direction: "Asc",
  });
  const [courseCount, setCourseCount] = useState([
    { label: "Total Courses", count: 0 },
    { label: "Active Courses", count: 0 },
  ]);

  const itemsPerPage = 10;
  const [currentPage, setCurrentPage] = useState(1);

  // Fetch courses from backend
  useEffect(() => {
    const params = {
      search: searchTerm || undefined,
      language: filters.language || undefined,
      status: filters.status || undefined,
      isTrialAvailable:
        filters.isTrialAvailable === "yes"
          ? true
          : filters.isTrialAvailable === "no"
            ? false
            : undefined,
      priceMin:
        filters.priceRange && filters.priceRange.includes("-")
          ? Number(filters.priceRange.split("-")[0])
          : undefined,
      priceMax:
        filters.priceRange && filters.priceRange.includes("-")
          ? Number(filters.priceRange.split("-")[1])
          : undefined,
      dateFrom: filters.dateRange?.start || undefined,
      dateTo: filters.dateRange?.end || undefined,
      page: currentPage,
      limit: itemsPerPage,
      sortBy:
        sortConfig.key && sortConfig.direction
          ? sortConfig.key + sortConfig.direction
          : "newest",
    };

    dispatch(fetchCourses(params));
  }, [dispatch, searchTerm, filters, sortConfig, currentPage]);

  // Course statistics
  useEffect(() => {
    const totalCourseCount = courses?.length || 0;
    const activeCourseCount = courses?.filter(
      (course) => course?.status?.toLowerCase() === "active"
    )?.length;
    setCourseCount([
      { label: "Total Courses", count: totalCourseCount },
      { label: "Active Courses", count: activeCourseCount },
    ]);
  }, [courses]);

  const handleFilterClick = () => {
    setShowFilter(!showFilter);
  };

  const handleFiltersChange = (newFilters) => {
    setFilters(newFilters);
    setCurrentPage(1);
  };

  const handleSort = (key) => {
    setSortConfig((prevConfig) => ({
      key,
      direction:
        prevConfig.key === key && prevConfig.direction === "Asc"
          ? "Desc"
          : "Asc",
    }));
  };

  const handlePageChange = (page) => {
    setCurrentPage(page);
  };

  const handleEditCourse = (course) => {
    navigate(`/teacher/edit-course/${course?._id}`);
  };

  const handleDuplicateCourse = async (course) => {
    await dispatch(duplicateCourse(course?._id));
    dispatch(fetchCourses({ page: currentPage, limit: itemsPerPage }));
  };

  const handleDeleteCourse = async (courseId) => {
    await dispatch(removeCourse(courseId));
    dispatch(fetchCourses({ page: currentPage, limit: itemsPerPage }));
  };

  const handleCreateCourseClick = () => {
    navigate("/school/create-course");
  };

  // Sorting & filtering are now handled server-side; we only do pagination here
  const totalPages = pagination?.pages || 1;
  const totalItems = pagination?.total || 0;

  return (
    <div className="min-h-screen bg-background">
      {/* Page loader */}
      <PageLoaderOverlay show={pageLoading} label="Loading courses…" />
      {/* Header */}
      <RoleBasedHeader />
      <main className="max-w-[1450px] mx-auto px-4 sm:px-6 lg:px-8 pt-16 pb-20 lg:pb-8">
        {/* Top Section */}
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
                className={`${index !== courseCount.length - 1
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

        {/* Search */}
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

        {/* Filters */}
        {showFilter && (
          <CourseFilter filters={filters} onFiltersChange={handleFiltersChange} />
        )}

        {/* Table */}
        <CourseTable
          onSort={handleSort}
          sortConfig={sortConfig}
          currentPage={currentPage}
          totalPages={totalPages}
          totalItems={totalItems}
          onPageChange={handlePageChange}
          onEdit={handleEditCourse}
          onDuplicate={handleDuplicateCourse}
          onDelete={handleDeleteCourse}
          loading={loading}
          error={error}
        />
      </main>
    </div>
  );
};

export default ManageCourses;
