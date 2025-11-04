import React, { useState } from 'react';
import Icon from '../../components/ui/Icon';
import Button from '../../components/ui/Button';
import Select from '../../components/ui/Select';
import ReviewCard from './ReviewCard';

const ReviewsTab = ({ reviews, overallRating, ratingDistribution }) => {
  const [sortBy, setSortBy] = useState('newest');
  const [filterRating, setFilterRating] = useState('all');

  const sortOptions = [
    { value: 'newest', label: 'Newest First' },
    { value: 'oldest', label: 'Oldest First' },
    { value: 'highest', label: 'Highest Rating' },
    { value: 'lowest', label: 'Lowest Rating' },
    // { value: 'helpful', label: 'Most Helpful' }
  ];

  const ratingOptions = [
    { value: 'all', label: 'All Ratings' },
    { value: '5', label: '5 Stars' },
    { value: '4', label: '4 Stars' },
    { value: '3', label: '3 Stars' },
    { value: '2', label: '2 Stars' },
    { value: '1', label: '1 Star' }
  ];

  const filteredAndSortedReviews = () => {
    let filtered = reviews;

    if (filterRating !== 'all') {
      filtered = filtered.filter((review) => review.rating === parseInt(filterRating, 10));
    }

    return filtered.sort((a, b) => {
      switch (sortBy) {
        case 'newest':
          return new Date(b.date).getTime() - new Date(a.date).getTime();
        case 'oldest':
          return new Date(a.date).getTime() - new Date(b.date).getTime();
        case 'highest':
          return b.rating - a.rating;
        case 'lowest':
          return a.rating - b.rating;
        case 'helpful':
          return (b.helpfulCount || 0) - (a.helpfulCount || 0);
        default:
          return 0;
      }
    });
  };

  const processedReviews = filteredAndSortedReviews();

  return (
    <div className="space-y-6">
      {/* Filter and Sort Controls */}
      <div className="flex flex-col sm:flex-row gap-4 p-4 bg-muted/30 rounded-lg">
        <div className="flex-1">
          <Select label="Filter by Rating" options={ratingOptions} value={filterRating} onChange={(value) => setFilterRating(value)} className="w-full" />
        </div>
        <div className="flex-1">
          <Select label="Sort by" options={sortOptions} value={sortBy} onChange={(value) => setSortBy(value)} className="w-full" />
        </div>
      </div>

      {/* Reviews List */}
      <div>
        <div className="flex items-center justify-between mb-4">
          <h3 className="text-lg font-semibold text-foreground">Student Reviews ({processedReviews.length})</h3>
        </div>

        {processedReviews.length > 0 ? (
          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            {processedReviews.map((review) => (
              <ReviewCard key={review.id} review={review} />
            ))}
          </div>
        ) : (
          <div className="text-center py-12">
            <div className="w-16 h-16 bg-muted rounded-full flex items-center justify-center mx-auto mb-4">
              <Icon name="Star" size={24} className="text-text-secondary" />
            </div>
            <h3 className="text-lg font-medium text-foreground mb-2">No Reviews Found</h3>
            <p className="text-text-secondary mb-4">
              No reviews match your current filter criteria.
            </p>
            <Button
              variant="outline"
              onClick={() => {
                setFilterRating('all');
                setSortBy('newest');
              }}
            >
              Clear Filters
            </Button>
          </div>
        )}
      </div>
    </div>
  );
};

export default ReviewsTab;
