import { useState } from "react";
import Icon from "components/AppIcon";
import Pagination from "components/ui/Pagination";
import ActionMenu from "../../../../pages/teacher/manage-courses/components/ActionMenu";
import { capitalize } from "../../../../utils/utils";

const LessonsTable = ({
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
  const [openMenuId, setOpenMenuId] = useState(null);

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

  function formatDateTime(dateString) {
    const dateObj = new Date(dateString);
    return {
      date: dateObj.toLocaleDateString("en-US", {
        month: "short",
        day: "2-digit",
        year: "numeric",
      }),
      time: dateObj.toLocaleTimeString("en-US", {
        hour: "2-digit",
        minute: "2-digit",
        hour12: true,
      }),
    };
  }

  const getStatus = (status) => {
    const isPublished = status === "published";
    return (
      <div className="flex items-center gap-2">
        {isPublished ? (
          <Icon name="CheckCircle" size={16} className="text-green-600" />
        ) : (
          <Icon name="Clock" size={16} className="text-warning" />
        )}
        <span
          className={`text-xs font-medium ${
            isPublished ? "text-green-600" : "text-warning"
          }`}
        >
          {capitalize(status)}
        </span>
      </div>
    );
  };

  const toggleMenu = (courseId) => {
    setOpenMenuId(openMenuId === courseId ? null : courseId);
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
                  Lesson Title
                  {getSortIcon("title")}
                </button>
              </th>
              <th className="px-6 py-4 text-left">
                <button
                  onClick={() => onSort("createdAt")}
                  className="flex items-center gap-2 text-sm font-medium text-foreground hover:text-primary transition-smooth"
                >
                  Date & Time
                  {getSortIcon("createdAt")}
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
            {data?.map((lesson) => (
              <tr
                key={lesson?.id}
                className="border-t border-border hover:bg-muted/30 transition-smooth"
              >
                <td className="px-6 py-4">
                  <div className="flex items-center gap-4">
                    <Icon name="BookOpen" size={20} className="text-primary" />
                    <div>
                      <div className="font-medium text-brand-gray-800">
                        {lesson?.title}
                      </div>
                    </div>
                  </div>
                </td>
                <td className="px-6 py-4">
                  {(() => {
                    const { date, time } = formatDateTime(lesson?.createdAt);
                    return (
                      <div>
                        <div className="font-medium text-foreground">
                          {date}
                        </div>
                        <div className="text-sm text-muted-foreground">
                          {time}
                        </div>
                      </div>
                    );
                  })()}
                </td>
                <td className="px-6 py-4">{getStatus(lesson?.status)}</td>
                <td className="relative px-6 py-4">
                  <Icon
                    name="MoreVertical"
                    size={20}
                    className="text-muted-foreground cursor-pointer"
                    onClick={() => toggleMenu(lesson?.id)}
                  />
                  {openMenuId === lesson?.id && (
                    <ActionMenu
                      data={lesson}
                      setOpenMenuId={toggleMenu}
                      onEdit={onEdit}
                      onDuplicate={onDuplicate}
                      onDelete={onDelete}
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
    </section>
  );
};

export default LessonsTable;
