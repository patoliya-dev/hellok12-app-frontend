import React, { useState } from "react";
import Icon from "../ui/Icon";
import Image from "../AppImage";
import Button from "../ui/Button";

const ReviewsSection = ({ reviews, rating, reviewCount }) => {
  const [showAllReviews, setShowAllReviews] = useState(false);
  const [sortBy, setSortBy] = useState("recent");

  if (!reviews?.length) return null;

  const displayedReviews = showAllReviews ? reviews : reviews?.slice(0, 3);

  const ratingDistribution = {
    5: Math.floor(reviewCount * 0.68),
    4: Math.floor(reviewCount * 0.2),
    3: Math.floor(reviewCount * 0.08),
    2: Math.floor(reviewCount * 0.03),
    1: Math.floor(reviewCount * 0.01),
  };

  const renderStars = (ratingValue) => {
    return Array.from({ length: 5 }, (_, i) => (
      <Icon
        key={i}
        name="Star"
        size={16}
        className={`${
          i < ratingValue
            ? "fill-current text-secondary"
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
            <span className="text-4xl font-bold text-foreground">{rating}</span>
            <div className="flex space-x-1">
              {renderStars(Math.round(rating))}
            </div>
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
                      (ratingDistribution?.[star] / reviewCount) * 100
                    }%`,
                  }}
                ></div>
              </div>
              <span className="text-sm text-muted-foreground w-12 text-right">
                {ratingDistribution?.[star]}
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
            <option value="helpful">Most Helpful</option>
            <option value="rating">Highest Rating</option>
          </select>
        </div>
      </div>

      {/* Reviews List */}
      <div className="space-y-6">
        {displayedReviews?.map((review) => (
          <div
            key={review.id}
            className="border-b border-border pb-6 last:border-b-0 last:pb-0"
          >
            <div className="flex items-start space-x-4">
              <Image
                src={review.avatar}
                alt={review.name}
                className="w-12 h-12 rounded-full object-cover flex-shrink-0"
              />

              <div className="flex-1 min-w-0">
                <div className="flex items-center justify-between mb-2">
                  <div className="flex items-center space-x-3">
                    <h4 className="font-medium text-foreground">
                      {review.name}
                    </h4>
                    {review.progress && (
                      <span className="bg-primary/10 text-primary px-2 py-1 rounded text-xs">
                        {review.progress}
                      </span>
                    )}
                  </div>
                  <span className="text-sm text-muted-foreground">
                    {review.date}
                  </span>
                </div>

                <div className="flex items-center space-x-1 mb-3">
                  {renderStars(review.rating)}
                  <span className="text-sm text-muted-foreground ml-2">
                    ({review.rating}/5)
                  </span>
                </div>

                <p className="text-muted-foreground">{review.comment}</p>

                <div className="flex items-center space-x-4 mt-3">
                  <button className="flex items-center space-x-1 text-sm text-muted-foreground hover:text-foreground transition-colors">
                    <Icon name="ThumbsUp" size={14} />
                    <span>Helpful (12)</span>
                  </button>
                  <button className="text-sm text-muted-foreground hover:text-foreground transition-colors">
                    Reply
                  </button>
                </div>
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
