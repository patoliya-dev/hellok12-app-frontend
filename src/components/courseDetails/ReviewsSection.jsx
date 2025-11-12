import React, { useEffect, useState } from "react";
import Icon from "../ui/Icon";
import Image from "../AppImage";
import Button from "../ui/Button";
import { getTimeAgo } from "../../utils/utils";

const ReviewsSection = ({ reviews, rating, reviewCount }) => {
  const [reviewsList, setReviewsList] = useState(reviews);
  const [showAllReviews, setShowAllReviews] = useState(false);
  const [sortBy, setSortBy] = useState("recent");

  if (!reviews?.length) return null;

  useEffect(() => {
    const reviewsToDisplay = showAllReviews
      ? [...reviews]
      : [...reviews.slice(0, 3)];
    let sorted = [];

    switch (sortBy) {
      case "recent":
        sorted = [...reviewsToDisplay].sort(
          (a, b) => new Date(b.createdAt) - new Date(a.createdAt)
        );
        break;

      case "highest":
        sorted = [...reviewsToDisplay].sort((a, b) => b.rating - a.rating);
        break;

      default:
        sorted = reviewsToDisplay;
        break;
    }

    setReviewsList(sorted);
  }, [reviews, showAllReviews, sortBy]);

  function calculateRatingStats(feedbacks) {
    const ratingDistribution = { 1: 0, 2: 0, 3: 0, 4: 0, 5: 0 };

    for (const fb of feedbacks) {
      const stars = fb.rating;
      if (stars >= 1 && stars <= 5) {
        ratingDistribution[stars]++;
      }
    }

    return {
      ratingDistribution,
    };
  }

  const renderStars = (ratingValue) => {
    return Array.from({ length: 5 }, (_, i) => (
      <Icon
        key={i}
        name="Star"
        size={16}
        className={`${
          i < Math.floor(ratingValue)
            ? "fill-current text-accent"
            : "text-muted-foreground"
        }`}
      />
    ));
  };

  return (
    <section className="bg-card rounded-lg border border-border p-6">
      <h2 className="text-2xl font-semibold text-foreground mb-6">
        Student Reviews
      </h2>

      {/* Rating Summary */}
      <div className="grid grid-cols-1 md:grid-cols-2 gap-8 mb-8">
        {/* Overall Rating */}
        <div className="text-center md:text-left">
          <div className="flex items-center justify-center md:justify-start space-x-2 mb-2">
            <span className="text-4xl font-bold text-foreground">
              {Math.round(rating * 10) / 10}
            </span>
            <div className="flex space-x-1">{renderStars(rating)}</div>
          </div>
          <p className="text-muted-foreground">
            Based on {reviewCount?.toLocaleString()} reviews
          </p>
        </div>

        {/* Rating Breakdown */}
        <div className="space-y-2">
          {[5, 4, 3, 2, 1].map((star) => (
            <div key={star} className="flex items-center space-x-3">
              <div className="flex items-center space-x-1 w-12">
                <span className="text-sm text-muted-foreground">{star}</span>
                <Icon
                  name="Star"
                  size={12}
                  className="text-secondary fill-current"
                />
              </div>
              <div className="flex-1 bg-muted rounded-full h-2">
                <div
                  className="bg-warning rounded-full h-2 transition-all duration-300"
                  style={{
                    width: `${
                      (calculateRatingStats(reviews).ratingDistribution?.[
                        star
                      ] /
                        reviewCount) *
                      100
                    }%`,
                  }}
                ></div>
              </div>
              <span className="text-sm text-muted-foreground w-12 text-right">
                {calculateRatingStats(reviews).ratingDistribution?.[star]}
              </span>
            </div>
          ))}
        </div>
      </div>

      {/* Filter and Sort */}
      <div className="flex items-center justify-between mb-6">
        <div className="flex items-center space-x-4">
          <span className="text-sm text-muted-foreground">Sort by:</span>
          <select
            value={sortBy}
            onChange={(e) => setSortBy(e.target.value)}
            className="text-sm border border-border rounded px-2 py-1 bg-background"
          >
            <option value="recent">Most Recent</option>
            <option value="highest">Highest Rating</option>
          </select>
        </div>
      </div>

      {/* Reviews List */}
      <div className="space-y-6">
        {reviewsList?.map((review) => (
          <div
            key={review._id}
            className="border-b border-border pb-6 last:border-b-0 last:pb-0"
          >
            <div className="flex items-start space-x-4">
              <Image
                src={review.avatar || "/assets/images/no_image.png"}
                alt={review.name}
                className="w-12 h-12 rounded-full object-cover flex-shrink-0"
              />

              <div className="flex-1 min-w-0">
                <div className="flex items-center justify-between mb-2">
                  <div className="flex items-center space-x-3">
                    <h4 className="font-medium text-foreground">
                      {review.author.name}
                    </h4>
                    {review.progress && (
                      <span className="bg-primary/10 text-primary px-2 py-1 rounded text-xs">
                        {review.progress}
                      </span>
                    )}
                  </div>
                  <span className="text-sm text-muted-foreground">
                    {getTimeAgo(review.createdAt)}
                  </span>
                </div>

                <div className="flex items-center space-x-1 mb-3">
                  {renderStars(review.rating)}
                  <span className="text-sm text-muted-foreground ml-2">
                    ({review.rating}/5)
                  </span>
                </div>

                <p className="text-muted-foreground">{review.comment}</p>
              </div>
            </div>
          </div>
        ))}
      </div>

      {/* Show More Button */}
      {reviews.length > 3 && (
        <div className="text-center mt-6">
          <Button
            variant="outline"
            onClick={() => setShowAllReviews(!showAllReviews)}
          >
            {showAllReviews ? (
              <>
                <Icon name="ChevronUp" size={16} className="mr-2" />
                Show Less Reviews
              </>
            ) : (
              <>
                <Icon name="ChevronDown" size={16} className="mr-2" />
                Show All {reviewCount} Reviews
              </>
            )}
          </Button>
        </div>
      )}
    </section>
  );
};

export default ReviewsSection;
