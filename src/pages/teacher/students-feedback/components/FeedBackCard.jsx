import Icon from "components/AppIcon";
import Image from "components/AppImage";

const FeedBackCard = ({ feedback }) => {
  const renderStars = (rating) => {
    return Array.from({ length: 5 }, (_, i) => (
      <Icon
        key={i}
        name="Star"
        size={14}
        className={`fill-current ${
          i < rating ? "text-warning " : "text-[#E6E6E6]"
        }`}
      />
    ));
  };

  return (
    <div className="p-4 rounded-lg border border-border hover:bg-muted/50 transition-micro h-64 sm:h-52">
      <div className="flex items-start justify-between mb-3">
        <div className="flex items-center space-x-3">
          <Image
            src={feedback.student.avatar}
            alt={feedback.student.name}
            className="w-8 h-8 rounded-full object-cover"
          />
          <div>
            <h4 className="text-sm font-medium text-foreground">
              {feedback.student.name}
            </h4>
            <p className="text-xs text-muted-foreground">{feedback.subject}</p>
          </div>
        </div>
        <div className="text-right">
          <div className="flex items-center space-x-1 mb-1">
            {renderStars(feedback.rating)}
          </div>
          <div className="text-xs text-muted-foreground">
            {new Date(feedback.date).toLocaleDateString()}
          </div>
        </div>
      </div>

      <div className="pr-24">
        <p className="text-sm text-brand-gray-800 mb-2 line-clamp-3 leading-6">
          {feedback.comment}
        </p>
      </div>

      {feedback.tags && feedback.tags.length > 0 && (
        <div className="flex flex-wrap gap-2 md:gap-6 mb-2">
          {feedback.tags.map((tag, index) => (
            <span
              key={index}
              className="py-1 bg-primary/10 text-primary text-xs rounded-full"
            >
              {tag}
            </span>
          ))}
        </div>
      )}

      <div className="flex flex-col md:flex-row gap-3 md:gap-3 md:items-center md:justify-between text-xs mb-2">
        <div className="flex items-center space-x-2">
          <span className="text-brand-gray-500">Session:</span>
          <span className="text-brand-gray-800">{feedback.sessionDate}</span>
        </div>
        {feedback.parentFeedback && (
          <div className="flex items-center space-x-1 text-primary">
            <Icon name="Users" size={12} />
            <span>Parent feedback included</span>
          </div>
        )}
      </div>
    </div>
  );
};

export default FeedBackCard;
