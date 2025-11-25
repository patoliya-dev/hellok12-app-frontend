import React, { useState } from "react";
import Icon from "../../../../components/AppIcon";
import Image from "../../../../components/AppImage";
import Button from "../../../../components/ui/Button";
import Loader from "components/ui/Loader";

const StudentFeedback = ({ feedbacks, loading, onViewAllFeedback }) => {
  const renderStars = (rating) => {
    return Array.from({ length: 5 }, (_, i) => (
      <Icon
        key={i}
        name="Star"
        size={14}
        className={`fill-current ${i < rating ? "text-warning " : "text-[#E6E6E6]"
          }`}
      />
    ));
  };

  return (
    <div className="bg-card rounded-lg border border-border p-6">
      <div className="flex items-center justify-between mb-4">
        <div className="flex justify-center items-center">
          <Image
            src="/assets/images/student_feedback.svg"
            alt="Feedback"
            className="mr-2"
          />
          <h3 className="text-lg font-semibold text-foreground">
            Student Feedback
          </h3>
        </div>
        <Button variant="outline" size="sm" onClick={onViewAllFeedback}>
          View All
        </Button>
      </div>

      {loading ? (
        <Loader />
      ) : feedbacks?.length === 0 ? (
        <div className="flex flex-col items-center justify-center py-12">
          <Icon name="MessageSquare" size={40} className="text-muted-foreground mb-3" />
          <p className="text-sm text-muted-foreground">No feedbacks yet</p>
        </div>
      ) : (
        <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
          {feedbacks?.map((feedback, index) => (
            <div
              key={index}
              className="p-4 rounded-lg border border-border hover:bg-muted/50 transition-micro"
            >
              <div className="flex items-start justify-between mb-3">
                <div className="flex items-center space-x-3">
                  <Image
                    src={feedback?.author?.profileImage?.url || ""}
                    alt={feedback?.author?.name}
                    className="w-8 h-8 rounded-full object-cover"
                  />
                  <div>
                    <h4 className="text-sm font-medium text-foreground">
                      {feedback?.author?.name}
                    </h4>
                  </div>
                </div>
                <div className="text-right">
                  <div className="flex items-center space-x-1 mb-1">
                    {renderStars(feedback?.rating)}
                  </div>
                  <div className="text-xs text-muted-foreground">
                    {new Date(feedback?.createdAt).toLocaleDateString()}
                  </div>
                </div>
              </div>

              <p className="text-sm text-foreground mb-2 line-clamp-3 lg:pr-14">
                {feedback?.comment}
              </p>

              {feedback?.tags && feedback?.tags?.length > 0 && (
                <div className="flex flex-wrap gap-4 mb-2">
                  {feedback?.tags?.map((tag, index) => (
                    <span
                      key={index}
                      className="py-1 bg-primary/10 text-primary text-xs rounded-full"
                    >
                      {tag}
                    </span>
                  ))}
                </div>
              )}

              <div className="flex flex-col gap-2 lg:gap-0 lg:flex-row lg:items-center lg:justify-between text-xs">
                {feedback?.lesson && (
                  <div className="flex items-center space-x-2">
                    <span className="text-muted-foreground">Session:</span>
                    <span className="text-foreground">{feedback?.sessionDate}</span>
                  </div>
                )}
                {feedback?.parentFeedback && (
                  <div className="flex items-center space-x-1 text-primary">
                    <Icon name="Users" size={12} />
                    <span>Parent feedback included</span>
                  </div>
                )}
              </div>
            </div>
          ))}
        </div>
      )}
    </div>
  );
};

export default StudentFeedback;
