import { useEffect, useState } from "react";
import Breadcrumb from "components/ui/Breadcrumb";
import RoleBasedHeader from "components/ui/RoleBasedHeader";
import Select from "components/ui/Select";
import FeedBackCard from "./components/FeedBackCard";
import FeedBackPagination from "./components/FeedBackPagination";
import Icon from "../../../components/AppIcon";
import { feedbackRatingAPI } from "../../../services/feedbacks/feedback.service";
import { toast } from "react-toastify";
import Loader from "components/ui/Loader";

const breadCrumbData = [
  { label: "Dashboard", path: "/teacher/dashboard" },
  { label: "Student Feedback", path: "#", current: true },
];

const sortOptions = [
  { value: "newest", label: "Newest First" },
  { value: "oldest", label: "Oldest First" },
  { value: "highest", label: "Highest Rating" },
  { value: "lowest", label: "Lowest Rating" },
];

const ratingOptions = [
  { value: "all", label: "All Ratings" },
  { value: "5", label: "5 Stars" },
  { value: "4", label: "4 Stars" },
  { value: "3", label: "3 Stars" },
  { value: "2", label: "2 Stars" },
  { value: "1", label: "1 Star" },
];

const StudentsFeedback = () => {
  const [sortBy, setSortBy] = useState("newest");
  const [filterRating, setFilterRating] = useState("all");
  const [currentPage, setCurrentPage] = useState(1);
  const [feedbacks, setFeedbacks] = useState([]);
  const [loading, setLoading] = useState(false);
  const [totalPages, setTotalPages] = useState(0);
  const [totalItems, setTotalItems] = useState(0);

  const itemsPerPage = 10;

  // Fetch feedbacks from API
  const fetchFeedbacks = async () => {
    try {
      setLoading(true);
      const params = {
        page: currentPage,
        limit: itemsPerPage,
        sortBy: sortBy,
        rating: filterRating,
      };

      const response = await feedbackRatingAPI.getFeedbackRatings(params);
      console.log("API Response:", response);

      const feedbackData = response.data || response.feedbacks || [];
      const paginationData = response.pagination || response.meta || {};

      const calculatedTotalPages = paginationData.totalPages ||
        Math.ceil((paginationData.total || feedbackData.length) / itemsPerPage);
      const calculatedTotalItems = paginationData.totalItems || paginationData.total || feedbackData.length;

      setFeedbacks(feedbackData);
      setTotalPages(feedbackData.length > 0 ? Math.max(calculatedTotalPages, 1) : 0);
      setTotalItems(calculatedTotalItems);

      console.log("Parsed data:", {
        feedbackCount: feedbackData.length,
        totalPages: feedbackData.length > 0 ? Math.max(calculatedTotalPages, 1) : 0,
        totalItems: calculatedTotalItems
      });
    } catch (error) {
      console.error("Error fetching feedbacks:", error);
      toast.error(error?.message || "Failed to fetch feedbacks");
      setFeedbacks([]);
      setTotalPages(0);
      setTotalItems(0);
    } finally {
      setLoading(false);
    }
  };
  useEffect(() => {
    setCurrentPage(1);
  }, [filterRating, sortBy]);

  useEffect(() => {
    fetchFeedbacks();
  }, [currentPage, sortBy, filterRating]);

  const handlePageChange = (page) => {
    setCurrentPage(page);
  };

  return (
    <div className="min-h-screen bg-background">
      {/* Header */}
      <RoleBasedHeader />
      <main className="max-w-[1450px] mx-auto px-4 sm:px-6 lg:px-8 pt-16 pb-20 lg:pb-8">
        <Breadcrumb customPath={breadCrumbData} className="mt-8" />
        <section>
          <div className="flex flex-col gap-6 md:gap-0 md:flex-row md:justify-between md:items-center">
            <div>
              <h1 className="text-foreground font-bold text-h3 mb-2">
                Student Feedback
              </h1>
              <p className="text-muted-foreground text-body2 xl:text-[16px]">
                Collect and review authentic student feedback
              </p>
            </div>
            <div className="flex items-center space-x-4">
              <Select
                label="Filter by Rating"
                options={ratingOptions}
                value={filterRating}
                onChange={setFilterRating}
                className="md:w-44 lg:w-52"
              />
              <Select
                label="Sort by"
                options={sortOptions}
                value={sortBy}
                onChange={setSortBy}
                className="md:w-44 lg:w-52"
              />
            </div>
          </div>
        </section>
        <section className="mt-8 border border-border rounded-lg h-[70vh]">
          {loading ? (
            <Loader />
          ) : feedbacks?.length > 0 ? (
            <div className="grid grid-cols-1 lg:grid-cols-2 gap-6 overflow-auto h-[62vh] p-6">
              {feedbacks?.map((feedback) => (
                <FeedBackCard key={feedback._id} feedback={feedback} />
              ))}
            </div>
          ) : (
            <div className="flex flex-col items-center justify-center h-full">
              <Icon
                name="Calendar"
                size={48}
                className="text-muted-foreground mx-auto mb-4"
              />
              <h3 className="text-lg font-medium text-foreground mb-2">
                No feedbacks found
              </h3>
              <p className="text-muted-foreground">
                Try adjusting your filters to see more feedbacks.
              </p>
            </div>
          )}
          <FeedBackPagination
            currentPage={currentPage}
            totalPages={totalPages}
            totalItems={totalItems}
            itemsPerPage={itemsPerPage}
            onPageChange={handlePageChange}
          />
        </section>
      </main>
    </div>
  );
};

export default StudentsFeedback;
