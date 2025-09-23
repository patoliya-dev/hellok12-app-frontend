import { useEffect, useMemo, useState } from "react";
import RoleBasedHeader from "components/ui/RoleBasedHeader";
import LessonFilters from "./components/LessonFilters";
import LessonTable from "./components/LessonTable";
import LessonPagination from "./components/LessonPagination";
import Icon from "components/AppIcon";
import GroupedStudents from "./components/GroupedStudents";
import mockLessons from "./data";

const ManageLessons = () => {
  const [currentPage, setCurrentPage] = useState(1);
  const [sortConfig, setSortConfig] = useState({
    key: "date",
    direction: "desc",
  });
  const [filters, setFilters] = useState({
    status: "all",
    studentName: "",
    dateRange: { start: "", end: "" },
  });
  const [showModal, setShowModal] = useState(false);
  const [lesson, setLesson] = useState(null);

  const itemsPerPage = 10;

  const handleFiltersChange = (newFilters) => {
    setFilters(newFilters);
  };

  // Reset to first page when filters change
  useEffect(() => {
    setCurrentPage(1);
  }, [filters]);

  // Filter and sort sessions
  const filteredAndSortedSessions = useMemo(() => {
    let filtered = mockLessons?.filter((session) => {
      // Status filter
      if (filters?.status !== "all" && session?.status !== filters?.status) {
        return false;
      }

      // Student name filter
      if (
        filters?.studentName &&
        !session?.studentName
          ?.toLowerCase()
          ?.includes(filters?.studentName?.toLowerCase())
      ) {
        return false;
      }

      // Date range filter
      if (
        filters?.dateRange?.start &&
        session?.date < filters?.dateRange?.start
      ) {
        return false;
      }
      if (filters?.dateRange?.end && session?.date > filters?.dateRange?.end) {
        return false;
      }

      return true;
    });

    // Sort sessions
    filtered?.sort((a, b) => {
      let aValue = a?.[sortConfig?.key];
      let bValue = b?.[sortConfig?.key];

      if (sortConfig?.key === "date") {
        aValue = new Date(`${a.date}T${a.time}`);
        bValue = new Date(`${b.date}T${b.time}`);
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
  }, [filters, sortConfig]);

  // Pagination
  const totalPages = Math.ceil(
    filteredAndSortedSessions?.length / itemsPerPage
  );
  const paginatedSessions = filteredAndSortedSessions?.slice(
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

  const pendingLessonsCount = mockLessons?.filter(
    (s) => s?.status === "pending"
  )?.length;

  const handleShowModal = (id) => {
    const lesson = mockLessons?.find((s) => s?.id === id);
    setLesson(lesson);
    setShowModal(true);
  };

  const handleCloseModal = () => {
    setShowModal(false);
    setLesson(null);
  };

  return (
    <div className="min-h-screen bg-background">
      {/* Header */}
      <RoleBasedHeader />
      <main className="max-w-[1450px] mx-auto px-4 sm:px-6 lg:px-8 pt-16 pb-20 lg:pb-8">
        <section className="my-8">
          <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between mb-6">
            <div>
              <h1 className="text-2xl font-semibold text-foreground mb-2">
                Manage Lessons
              </h1>
              <p className="text-muted-foreground">
                Manage your teaching lessons and student bookings
              </p>
            </div>

            {/* Pending Sessions Alert */}
            {pendingLessonsCount > 0 && (
              <div className="flex items-center gap-2 px-4 py-2 bg-warning/10 text-warning border border-warning/20 rounded-lg mt-4 sm:mt-0">
                <Icon name="Clock" size={16} />
                <span className="text-sm font-medium">
                  {pendingLessonsCount} lesson
                  {pendingLessonsCount > 1 ? "s" : ""} pending
                </span>
              </div>
            )}
          </div>
        </section>
        {/* Filters */}
        <LessonFilters
          filters={filters}
          onFiltersChange={handleFiltersChange}
        />

        {/* Lessons Table */}
        <LessonTable
          sessions={paginatedSessions}
          onSort={handleSort}
          sortConfig={sortConfig}
          onShowModal={handleShowModal}
        />

        {/* Pagination */}
        <LessonPagination
          currentPage={currentPage}
          totalPages={totalPages}
          totalItems={filteredAndSortedSessions?.length}
          itemsPerPage={itemsPerPage}
          onPageChange={handlePageChange}
        />
      </main>

      {showModal && (
        <GroupedStudents
          students={lesson?.students}
          onClose={handleCloseModal}
        />
      )}
    </div>
  );
};

export default ManageLessons;
