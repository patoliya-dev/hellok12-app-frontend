import React, { useState } from "react";
import { X, Star } from "lucide-react";
import { successToast } from "../../../../utils/utils";

const FeedbackModal = ({ lesson, onClose, onSubmit, isSubmitting = false }) => {
  const [rating, setRating] = useState(0);
  const [hoveredRating, setHoveredRating] = useState(0);
  const [feedback, setFeedback] = useState("");
  const minCharacters = 10;

  const handleSubmit = () => {
    if (feedback.length >= minCharacters && rating > 0) {
      onSubmit({ rating, feedback, lessonId: lesson?.id });
      successToast("Feedback submitted successfully!");
      onClose();
    }
  };

  const handleStarClick = (starIndex) => {
    setRating(starIndex);
  };

  const handleStarHover = (starIndex) => {
    setHoveredRating(starIndex);
  };

  const handleStarLeave = () => {
    setHoveredRating(0);
  };

  const displayRating = hoveredRating || rating;

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/60 p-4 font-sans">
      <div className="w-full max-w-lg rounded-2xl bg-white p-6 sm:p-8 shadow-modal animate-in fade-in-0 zoom-in-95">
        {/* Header */}
        <div className="flex items-center justify-between">
          <h2 className="text-2xl font-bold text-brand-gray-800">
            Share your feedback
          </h2>
          <button
            className="text-brand-gray-500 hover:text-brand-gray-800"
            onClick={onClose}
          >
            <X size={24} />
          </button>
        </div>

        <div className="mt-6">
          {/* Overall Rating */}
          <div className="mb-6">
            <label className="mb-2 block text-sm font-medium text-brand-gray-800">
              Overall rating <span className="text-red-500">*</span>
            </label>
            <div className="flex items-center gap-2">
              {[1, 2, 3, 4, 5].map((starIndex) => (
                <button
                  key={starIndex}
                  type="button"
                  onClick={() => handleStarClick(starIndex)}
                  onMouseEnter={() => handleStarHover(starIndex)}
                  onMouseLeave={handleStarLeave}
                  className="transition-transform hover:scale-110"
                >
                  <Star
                    size={32}
                    className={
                      starIndex <= displayRating
                        ? "fill-yellow-400 text-yellow-400"
                        : "fill-none text-gray-300"
                    }
                  />
                </button>
              ))}
              <span className="ml-2 text-sm text-brand-gray-600">
                {rating > 0 ? `${rating} star${rating > 1 ? "s" : ""}` : ""}
              </span>
            </div>
          </div>

          {/* Objective Questions (Feedback Text) */}
          <div className="mb-2">
            <label className="mb-2 block text-sm font-medium text-brand-gray-800">
              Objective questions <span className="text-red-500">*</span>
            </label>
            <textarea
              value={feedback}
              onChange={(e) => setFeedback(e.target.value)}
              placeholder="Share your experience with us..."
              className="w-full rounded-lg border border-gray-300 p-3 text-sm text-brand-gray-800 placeholder-gray-400 focus:border-primary focus:outline-none focus:ring-2 focus:ring-primary/20"
              rows={6}
            />
          </div>

          {/* Character Count */}
          <p className="mb-6 text-xs text-brand-gray-500">
            Minimum {minCharacters} characters ({feedback.length}/
            {minCharacters})
          </p>

          {/* Action Buttons */}
          <div className="flex items-center justify-end gap-3">
            <button
              onClick={onClose}
              className="rounded-lg px-6 py-2.5 text-sm font-semibold text-brand-gray-600 hover:bg-gray-100 transition-colors"
            >
              Cancel
            </button>
            <button
              onClick={handleSubmit}
              disabled={
                feedback.length < minCharacters || rating === 0 || isSubmitting
              }
              className="rounded-lg bg-primary px-6 py-2.5 text-sm font-semibold text-white hover:bg-primary-dark transition-colors disabled:cursor-not-allowed disabled:opacity-50"
            >
              {isSubmitting ? "Submitting..." : "Submit feedback"}
            </button>
          </div>
        </div>
      </div>
    </div>
  );
};

export default FeedbackModal;
