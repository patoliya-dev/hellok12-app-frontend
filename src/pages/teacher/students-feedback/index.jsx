import { useEffect, useState } from "react";
import Breadcrumb from "components/ui/Breadcrumb";
import RoleBasedHeader from "components/ui/RoleBasedHeader";
import Select from "components/ui/Select";
import FeedBackCard from "./components/FeedBackCard";
import FeedBackPagination from "./components/FeedBackPagination";
import Icon from "../../../components/AppIcon";

const breadCrumbData = [
  { label: "Dashboard", path: "/teacher/dashboard" },
  { label: "Student Feedback", path: "#", current: true },
];

const sortOptions = [
  { value: "newest", label: "Newest First" },
  { value: "oldest", label: "Oldest First" },
  { value: "highest", label: "Highest Rating" },
  { value: "lowest", label: "Lowest Rating" },
  { value: "helpful", label: "Most Helpful" },
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

  const itemsPerPage = 10;

  // Reset to first page when filters change
  useEffect(() => {
    setCurrentPage(1);
  }, [filterRating, sortBy]);

  // Mock student feedback
  const [studentFeedbacks] = useState([
    {
      id: "feedback-001",
      student: {
        id: "student-001",
        name: "Emma Wilson",
        avatar:
          "https://images.unsplash.com/photo-1544005313-94ddf0286df2?w=400&h=400&fit=crop&crop=face",
      },
      subject: "English Literature",
      rating: 5,
      comment: `Ms. Emma always encourages us to ask questions and makes sure that everyone is involved in class activities. She provides helpful feedback and motivates us to do our best.`,
      date: "2024-12-14",
      sessionDate: "December 14, 2024",
      tags: ["Patient", "Clear Explanations", "Knowledgeable"],
      parentFeedback: true,
    },
    {
      id: "feedback-002",
      student: {
        id: "student-002",
        name: "Alex Chen",
        avatar:
          "https://images.unsplash.com/photo-1507003211169-0a1dd7228f2d?w=400&h=400&fit=crop&crop=face",
      },
      subject: "Creative Writing",
      rating: 4,
      comment: `The creative writing session was fantastic! Ms. Johnson gave me great feedback on my story and helped me develop my characters better. I feel much more confident now.`,
      date: "2024-12-13",
      sessionDate: "December 13, 2024",
      tags: ["Creative", "Encouraging", "Detailed Feedback"],
    },
    {
      id: "feedback-003",
      student: {
        id: "student-003",
        name: "Sophia Martinez",
        avatar:
          "https://images.unsplash.com/photo-1438761681033-6461ffad8d80?w=400&h=400&fit=crop&crop=face",
      },
      subject: "English Literature",
      rating: 2,
      comment: `Good session overall. Ms. Johnson knows her subject well and provided helpful insights into the themes we discussed. Would recommend!`,
      date: "2024-12-12",
      sessionDate: "December 12, 2024",
      tags: ["Knowledgeable", "Helpful"],
    },
    {
      id: "feedback-004",
      student: {
        id: "student-004",
        name: "Ethan Brown",
        avatar:
          "https://images.unsplash.com/photo-1529626455594-4ff0802cfb7e?w=400&h=400&fit=crop&crop=face",
      },
      subject: "Chemistry",
      rating: 3,
      comment: `Explained organic chemistry in detail but could improve on keeping the class interactive.`,
      date: "2024-12-15",
      sessionDate: "December 15, 2024",
      tags: ["Detailed", "Needs Interaction"],
    },
    {
      id: "feedback-005",
      student: {
        id: "student-005",
        name: "Olivia Wilson",
        avatar:
          "https://images.unsplash.com/photo-1524504388940-b1c1722653e1?w=400&h=400&fit=crop&crop=face",
      },
      subject: "History",
      rating: 5,
      comment: `Absolutely loved the storytelling approach. Made history come alive with examples.`,
      date: "2024-12-18",
      sessionDate: "December 18, 2024",
      tags: ["Engaging", "Storytelling"],
    },
    {
      id: "feedback-006",
      student: {
        id: "student-006",
        name: "Noah Davis",
        avatar:
          "https://images.unsplash.com/photo-1535713875002-d1d0cf377fde?w=400&h=400&fit=crop&crop=face",
      },
      subject: "Computer Science",
      rating: 4,
      comment: `Good hands-on coding session. Would appreciate more time for Q&A.`,
      date: "2024-12-20",
      sessionDate: "December 20, 2024",
      tags: ["Practical", "Helpful"],
    },
    {
      id: "feedback-007",
      student: {
        id: "student-007",
        name: "Ava Taylor",
        avatar:
          "https://images.unsplash.com/photo-1544005313-94ddf0286df2?w=400&h=400&fit=crop&crop=face",
      },
      subject: "Biology",
      rating: 3,
      comment: `Covered a lot of material but sometimes difficult to follow along.`,
      date: "2024-12-22",
      sessionDate: "December 22, 2024",
      tags: ["Thorough", "Fast"],
    },
    {
      id: "feedback-008",
      student: {
        id: "student-008",
        name: "James Anderson",
        avatar:
          "https://images.unsplash.com/photo-1506794778202-cad84cf45f1d?w=400&h=400&fit=crop&crop=face",
      },
      subject: "Economics",
      rating: 5,
      comment: `Brilliant explanation of demand-supply concepts with real-world examples.`,
      date: "2024-12-24",
      sessionDate: "December 24, 2024",
      tags: ["Practical", "Engaging"],
    },
    {
      id: "feedback-009",
      student: {
        id: "student-009",
        name: "Mia Thompson",
        avatar:
          "https://images.unsplash.com/photo-1544723795-3fb6469f5b39?w=400&h=400&fit=crop&crop=face",
      },
      subject: "Geography",
      rating: 4,
      comment: `Loved the interactive maps and visuals used during the class.`,
      date: "2024-12-26",
      sessionDate: "December 26, 2024",
      tags: ["Visual", "Interactive"],
    },
    {
      id: "feedback-010",
      student: {
        id: "student-010",
        name: "Benjamin Lee",
        avatar:
          "https://images.unsplash.com/photo-1546456073-6712f79251bb?w=400&h=400&fit=crop&crop=face",
      },
      subject: "Philosophy",
      rating: 2,
      comment: `The discussion was deep but sometimes too abstract to follow.`,
      date: "2024-12-28",
      sessionDate: "December 28, 2024",
      tags: ["Thoughtful", "Abstract"],
    },
    {
      id: "feedback-011",
      student: {
        id: "student-011",
        name: "Charlotte White",
        avatar:
          "https://images.unsplash.com/photo-1517841905240-472988babdf9?w=400&h=400&fit=crop&crop=face",
      },
      subject: "Political Science",
      rating: 5,
      comment: `Very engaging debates and encouraged everyone to participate.`,
      date: "2025-01-02",
      sessionDate: "January 2, 2025",
      tags: ["Interactive", "Debates"],
    },
    {
      id: "feedback-012",
      student: {
        id: "student-012",
        name: "Daniel Harris",
        avatar:
          "https://images.unsplash.com/photo-1552058544-f2b08422138a?w=400&h=400&fit=crop&crop=face",
      },
      subject: "Art",
      rating: 4,
      comment: `Fun and creative session, but could provide more feedback on individual work.`,
      date: "2025-01-05",
      sessionDate: "January 5, 2025",
      tags: ["Creative", "Supportive"],
    },
  ]);

  // Filter and sort sessions
  const filteredAndSortedFeedbacks = () => {
    let filtered = studentFeedbacks;

    // Filter by rating
    if (filterRating !== "all") {
      filtered = filtered?.filter(
        (review) => review?.rating === parseInt(filterRating)
      );
    }

    // Sort reviews
    return filtered?.sort((a, b) => {
      switch (sortBy) {
        case "newest":
          return new Date(b.date) - new Date(a.date);
        case "oldest":
          return new Date(a.date) - new Date(b.date);
        case "highest":
          return b?.rating - a?.rating;
        case "lowest":
          return a?.rating - b?.rating;
        case "helpful":
          return (b?.helpfulCount || 0) - (a?.helpfulCount || 0);
        default:
          return 0;
      }
    });
  };

  const processedFeedback = filteredAndSortedFeedbacks();

  // Pagination
  const totalPages = Math.ceil(processedFeedback?.length / itemsPerPage);
  const paginatedFeedbacks = processedFeedback?.slice(
    (currentPage - 1) * itemsPerPage,
    currentPage * itemsPerPage
  );

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
          {paginatedFeedbacks?.length > 0 && (
            <div className="grid grid-cols-1 lg:grid-cols-2 gap-6 overflow-auto h-[62vh] p-6">
              {paginatedFeedbacks?.map((feedback) => (
                <FeedBackCard key={feedback.id} feedback={feedback} />
              ))}
            </div>
          )}
          {paginatedFeedbacks?.length === 0 && (
            <div className="flex flex-col items-center justify-center h-full">
              <Icon
                name="Calendar"
                size={48}
                className="text-muted-foreground mx-auto mb-4"
              />
              <h3 className="text-lg font-medium text-foreground mb-2">
                No sessions found
              </h3>
              <p className="text-muted-foreground">
                Try adjusting your filters to see more sessions.
              </p>
            </div>
          )}
          <FeedBackPagination
            currentPage={currentPage}
            totalPages={totalPages}
            totalItems={processedFeedback?.length}
            itemsPerPage={itemsPerPage}
            onPageChange={handlePageChange}
          />
        </section>
      </main>
    </div>
  );
};

export default StudentsFeedback;
