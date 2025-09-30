import { useNavigate } from "react-router-dom";
import Icon from "components/AppIcon";
import Image from "components/AppImage";
import Button from "components/ui/Button";
import Pagination from "components/ui/Pagination";

const formatDate = (dateString) => {
  const date = new Date(dateString);
  return date?.toLocaleDateString("en-US", {
    month: "short",
    day: "numeric",
    year: "numeric",
  });
};

const formatTime = (timeString) => {
  const time = new Date(`2000-01-01T${timeString}`);
  return time?.toLocaleTimeString("en-US", {
    hour: "numeric",
    minute: "2-digit",
    hour12: true,
  });
};

const StudentTable = ({
  data,
  onSort,
  sortConfig,
  currentPage,
  totalPages,
  totalItems,
  onPageChange,
}) => {
  const navigate = useNavigate();

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

  const handleNavigate = (type) => {
    if (type === "message") {
      navigate("/teacher/messages");
    } else {
      alert("Under development");
    }
  };

  return (
    <section className="bg-card border border-border rounded-lg overflow-hidden">
      {/* Desktop Table */}
      <div className="overflow-x-auto">
        <table className="w-full">
          <thead className="bg-muted/30">
            <tr>
              <th className="px-6 py-4 text-left">
                <button
                  onClick={() => onSort("studentName")}
                  className="flex items-center gap-2 text-sm font-medium text-foreground hover:text-primary transition-smooth"
                >
                  Student Name
                  {getSortIcon("studentName")}
                </button>
              </th>
              <th className="px-6 py-4 text-left">
                <span className="text-sm font-medium text-foreground">
                  Course Name
                </span>
              </th>
              <th className="px-6 py-4 text-left">
                <button
                  onClick={() => onSort("date")}
                  className="flex items-center gap-2 text-sm font-medium text-foreground hover:text-primary transition-smooth"
                >
                  Date & Time
                  {getSortIcon("date")}
                </button>
              </th>
              <th className="px-6 py-4">
                <span className="text-sm font-medium text-foreground">
                  Actions
                </span>
              </th>
            </tr>
          </thead>
          <tbody>
            {data?.map((stud) => (
              <tr
                key={stud?.id}
                className="border-t border-border hover:bg-muted/30 transition-smooth"
              >
                <td className="px-6 py-4">
                  <div className="flex items-center gap-4">
                    <Image
                      src={stud?.studentImage}
                      alt={stud?.studentName}
                      width={40}
                      height={40}
                      className="w-10 h-10 rounded-full"
                    />
                    <div>
                      <div className="font-medium text-foreground">
                        {stud?.studentName}
                      </div>
                      <div className="text-sm text-muted-foreground">
                        {stud?.studentAge} years old
                      </div>
                    </div>
                  </div>
                </td>
                <td className="px-6 py-4">
                  <span className="font-medium text-foreground">
                    {stud?.courseName}
                  </span>
                </td>
                <td className="px-6 py-4">
                  <div>
                    <div className="font-medium text-foreground">
                      {formatDate(stud?.date)}
                    </div>
                    <div className="text-sm text-muted-foreground">
                      {formatTime(stud?.time)}
                    </div>
                  </div>
                </td>
                <td className="px-6 py-4">
                  <div className="flex justify-center items-center">
                    <Button
                      variant="outline"
                      size="lg"
                      iconName="MessageCircle"
                      onClick={() => handleNavigate("message")}
                    >
                      Message
                    </Button>
                    <Button
                      variant="outline"
                      size="lg"
                      iconName="TrendingUp"
                      onClick={() => handleNavigate("progress")}
                    >
                      View Progress
                    </Button>
                  </div>
                </td>
              </tr>
            ))}
          </tbody>
        </table>
      </div>
      {data?.length === 0 && (
        <div className="flex flex-col items-center justify-center h-full">
          <Icon
            name="Calendar"
            size={48}
            className="text-muted-foreground mx-auto mb-4"
          />
          <h3 className="text-lg font-medium text-foreground mb-2">
            No stud found
          </h3>
          <p className="text-muted-foreground">
            Try adjusting your filters to see more students.
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

export default StudentTable;
