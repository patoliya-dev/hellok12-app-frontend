import React from "react";
import TeacherCard from "./TeacherCard";
import TeacherCardSkeleton from "./TeacherCardSkeleton";

const TeacherGrid = ({ teachers, loading, hasMore, onLoadMore }) => {
  const renderSkeletons = () => {
    return Array.from({ length: 8 }, (_, index) => (
      <TeacherCardSkeleton key={`skeleton-${index}`} />
    ));
  };

  if (loading && teachers?.length === 0) {
    return (
      <div className={"grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-6"}>
        {renderSkeletons()}
      </div>
    );
  }

  if (Array.isArray(teachers) && teachers.length === 0 || !Array.isArray(teachers)) {
    return (
      <div className="text-center py-12">
        <div className="w-24 h-24 mx-auto mb-4 bg-muted rounded-full flex items-center justify-center">
          <svg
            className="w-12 h-12 text-text-secondary"
            fill="none"
            stroke="currentColor"
            viewBox="0 0 24 24"
          >
            <path
              strokeLinecap="round"
              strokeLinejoin="round"
              strokeWidth={1.5}
              d="M21 21l-6-6m2-5a7 7 0 11-14 0 7 7 0 0114 0z"
            />
          </svg>
        </div>
        <h3 className="text-lg font-heading font-semibold text-foreground mb-2">
          No teachers found
        </h3>
        <p className="text-text-secondary max-w-md mx-auto">
          Try adjusting your search criteria or filters to find more teachers
          that match your needs.
        </p>
      </div>
    );
  }

  return (
    <div className="space-y-6">
      {/* Teachers Grid/List */}
      <div className={"grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-6"}>
        {Array.isArray(teachers) && teachers.map((teacher) => (
          <TeacherCard key={teacher?.id} teacher={teacher} />
        ))}
      </div>

      {/* Loading More */}
      {loading && teachers?.length > 0 && (
        <div className={"grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-6"}>
          {renderSkeletons()}
        </div>
      )}

      {/* Load More Button */}
      {hasMore && !loading && (
        <div className="text-center pt-8">
          <button
            onClick={onLoadMore}
            className="inline-flex rounded-lg items-center space-x-2 px-6 py-3 bg-primary text-white rounded-educational hover:bg-primary/90 transition-educational cursor-pointer"
          >
            <span>Load More Teachers</span>
            <svg
              className="w-4 h-4"
              fill="none"
              stroke="currentColor"
              viewBox="0 0 24 24"
            >
              <path
                strokeLinecap="round"
                strokeLinejoin="round"
                strokeWidth={2}
                d="M19 9l-7 7-7-7"
              />
            </svg>
          </button>
        </div>
      )}

      {/* End of Results */}
      {!hasMore && teachers?.length > 0 && (
        <div className="text-center pt-8 pb-4">
          <p className="text-text-secondary">
            {`You've seen all ${teachers?.length} teachers matching your criteria`}
          </p>
        </div>
      )}
    </div>
  );
};

export default TeacherGrid;
