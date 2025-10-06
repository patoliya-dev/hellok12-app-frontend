import { useState } from "react";
import Icon from "components/AppIcon";
import Pagination from "components/ui/Pagination";
import ActionMenu from "../../../../pages/teacher/manage-courses/components/ActionMenu";
import { capitalize } from "../../../../utils/utils";
import DeleteModal from "components/ui/DeleteModal";

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
  const [showDeleteModal, setShowDeleteModal] = useState(false);
  const [deleteLessonId, setDeleteLessonId] = useState(null);

  const handleDeleteModal = () => {
    setShowDeleteModal(!showDeleteModal);
  };

  const getSortIcon = (column) => {
    if (sortConfig?.key !== column) {
      return (
        <Icon
          name="ArrowUpDown"
          size={14}
          className="text-muted-foreground flex-shrink-0"
        />
      );
    }
    return sortConfig?.direction === "asc" ? (
      <Icon name="ArrowUp" size={14} className="text-primary flex-shrink-0" />
    ) : (
      <Icon name="ArrowDown" size={14} className="text-primary flex-shrink-0" />
    );
  };

  const formatDateTime = (dateString) => {
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
  };

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

  const toggleMenu = (lessonId) => {
    setOpenMenuId(openMenuId === lessonId ? null : lessonId);
  };

  const isTrailAvailable = () => (
    <div className="space-y-1 w-[150px]">
      <span className="inline-flex items-center px-3.5 py-1.5 rounded-full text-xs font-medium bg-[#DDF2FF] text-[#009DFF]">
        <Icon name={"Gift"} size={16} className="mr-1" />
        Trial Lesson
      </span>
    </div>
  );

  return (
    <section className="bg-card border border-border rounded-lg overflow-hidden">
      {/* Scrollable table for md+ screens */}
      <div className="hidden md:block overflow-x-auto">
        <table className="w-full min-w-[700px]">
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
              <th className="px-6 py-4 text-left"></th>
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
                    <Icon
                      name="BookOpen"
                      size={20}
                      className="text-primary flex-shrink-0"
                    />
                    <div className="min-w-0">
                      <div className="font-medium text-brand-gray-800 w-[250px] line-clamp-1">
                        {lesson?.title}
                      </div>
                    </div>
                  </div>
                </td>
                <td className="px-6 py-4">
                  {lesson?.isTrailAvailable && isTrailAvailable()}
                </td>
                <td className="px-6 py-4">
                  {(() => {
                    const { date, time } = formatDateTime(lesson?.createdAt);
                    return (
                      <div className="md:w-[150px] xl:w-auto">
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
                      onDelete={() => {
                        setDeleteLessonId(lesson?.id);
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

      {/* Mobile-friendly card layout */}
      <div className="md:hidden divide-y divide-border">
        {data?.map((lesson) => {
          const { date, time } = formatDateTime(lesson?.createdAt);
          return (
            <div key={lesson?.id} className="p-4">
              <div className="flex justify-between items-start">
                <div className="flex items-center gap-3">
                  <Icon
                    name="BookOpen"
                    size={20}
                    className="text-primary flex-shrink-0"
                  />
                  <div>
                    <div className="font-medium text-brand-gray-800 line-clamp-1">
                      {lesson?.title}
                    </div>
                  </div>
                </div>

                <Icon
                  name="MoreVertical"
                  size={18}
                  className="text-muted-foreground cursor-pointer flex-shrink-0"
                  onClick={() => toggleMenu(lesson?.id)}
                />
              </div>

              <div className="mt-3 flex justify-between items-center text-sm text-muted-foreground">
                <div>
                  <span className="block font-medium text-foreground mb-2">
                    {date}
                  </span>
                  <span>{time}</span>
                </div>
                <div>{getStatus(lesson?.status)}</div>
              </div>

              {lesson?.isTrailAvailable && (
                <div className="mt-4">{isTrailAvailable()}</div>
              )}

              {openMenuId === lesson?.id && (
                <div className="">
                  <ActionMenu
                    className={`!right-10 ${
                      lesson?.isTrailAvailable ? "!mt-[-95px]" : "!mt-[-50px]"
                    }`}
                    data={lesson}
                    setOpenMenuId={toggleMenu}
                    onEdit={onEdit}
                    onDuplicate={onDuplicate}
                    onDelete={() => {
                      setDeleteLessonId(lesson?.id);
                      handleDeleteModal();
                    }}
                  />
                </div>
              )}
            </div>
          );
        })}
      </div>

      {/* Empty state */}
      {data?.length === 0 && (
        <div className="flex flex-col items-center justify-center h-[300px]">
          <Icon
            name="Calendar"
            size={48}
            className="text-muted-foreground mx-auto mb-4"
          />
          <h3 className="text-lg font-medium text-foreground mb-2">
            No lessons found
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
          type="lesson"
          onConfirm={() => {
            onDelete(deleteLessonId);
            setDeleteLessonId(null);
            handleDeleteModal();
          }}
          onClose={() => {
            setDeleteLessonId(null);
            handleDeleteModal();
          }}
        />
      )}
    </section>
  );
};

export default LessonsTable;
