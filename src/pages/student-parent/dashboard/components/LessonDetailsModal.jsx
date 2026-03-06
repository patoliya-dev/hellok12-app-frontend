import React, { useState } from "react";
import {
  X,
  MessageSquare,
  Star,
  Calendar,
  Clock,
  Gamepad2,
  Users,
  User,
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
import Image from "components/AppImage";

const tagDetails = {
  "Curriculum-Aligned Games": { icon: <Gamepad2 size={16} />, color: "orange" },
  "Trial Lessons": { icon: <Gift size={16} />, color: "sky" },
  "1-on-1": { icon: <User size={16} />, color: "blue" },
  "Online Course": {
    icon: <VideoIcon size={14} className="w-[12px] h-[10px]" selected={true} />,
    color: "green",
  },
  "In-Person": { icon: <MapPin size={16} />, color: "green" },
  Group: { icon: <Users size={16} />, color: "blue" },
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

  if (!lesson) return null;

  const statusInfo = statusDetails[lesson.status] || statusDetails["pending"];

  const handleMessage = () => {
    navigate(getRolePath(authUser?.role || "student", "messages"));
  };

  const handleFeedback = () => {
    setShowFeedbackModal(true);
  };

  const handleFeedbackSubmit = async (feedbackData) => {
    try {
      setIsSubmitting(true);

      const authorId =
        authUser?.role === "parent" ? selectedChildId : authUser?.id;

      await feedbackRatingAPI.submitFeedback({
        teacherId: lesson?.teacher?._id,
        rating: feedbackData.rating,
        comment: feedbackData.feedback,
        authorId,
      });

      if (onFeedbackSubmitted) onFeedbackSubmitted();
    } catch (error) {
      console.error("Failed to submit feedback:", error);
      errorToast(
        error?.message || "Failed to submit feedback. Please try again.",
      );
    } finally {
      setIsSubmitting(false);
    }
  };

  return (
    <>
      {/* Overlay */}
      <div className="fixed inset-0 z-50 bg-black/60 !m-0">
        {/* Center wrapper */}
        <div className="flex min-h-[100dvh] items-center justify-center p-3 sm:p-4 font-sans">
          {/* Modal */}
          <div className="w-full max-w-2xl rounded-2xl bg-white shadow-modal animate-in fade-in-0 zoom-in-95 overflow-hidden">
            {/* Scroll container: keeps header visible while content scrolls on small screens */}
            <div className="max-h-[90dvh] overflow-y-auto">
              {/* Header */}
              <div className="flex items-start justify-between gap-3 px-4 py-4 sm:px-6 sm:py-6">
                <h2 className="text-xl sm:text-2xl font-bold text-brand-gray-800">
                  Lessons Details
                </h2>
                <button
                  className="shrink-0 rounded-md p-1 text-brand-gray-500 hover:text-brand-gray-800 hover:bg-gray-100"
                  onClick={onClose}
                  aria-label="Close"
                >
                  <X size={22} />
                </button>
              </div>

              <div className="border-t border-gray-200 px-4 pb-5 pt-5 sm:px-6 sm:pb-6 sm:pt-6">
                {/* Title + Status */}
                <div className="flex flex-col gap-2 sm:flex-row sm:items-center sm:justify-between">
                  <h3 className="text-lg font-semibold text-brand-gray-800">
                    {lesson.title}
                  </h3>
                  <div className="self-start sm:self-auto">
                    <Badge
                      text={statusInfo.text}
                      color={statusInfo.color}
                      icon={statusInfo.icon}
                    />
                  </div>
                </div>

                {/* Teacher Card */}
                <div className="mt-4 rounded-lg bg-brand-gray-100 p-4">
                  <div className="flex flex-col gap-4 sm:flex-row sm:items-center sm:gap-4">
                    <div className="flex items-center gap-4">
                      <Image
                        src={
                          lesson.teacher?.avatar ||
                          "/assets/images/no_image.png"
                        }
                        alt={lesson.teacher?.name}
                        className="w-16 h-16 rounded-full object-cover"
                      />
                      <div className="min-w-0">
                        <h4 className="text-base sm:text-lg font-bold text-brand-gray-800 truncate">
                          {lesson.teacher?.name}
                        </h4>

                        <div className="my-1 flex items-center">
                          <div className="flex items-center">
                            {[...Array(5)].map((_, i) => (
                              <Icon
                                key={i}
                                name="Star"
                                size={14}
                                className={
                                  i < Math.floor(lesson.averageRating || 0)
                                    ? "text-accent fill-current"
                                    : "text-gray-300"
                                }
                              />
                            ))}
                          </div>
                          <span className="ml-2 text-sm text-brand-gray-600">
                            ({lesson.totalRating || 0})
                          </span>
                        </div>

                        <p className="text-sm text-brand-gray-500 truncate">
                          {lesson.subject}
                        </p>
                      </div>
                    </div>

                    {/* Actions */}
                    <div className="ml-auto flex w-full flex-col items-stretch gap-2 sm:w-auto sm:items-end">
                      <button
                        className="flex w-full sm:w-auto items-center justify-center gap-2 rounded-md px-4 py-2 text-sm font-semibold text-brand-gray-600 hover:bg-gray-200"
                        onClick={handleMessage}
                      >
                        <MessageSquare size={18} />
                        <span>Message</span>
                      </button>

                      <button
                        className="flex w-full sm:w-auto items-center justify-center gap-2 rounded-md px-4 py-2 text-sm font-semibold text-brand-gray-600 hover:bg-gray-200"
                        onClick={handleFeedback}
                      >
                        <Star size={18} />
                        <span>Feedback</span>
                      </button>
                    </div>
                  </div>
                </div>

                {/* Details grid */}
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

                  {lesson.address ? (
                    <div className="flex items-start gap-3">
                      <span>
                        <MapPin className="mt-1 h-5 w-5 text-brand-gray-500" />
                      </span>
                      <div className="min-w-0">
                        <p className="text-sm text-brand-gray-500">Location</p>
                        <p className="font-semibold text-brand-gray-800 break-words">
                          {lesson.address}
                        </p>
                      </div>
                    </div>
                  ) : null}

                  <div className="flex items-start gap-3">
                    <Clock className="mt-1 h-5 w-5 text-brand-gray-500" />
                    <div>
                      <p className="text-sm text-brand-gray-500">Duration</p>
                      <p className="font-semibold text-brand-gray-800">
                        {lesson.duration} min
                      </p>
                    </div>
                  </div>

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

                {/* Tags */}
                {lesson.tags && lesson.tags.length > 0 && (
                  <div className="mt-6 flex flex-wrap items-center gap-2 sm:gap-3">
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

                {/* Description */}
                {lesson.description && (
                  <div className="mt-6">
                    <h3 className="text-lg font-semibold text-brand-gray-800">
                      Lessons Description
                    </h3>
                    <p className="mt-2 text-sm sm:text-base text-brand-gray-500">
                      {lesson.description}
                    </p>
                  </div>
                )}
              </div>
            </div>
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
