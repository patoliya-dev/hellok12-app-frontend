import { useEffect, useState, useMemo } from "react";
import RoleBasedHeader from "components/ui/RoleBasedHeader";
import Icon from "components/AppIcon";
import Button from "components/ui/Button";
import StudentFilter from "./components/StudentFilter";
import StudentTable from "./components/StudentsTable";
import { students } from "./data";

const Progress = () => {
  const [showFilter, setShowFilter] = useState(false);
  const [sortConfig, setSortConfig] = useState({
    key: "date",
    direction: "desc",
  });
  const [filters, setFilters] = useState({
    studentName: "",
    title: "all",
    dateRange: { start: "", end: "" },
    lessonName: "",
  });
  const [currentPage, setCurrentPage] = useState(1);
  const [searchTerm, setSearchTerm] = useState("");

  const itemsPerPage = 10;

  const handleFilterClick = () => {
    setFilters({
      studentName: "",
      title: "all",
      dateRange: { start: "", end: "" },
      lessonName: "",
    });
    setShowFilter(!showFilter);
    setCurrentPage(1);
  };

  const handleFiltersChange = (newFilters) => {
    setFilters(newFilters);
  };

  // Reset to first page when filters change
  useEffect(() => {
    setCurrentPage(1);
  }, [filters]);

  // Filter and sort sessions
  const filteredAndSortedStudents = useMemo(() => {
    let filtered = students?.filter((session) => {
      // Search filter
      if (
        searchTerm &&
        !session?.studentName.toLowerCase().includes(searchTerm.toLowerCase())
      ) {
        return false;
      }

      // Course name filter
      if (
        filters?.title !== "all" &&
        session?.title !== filters?.title
      ) {
        return false;
      }

      if (
        filters?.lessonName &&
        !session?.lessons?.includes(filters?.lessonName)
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
  }, [filters, sortConfig, searchTerm]);

  // Pagination
  const totalPages = Math.ceil(
    filteredAndSortedStudents?.length / itemsPerPage
  );
  const paginatedStudents = filteredAndSortedStudents?.slice(
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

  return (
    <div className="min-h-screen bg-background">
      {/* Header */}
      <RoleBasedHeader />
      <main className="max-w-[1450px] mx-auto px-4 sm:px-6 lg:px-8 pt-16 pb-20 lg:pb-8">
        <section className="my-8">
          <div>
            <h1 className="text-2xl font-semibold text-foreground mb-2">
              Students
            </h1>
            <p className="text-muted-foreground">
              Your learning upcoming lessons and booking history
            </p>
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
                placeholder="Search students name and age"
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
          <StudentFilter
            filters={filters}
            onFiltersChange={handleFiltersChange}
          />
        )}
        <StudentTable
          data={paginatedStudents}
          onSort={handleSort}
          sortConfig={sortConfig}
          currentPage={currentPage}
          totalPages={totalPages}
          totalItems={filteredAndSortedStudents?.length}
          onPageChange={handlePageChange}
        />
      </main>
    </div>
  );
};

export default Progress;
