import React, { useState } from "react";
import Image from "../AppImage";
import Icon from "../ui/Icon";
import MediaModal from "../teachingHighlightsManagement/MediaModal";

const TeacherHero = ({ teacher }) => {
  const [modalItem, setModalItem] = useState(null);

  const previewItem = {
    id: 6,
    name: "Classroom Setup for Group Work",
    type: "video",
    poster: "https://images.unsplash.com/photo-1509062522246-3755977927d7",
    url: "https://download.blender.org/peach/bigbuckbunny_movies/BigBuckBunny_640x360.m4v",
    size: 3145728,
    uploadDate: new Date("2024-08-05T09:30:00"),
    format: "jpg",
  };

  const getFileIcon = (type) => {
    return type === "video" ? "Video" : "Image";
  };

  const getAvailabilityStatus = () => {
    if (teacher?.isOnline) {
      return {
        text: "Available Now",
        color: "text-success",
        bgColor: "bg-success/10",
      };
    } else if (teacher?.nextAvailable) {
      return {
        text: `Next available: ${teacher.nextAvailable}`,
        color: "text-warning",
        bgColor: "bg-warning/10",
      };
    }
    return {
      text: "Offline",
      color: "text-text-secondary",
      bgColor: "bg-muted",
    };
  };

  const availability = getAvailabilityStatus();

  const handleItemClick = (item) => {
    setModalItem(item);
  };

  const handleModalClose = () => {
    setModalItem(null);
  };

  return (
    <div className="bg-card border-b border-border">
      <div className="max-w-7xl mx-auto px-4 lg:px-6 py-6 lg:py-8">
        <div className="flex flex-col lg:flex-row justify-between gap-6">
          {/* Left: Profile & Info */}
          <div className="flex flex-col lg:flex-row lg:items-start gap-6 flex-1">
            {/* Profile Image */}
            <div className="flex justify-center lg:justify-start">
              <div className="relative">
                <div className="w-32 h-32 lg:w-40 lg:h-40 rounded-full overflow-hidden border-4 border-primary/20">
                  <Image
                    src={teacher.profileImage}
                    alt={`${teacher.name} profile picture`}
                    className="w-full h-full object-cover"
                  />
                </div>
                {teacher.isVerified && (
                  <div className="absolute -bottom-2 -right-2 w-8 h-8 bg-success rounded-full flex items-center justify-center border-2 border-card">
                    <Icon name="CheckCircle" size={16} color="white" />
                  </div>
                )}
              </div>
            </div>

            {/* Teacher Info */}
            <div className="flex-1 text-center lg:text-left">
              <div className="mb-4">
                <h1 className="text-2xl lg:text-3xl font-bold text-foreground mb-2">
                  {teacher.name}
                </h1>

                <div className="flex flex-wrap items-center justify-center lg:justify-start gap-2 mb-3">
                  {teacher.languages.map((language, index) => (
                    <span
                      key={index}
                      className="px-3 py-1 bg-primary text-primary-foreground text-sm font-medium rounded-full"
                    >
                      {language}
                    </span>
                  ))}
                </div>

                <div className="flex items-center justify-center lg:justify-start gap-4 mb-3">
                  <div className="flex items-center gap-1">
                    <div className="flex">
                      {[...Array(5)].map((_, i) => (
                        <Icon
                          key={i}
                          name="Star"
                          size={16}
                          className={
                            i < Math.floor(teacher.rating)
                              ? "text-warning fill-current"
                              : "text-secondary"
                          }
                        />
                      ))}
                    </div>
                    <span className="text-sm font-medium text-foreground">
                      {teacher.rating}
                    </span>
                    <span className="text-sm text-text-secondary">
                      ({teacher.reviewCount} reviews)
                    </span>
                  </div>
                </div>

                <div className="flex items-center justify-center lg:justify-start">
                  <div
                    className={`inline-flex items-center gap-2 px-3 py-1 rounded-full ${availability.bgColor}`}
                  >
                    <div
                      className={`w-2 h-2 rounded-full ${
                        teacher.isOnline ? "bg-success" : "bg-text-secondary"
                      }`}
                    />
                    <span
                      className={`text-sm font-medium ${availability.color}`}
                    >
                      {availability.text}
                    </span>
                  </div>
                </div>
              </div>

              {/* Quick Stats */}
              <div className="grid grid-cols-3 gap-4 mb-6 lg:max-w-md">
                <div className="text-center">
                  <div className="text-lg font-bold text-foreground">
                    {teacher.experience}
                  </div>
                  <div className="text-xs text-text-secondary">
                    Years Experience
                  </div>
                </div>
                <div className="text-center">
                  <div className="text-lg font-bold text-foreground">
                    {teacher.studentsCount}
                  </div>
                  <div className="text-xs text-text-secondary">
                    Students Taught
                  </div>
                </div>
                <div className="text-center">
                  <div className="text-lg font-bold text-foreground">
                    {teacher.classesCount}
                  </div>
                  <div className="text-xs text-text-secondary">
                    Classes Available
                  </div>
                </div>
              </div>
            </div>
          </div>

          {/* Right: Video Preview */}
          <div className="flex justify-center lg:justify-end lg:flex-1">
            <div
              className="relative aspect-video max-w-lg w-full bg-muted cursor-pointer"
              onClick={() => handleItemClick(previewItem)}
            >
              {previewItem.type === "video" ? (
                <>
                  <div className="w-12 h-12 bg-primary/20 rounded-full flex items-center justify-center absolute left-1/2 top-1/2 -translate-x-1/2 -translate-y-1/2 z-10">
                    <Icon name="Play" size={24} className="text-primary ml-1" />
                  </div>
                  <video
                    src={previewItem.url}
                    poster="/path/to/preview-image.jpg"
                    className="absolute inset-0 w-full h-full object-cover"
                    muted
                    // controls
                  />
                </>
              ) : (
                <Image
                  src={previewItem.url}
                  alt={previewItem.name}
                  className="w-full h-full object-cover"
                />
              )}

              <div className="absolute top-2 right-2">
                <div
                  className={`px-2 py-1 rounded-full text-xs font-medium ${
                    previewItem.type === "video"
                      ? "bg-primary text-primary-foreground"
                      : "bg-secondary text-secondary-foreground"
                  }
                  `}
                >
                  <Icon
                    name={getFileIcon(previewItem.type)}
                    size={12}
                    className="inline mr-1"
                  />
                  {previewItem.type.toUpperCase()}
                </div>
              </div>
            </div>
          </div>
        </div>
      </div>
      {modalItem && (
        <MediaModal
          item={modalItem}
          onClose={handleModalClose}
          onDelete={() => {
            handleModalClose();
          }}
          onReplace={() => {
            handleModalClose();
          }}
        />
      )}
    </div>
  );
};

export default TeacherHero;
