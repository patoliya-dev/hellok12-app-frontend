import { useState } from "react";
import { useNavigate } from "react-router-dom";
import Icon from "components/AppIcon";
import Pagination from "components/ui/Pagination";
import ActionMenu from "./ActionMenu";
import DeleteModal from "components/ui/DeleteModal";

const CourseTable = ({
  data,
  onSort,
  sortConfig,
  currentPage,
  totalPages,
  totalItems,
  onPageChange,
  onEdit,
  onDuplicate,
  onDelete,
}) => {
  const navigate = useNavigate();
  const [openMenuId, setOpenMenuId] = useState(null);
  const [showDeleteModal, setShowDeleteModal] = useState(false);
  const [deleteCourseId, setDeleteCourseId] = useState(null);

  const getSortIcon = (column) => {
    if (sortConfig?.key !== column) {
      return (
        <Icon name="ArrowUpDown" size={14} className="text-muted-foreground" />
      );
    }
    return sortConfig?.direction === "asc" ? (
      <Icon name="ArrowUp" size={14} className="text-primary" />
    ) : (
      <Icon name="ArrowDown" size={14} className="text-primary" />
    );
  };

  const getStatusBadge = (status) => {
    const statusConfig = {
      active: {
        bg: "bg-green-50",
        text: "text-green-700",
        border: "border-green-500",
        label: "Active",
      },
      draft: {
        bg: "bg-yellow-50",
        text: "text-yellow-700",
        border: "border-yellow-500",
        label: "Draft",
      },
      archived: {
        bg: "bg-gray-100",
        text: "text-gray-600",
        border: "border-gray-500",
        label: "Archived",
      },
      full: {
        bg: "bg-red-50",
        text: "text-red-700",
        border: "border-red-500",
        label: "Full",
      },
    };

    const config = statusConfig?.[status] || statusConfig?.draft;

    return (
      <span
        className={`inline-flex items-center px-3.5 py-1.5 rounded-full text-xs font-medium border ${config.border} ${config.bg} ${config.text}`}
      >
        {config.label}
      </span>
    );
  };

  const toggleMenu = (courseId) => {
    setOpenMenuId(openMenuId === courseId ? null : courseId);
  };

  const handleNavigate = (id) => {
    navigate(`/teacher/lessons/${id}`);
    setOpenMenuId(null);
  };

  const handleDeleteModal = () => {
    setShowDeleteModal(!showDeleteModal);
  };

  return (
    <section className="bg-card border border-border rounded-lg overflow-hidden">
      <div className="overflow-x-auto">
        <table className="w-full">
          <thead className="bg-muted/30">
            <tr>
              <th className="px-6 py-4 text-left">
                <button
                  onClick={() => onSort("title")}
                  className="flex items-center gap-2 text-sm font-medium text-foreground hover:text-primary transition-smooth"
                >
                  Course Title
                  {getSortIcon("title")}
                </button>
              </th>
              <th className="px-6 py-4 text-left">
                <button
                  onClick={() => onSort("language")}
                  className="flex items-center gap-2 text-sm font-medium text-foreground hover:text-primary transition-smooth"
                >
                  Language
                  {getSortIcon("language")}
                </button>
              </th>
              <th className="px-6 py-4 text-left">
                <span className="text-sm font-medium text-foreground">
                  Students
                </span>
              </th>
              <th className="px-6 py-4 text-left">
                <button
                  onClick={() => onSort("price")}
                  className="flex items-center gap-2 text-sm font-medium text-foreground hover:text-primary transition-smooth"
                >
                  Price
                  {getSortIcon("price")}
                </button>
              </th>
              <th className="px-6 py-4 text-left">
                <button
                  onClick={() => onSort("status")}
                  className="flex items-center gap-2 text-sm font-medium text-foreground hover:text-primary transition-smooth"
                >
                  Status
                  {getSortIcon("status")}
                </button>
              </th>
              <th className="px-6 py-4 text-left">
                <span className="text-sm font-medium text-foreground">
                  Actions
                </span>
              </th>
            </tr>
          </thead>
          <tbody>
            {data?.map((course) => (
              <tr
                key={course?.id}
                className="border-t border-border hover:bg-muted/30 transition-smooth"
              >
                <td className="px-6 py-4">
                  <div className="flex items-center gap-4">
                    <Icon
                      name="BookOpen"
                      size={20}
                      className="text-primary flex-shrink-0"
                    />
                    <div>
                      <div
                        className="font-medium text-foreground hover:cursor-pointer line-clamp-1 hover:text-primary transition-smooth w-[300px]"
                        onClick={() => handleNavigate(course?.id)}
                      >
                        {course?.title}
                      </div>
                      <div className="text-sm text-muted-foreground">
                        {course?.lessonCount} lessons
                      </div>
                    </div>
                  </div>
                </td>
                <td className="px-6 py-4">
                  <span className="font-medium text-foreground">
                    {course?.language}
                  </span>
                </td>
                <td className="px-6 py-4">
                  <span className="font-medium text-foreground">
                    {`${course?.studentCount}/${course?.maxStudents}`}
                  </span>
                </td>
                <td className="px-6 py-4">
                  <span className="font-medium text-foreground">
                    ${course?.price}
                  </span>
                </td>
                <td className="px-6 py-4">{getStatusBadge(course?.status)}</td>
                <td className="relative px-6 py-4">
                  <Icon
                    name="MoreVertical"
                    size={20}
                    className="text-muted-foreground cursor-pointer"
                    onClick={() => toggleMenu(course?.id)}
                  />
                  {openMenuId === course?.id && (
                    <ActionMenu
                      data={course}
                      setOpenMenuId={toggleMenu}
                      onEdit={onEdit}
                      onDuplicate={onDuplicate}
                      onDelete={() => {
                        setDeleteCourseId(course?.id);
                        handleDeleteModal();
                      }}
                    />
                  )}
                </td>
              </tr>
            ))}
          </tbody>
        </table>
      </div>
      {data?.length === 0 && (
        <div className="flex flex-col items-center justify-center h-[400px]">
          <Icon
            name="Calendar"
            size={48}
            className="text-muted-foreground mx-auto mb-4"
          />
          <h3 className="text-lg font-medium text-foreground mb-2">
            No courses found
          </h3>
          <p className="text-muted-foreground">
            Try adjusting your filters to see more results.
          </p>
        </div>
      )}
      <Pagination
        currentPage={currentPage}
        totalPages={totalPages}
        totalItems={totalItems}
        onPageChange={onPageChange}
      />

      {showDeleteModal && (
        <DeleteModal
          type="course"
          onConfirm={() => {
            onDelete(deleteCourseId);
            setDeleteCourseId(null);
            handleDeleteModal();
          }}
          onClose={() => {
            setDeleteCourseId(null);
            handleDeleteModal();
          }}
        />
      )}
    </section>
  );
};

export default CourseTable;
