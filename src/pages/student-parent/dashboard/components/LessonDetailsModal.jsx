import React, { useState } from "react";
import {
  X,
  MessageSquare,
  Star,
  Calendar,
  Clock,
  Gamepad2,
  FlaskConical,
  User,
  Video,
  AlertCircle,
  Gift,
  MapPin,
} from "lucide-react";
import { useNavigate } from "react-router-dom";
import { useSelector } from "react-redux";
import Badge from "../../../../components/ui/Badge";
import { VideoIcon } from "components/icons";
import Icon from "components/ui/Icon";
import { getRolePath } from "../../../../utils/rolePath";
import FeedbackModal from "./FeedbackModal";
import { feedbackRatingAPI } from "../../../../services/feedbacks/feedback.service";
import { errorToast } from "../../../../utils/utils";

const tagDetails = {
  "Curriculum-Aligned Games": { icon: <Gamepad2 size={16} />, color: "orange" },
  "Trial Lessons": { icon: <Gift size={16} />, color: "sky" },
  "1-on-1": { icon: <User size={16} />, color: "blue" }, // Assuming you add 'purple' to your Badge colors
  "Online Course": {
    icon: <VideoIcon size={14} className="w-[12px] h-[10px]" selected={true} />,
    color: "green",
  },
  "In-Person": { icon: <User size={16} />, color: "blue" },
  Group: { icon: <User size={16} />, color: "blue" },
};

const statusDetails = {
  "starting-soon": {
    color: "orange",
    icon: <AlertCircle size={14} />,
    text: "Starting Soon",
  },
  scheduled: { color: "blue", icon: <Calendar size={14} />, text: "Scheduled" },
  completed: { color: "green", text: "Completed" },
  pending: { color: "sky", text: "Pending" },
  cancelled: { color: "error", text: "Cancelled" },
};

