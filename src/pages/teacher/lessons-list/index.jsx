import { useState, useEffect, useMemo } from "react";
import { useNavigate, useParams } from "react-router-dom";
import RoleBasedHeader from "../../../components/ui/RoleBasedHeader";
import Breadcrumb from "components/ui/Breadcrumb";
import Button from "components/ui/Button";
import { mockCourses } from "../manage-courses/data";
import CourseDetails from "./components/CourseDetails";
import Icon from "components/AppIcon";
import DateRangePicker from "components/ui/DateRangePicker";
import { successToast } from "../../../utils/utils";
import { itemsPerPage, mockLessons } from "./data";
import LessonsTable from "./components/LessonTable";

const LessonsList = () => {
  const { courseId } = useParams();
  const navigate = useNavigate();
  const [course, setCourse] = useState({});
  const [searchTerm, setSearchTerm] = useState("");
  const [lessons, setLessons] = useState(mockLessons);
  const [currentPage, setCurrentPage] = useState(1);
  const [filters, setFilters] = useState({
    startDate: "",
    endDate: "",
  });
  const [breadCrumbData, setBreadCrumbData] = useState([
    {
      label: "Manage Courses",
      path: "/teacher/manage-courses",
    },
    {
      label: "Lessons List",
      path: "#",
      current: true,
    },
  ]);
  const [sortConfig, setSortConfig] = useState({
    key: "title",
    direction: "desc",
  });

  useEffect(() => {
    const course = mockCourses?.find((c) => c?.id === courseId);
    if (course) {
      setCourse(course);
      setBreadCrumbData([
        {
          label: "Manage Courses",
          path: "/teacher/manage-courses",
        },
        {
          label: course.courseName,
          path: "#",
          current: true,
        },
      ]);
    }
  }, [courseId, mockCourses]);

  // Reset to first page when filters change
  useEffect(() => {
    setCurrentPage(1);
  }, [filters]);

  const handleFiltersChange = (newFilters) => {
    setFilters(newFilters);
  };

  const handleSort = (key) => {
    setSortConfig((prevConfig) => ({
      key,
      direction:
        prevConfig?.key === key && prevConfig?.direction === "asc"
          ? "desc"
          : "asc",
    }));
  };

  // Filter and sort courses
  const processedLessons = useMemo(() => {
    let filtered = [...lessons];

    // Apply filters
    if (searchTerm && searchTerm.length > 0) {
      filtered = filtered?.filter(
        (lesson) =>
          lesson?.title?.toLowerCase()?.includes(searchTerm?.toLowerCase()) ||
          lesson?.description
            ?.toLowerCase()
            ?.includes(searchTerm?.toLowerCase())
      );
    }

    if (filters?.startDate) {
      filtered = filtered?.filter(
        (lesson) => new Date(lesson.createdAt) >= new Date(filters?.startDate)
      );
    }

    if (filters?.endDate) {
      filtered = filtered?.filter(
        (lesson) => new Date(lesson.createdAt) <= new Date(filters?.endDate)
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
  }, [searchTerm, lessons, filters, sortConfig]);

  // Pagination
  const totalPages = Math.ceil(processedLessons?.length / itemsPerPage);
  const paginatedLessons = processedLessons?.slice(
    (currentPage - 1) * itemsPerPage,
    currentPage * itemsPerPage
  );

  const handlePageChange = (page) => {
    setCurrentPage(page);
  };

  const handleEditLesson = () => {
    navigate(`/teacher/edit-lesson/${courseId}`);
  };

  const handleDuplicateLesson = (lesson) => {
    const duplicatedLesson = {
      ...lesson,
      id: Date.now()?.toString(),
      title: `${lesson?.title} (Copy)`,
      status: "draft",
      createdAt: new Date()?.toISOString(),
    };
    setLessons([...lessons, duplicatedLesson]);
  };

  const handleDeleteLesson = (lessonId) => {
    setLessons(lessons?.filter((lesson) => lesson?.id !== lessonId));
  };

  const handleCreateLesson = () => {
    navigate(`/teacher/create-lesson/${courseId}`);
  };

  return (
    <div className="min-h-screen bg-background">
      {/* Header */}
      <RoleBasedHeader />
      <main className="max-w-[1450px] mx-auto px-4 sm:px-6 lg:px-8 pt-16 pb-20 lg:pb-8">
        <section className="my-8 flex flex-col gap-y-6 md:gap-y-0 md:flex-row md:justify-between md:items-center">
          <Breadcrumb customPath={breadCrumbData} />
          <Button size="sm" iconName="Plus" onClick={handleCreateLesson}>
            Create New Lesson
          </Button>
        </section>
        <CourseDetails course={course} />

        <section className="my-8">
          <div className="flex flex-col sm:flex-row sm:justify-between gap-3">
            <div className="relative md:w-[65%] lg:w-[70%] xl:w-[80%]">
              <Icon
                name="Search"
                size={16}
                color="var(--color-muted-foreground)"
                className="absolute left-3 top-1/2 transform -translate-y-1/2"
              />
              <input
                type="text"
                placeholder="Search lessons by name, description"
                value={searchTerm}
                onChange={(e) => setSearchTerm(e.target.value)}
                className="pl-10 pr-4 py-2 border border-border rounded-lg bg-input text-foreground placeholder:text-muted-foreground focus:outline-none focus:ring-2 focus:ring-ring w-full"
              />
            </div>
            <DateRangePicker onChange={handleFiltersChange} />
          </div>
        </section>
        <LessonsTable
          data={paginatedLessons}
          onSort={handleSort}
          sortConfig={sortConfig}
          currentPage={currentPage}
          totalPages={totalPages}
          totalItems={processedLessons?.length}
          onPageChange={handlePageChange}
          onEdit={handleEditLesson}
          onDuplicate={handleDuplicateLesson}
          onDelete={handleDeleteLesson}
        />
      </main>
    </div>
  );
};

export default LessonsList;
