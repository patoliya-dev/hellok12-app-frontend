import React, { useState, MouseEvent } from "react";
import { Link } from "react-router-dom";
import { useSelector } from "react-redux";
import AppImage from "../../../../components/AppImage";
import Icon from "../../../../components/ui/Icon";
import locationIcon from "../../../../assets/images/teacherCard/location-icon.png";
import { selectAuthUser } from "reducers/auth/authSelectors";
import { getRolePath } from "../../../../utils/rolePath";
import { getLanguageName } from "../../../../utils/utils";
import { Country, State } from "country-state-city";

const TeacherCard = ({ teacher }) => {
  const authUser = useSelector(selectAuthUser);
  const [isFavorited, setIsFavorited] = useState(teacher?.isFavorited || false);

  const handleFavoriteToggle = (e) => {
    e.preventDefault();
    e.stopPropagation();
    setIsFavorited(!isFavorited);
  };

  const handleBookingClick = (e) => {
    e.preventDefault();
    e.stopPropagation();
    console.log("Book lesson with", teacher?.name);
  };

  const renderRating = (rating) => {
    return (
      <div className="flex items-center space-x-1">
        <div className="flex items-center">
          {[...Array(5)].map((_, i) => (
            <Icon
              key={i}
              name="Star"
              size={14}
              className={
                i < Math.floor(rating)
                  ? "text-accent fill-current"
                  : "text-gray-300"
              }
            />
          ))}
        </div>
        <span className="text-sm font-medium text-foreground">
          {(Math.floor(rating * 10) / 10).toFixed(1)}
        </span>
        <span className="text-sm text-text-secondary">
          ({teacher?.reviewsCount ?? 5})
        </span>
      </div>
    );
  };

  const getFullLocationName = (location) => {
    if (!location) return "";

    const { country, state, city } = location;
    const stateName = state
      ? State.getStateByCodeAndCountry(state, country)?.name
      : "";
    const cityName = city || "";

    // Build string dynamically (avoid undefined or extra commas)
    return [cityName, stateName].filter(Boolean).join(", ");
  };

  const renderLanguages = (languages) => {
    const displayLanguages = languages?.slice(0, 3);
    const remainingCount = languages?.length - 3;

    return (
      <div className="flex flex-wrap gap-1">
        {displayLanguages?.map((lang, index) => (
          <span
            key={index}
            className="inline-block bg-[#f59e0b]/10 text-[#f59e0b] px-2 py-1 rounded text-xs font-medium"  
          >
            {getLanguageName(lang)}
          </span>
        ))}
        {remainingCount > 0 && (
          <span className="inline-block bg-muted text-text-secondary px-2 py-1 rounded-educational text-xs">
            +{remainingCount} more
          </span>
        )}
      </div>
    );
  };

  return (
    <Link
      to={getRolePath(
        authUser?.role || "student",
        `teacher-profile-detail/${teacher?._id}`
      )}
      className="block bg-card border border-border rounded-lg hover:shadow-educational-lg transition-educational group hover-lift"
    >
      <div className="relative">
        {/* Profile Image */}
        <div className="relative p-6 pb-4">
          <div className="relative mx-auto w-24 h-24">
            <AppImage
              src={teacher?.profileImage || "/assets/images/no_image.png"}
              alt={teacher?.name || "Teacher Profile Image"}
              className="w-full h-full rounded-full object-cover"
            />
            {teacher?.isOnline && (
              <div className="absolute bottom-1 right-1 w-4 h-4 bg-accent border-2 border-white rounded-full"></div>
            )}
          </div>

          {/* Favorite Button */}
          <button
            onClick={handleFavoriteToggle}
            className="absolute top-4 right-4 p-2 rounded-full bg-white/90 text-text-secondary hover:text-secondary hover:bg-white transition-educational"
            aria-label={
              isFavorited ? "Remove from favorites" : "Add to favorites"
            }
          >
            <Icon
              name="Heart"
              size={16}
              className={isFavorited ? "fill-current text-secondary" : ""}
            />
          </button>
        </div>

        {/* Content */}
        <div className="px-6 pb-6">
          <div className="text-center mb-4">
            <div className="flex items-center justify-center space-x-1 mb-1">
              <h3 className="text-lg font-heading font-semibold text-foreground group-hover:text-primary transition-educational">
                {teacher?.name}
              </h3>
              {teacher?.isVerified && (
                <Icon name="BadgeCheck" size={16} className="text-accent" />
              )}
            </div>
            {/* Languages */}
            <div className="mb-4 flex justify-center">
              {renderLanguages(teacher?.profile?.teachingLanguages)}
            </div>
            {teacher?.profile?.location &&
              teacher?.profile?.location?.country && (
                <p className="text-text-secondary text-sm mb-2 flex items-center justify-center font-semibold">
                  <Icon name="MapPin" className="mr-1 flex-none" size={16} />
                  <span className="truncate max-w-full">
                    {getFullLocationName(teacher?.profile?.location)}
                  </span>
                </p>
              )}
            <p className="text-text-secondary text-sm">
              {teacher?.profile?.teachingSpecialties}
            </p>
          </div>

          {/* Rating */}
          <div className="flex items-center justify-center mb-3">
            {renderRating(teacher?.averageRating)}
          </div>

          {/* Languages */}
          <div className="flex items-center justify-center mb-4">
            {teacher?.school ? (
              <>
                <Icon
                  name="School"
                  size={20}
                  className="text-muted-foreground"
                />
                <span className="ml-2 text-sm text-text-secondary">
                  {teacher?.school?.name}
                </span>
              </>
            ) : (
              <>
                <Icon
                  name="UserRound"
                  size={20}
                  className="text-muted-foreground"
                />
                <span className="ml-2 text-sm text-text-secondary">
                  Independent Teacher
                </span>
              </>
            )}
          </div>

          {/* Stats */}
          <div className="flex items-center justify-center space-x-4 text-sm text-text-secondary mb-4">
            <div className="flex items-center space-x-1">
              <Icon name="Users" size={14} />
              <span>{teacher?.studentsTaught}</span>
            </div>
            <div className="flex items-center space-x-1">
              <Icon name="Clock" size={14} />
              <span>{teacher?.profile?.yearsOfExperience ?? 0}y</span>
            </div>
          </div>
        </div>
      </div>
    </Link>
  );
};

export default TeacherCard;