const LessonDetailsModal = ({ lesson, onClose, onFeedbackSubmitted }) => {
  const navigate = useNavigate();
  const authUser = useSelector((state) => state.auth.user);
  const selectedChildId = useSelector((state) => state.profile.selectedChildId);
  const [showFeedbackModal, setShowFeedbackModal] = useState(false);
  const [isSubmitting, setIsSubmitting] = useState(false);

  if (!lesson) {
    return null;
  }

  const statusInfo = statusDetails[lesson.status] || statusDetails["pending"];

  const handleMessage = () => {
    navigate(getRolePath(authUser?.role || "student", "messages"));
  };

  const handleFeedback = () => {
    // onClose();
    setShowFeedbackModal(true); // Open the feedback modal
  };

  const handleFeedbackSubmit = async (feedbackData) => {
    try {
      setIsSubmitting(true);

      // Determine authorId based on user role
      const authorId =
        authUser?.role === "parent" ? selectedChildId : authUser?.id;

      await feedbackRatingAPI.submitFeedback({
        teacherId: lesson?.teacher?._id,
        rating: feedbackData.rating,
        comment: feedbackData.feedback,
        authorId: authorId,
      });
      if (onFeedbackSubmitted) {
        onFeedbackSubmitted();
      }
    } catch (error) {
      console.error("Failed to submit feedback:", error);
      errorToast(
        error?.message || "Failed to submit feedback. Please try again."
      );
    } finally {
      setIsSubmitting(false);
    }
  };

  return (
    <>
      {/* Modal overlay */}
      <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/60 p-4 font-sans">
        <div className="w-full max-w-2xl rounded-2xl bg-white p-6 sm:p-8 shadow-modal animate-in fade-in-0 zoom-in-95">
          {/* Header */}
          <div className="flex items-center justify-between">
            <h2 className="text-2xl font-bold text-brand-gray-800">
              Lessons Details
            </h2>
            <button
              className="text-brand-gray-500 hover:text-brand-gray-800"
              onClick={onClose}
            >
              <X size={24} />
            </button>
          </div>

          <div className="mt-6 border-t border-gray-200 pt-6">
            {/* Section Title: Subject */}
            <div className="flex items-center justify-between">
              <h3 className="text-lg font-semibold text-brand-gray-800">
                {lesson.title}
              </h3>
              <Badge
                text={statusInfo.text}
                color={statusInfo.color}
                icon={statusInfo.icon}
              />
            </div>

            {/* Tutor Information Card */}
            <div className="mt-4 flex items-center gap-4 rounded-lg bg-brand-gray-100 p-4">
              <img
                src={lesson.teacher.avatar}
                alt={lesson.teacher.name}
                className="h-16 w-16 rounded-full object-cover"
              />
              <div className="flex-grow">
                <h4 className="text-lg font-bold text-brand-gray-800">
                  {lesson.teacher.name}
                </h4>
                <div className="my-1 flex items-center">
                  <div className="flex items-center">
                    {[...Array(5)].map((_, i) => (
                      <Icon
                        key={i}
                        name="Star"
                        size={14}
                        className={
                          i < Math.floor(lesson.averageRating)
                            ? "text-accent fill-current"
                            : "text-gray-300"
                        }
                      />
                    ))}
                  </div>
                  <span className="ml-2 text-sm text-brand-gray-600">
                    ({lesson.totalRating})
                  </span>
                </div>
                <p className="text-sm text-brand-gray-500">{lesson.subject}</p>
              </div>
              <div className="flex flex-col gap-2">
                <button
                  className="flex items-center gap-2 rounded-md px-4 py-2 text-sm font-semibold text-brand-gray-600 hover:bg-gray-200"
                  onClick={handleMessage}
                >
                  <MessageSquare size={18} />
                  <span>Message</span>
                </button>
                <button
                  className="flex items-center gap-2 rounded-md px-4 py-2 text-sm font-semibold text-brand-gray-600 hover:bg-gray-200"
                  onClick={handleFeedback}
                >
                  <Star size={18} />
                  <span>Feedback</span>
                </button>
              </div>
            </div>

            {/* Date, Duration, and Time Section */}
            <div className="mt-6 grid grid-cols-1 gap-y-4 sm:grid-cols-2 sm:gap-x-6">
              <div className="flex items-start gap-3">
                <Calendar className="mt-1 h-5 w-5 text-brand-gray-500" />
                <div>
                  <p className="text-sm text-brand-gray-500">Date</p>
                  <p className="font-semibold text-brand-gray-800">
                    {lesson.date}
                  </p>
                </div>
              </div>
              <div className="flex items-start gap-3">
                {lesson.address && (
                  <>
                    <MapPin className="mt-1 h-5 w-5 text-brand-gray-500" />
                    <div>
                      <p className="text-sm text-brand-gray-500">Location</p>
                      <p className="font-semibold text-brand-gray-800">
                        {lesson.address}
                      </p>
                    </div>
                  </>
                )}
              </div>
              <div className="flex items-start gap-3">
                <Clock className="mt-1 h-5 w-5 text-brand-gray-500" />
                <div>
                  <p className="text-sm text-brand-gray-500">Duration</p>
                  <p className="font-semibold text-brand-gray-800">
                    {lesson.duration} min
                  </p>
                </div>
              </div>
              <div className="flex items-start gap-3"></div>
              <div className="flex items-start gap-3">
                <Clock className="mt-1 h-5 w-5 text-brand-gray-500" />
                <div>
                  <p className="text-sm text-brand-gray-500">Time</p>
                  <p className="font-semibold text-brand-gray-800">
                    {lesson.startTime}
                  </p>
                </div>
              </div>
            </div>

            {/* Tags Section */}
            {lesson.tags && lesson.tags.length > 0 && (
              <div className="mt-6 flex flex-wrap items-center gap-3">
                {lesson.tags.map((tag) => (
                  <Badge
                    key={tag}
                    text={tag}
                    color={tagDetails[tag]?.color || "sky"}
                    icon={tagDetails[tag]?.icon}
                  />
                ))}
              </div>
            )}

            {/* Lessons Description Section */}
            {lesson.description && (
              <div className="mt-6">
                <h3 className="text-lg font-semibold text-brand-gray-800">
                  Lessons Description
                </h3>
                <p className="mt-2 text-base text-brand-gray-500">
                  {lesson.description}
                </p>
              </div>
            )}
          </div>
        </div>
      </div>

      {/* Feedback Modal */}
      {showFeedbackModal && (
        <FeedbackModal
          lesson={lesson}
          onClose={() => setShowFeedbackModal(false)}
          onSubmit={handleFeedbackSubmit}
          isSubmitting={isSubmitting}
        />
      )}
    </>
  );
};

export default LessonDetailsModal;
