import React, { useState } from "react";
import Icon from "../../../../components/AppIcon";
import Image from "../../../../components/AppImage";
import Button from "../../../../components/ui/Button";
import DeleteModal from "components/ui/DeleteModal";

const MediaModal = ({ item, onClose, onDelete, onReplace, type="highlight" }) => {
  const [showDeleteModal, setShowDeleteModal] = useState(false);

  const handleDeleteModalVisibility = () => {
    setShowDeleteModal(!showDeleteModal);
  };

  const formatFileSize = (bytes) => {
    if (bytes === 0) return "0 Bytes";
    const k = 1024;
    const sizes = ["Bytes", "KB", "MB", "GB"];
    const i = Math.floor(Math.log(bytes) / Math.log(k));
    return parseFloat((bytes / Math.pow(k, i))?.toFixed(2)) + " " + sizes?.[i];
  };

  const formatDate = (date) => {
    return new Date(date)?.toLocaleDateString("en-US", {
      weekday: "long",
      year: "numeric",
      month: "long",
      day: "numeric",
      hour: "2-digit",
      minute: "2-digit",
    });
  };

  const handleBackdropClick = (e) => {
    if (e?.target === e?.currentTarget) {
      onClose();
    }
  };

  return (
    <div
      className="fixed inset-0 z-50 bg-black/80 flex items-center justify-center p-4"
      onClick={handleBackdropClick}
    >
      <div className="bg-card rounded-xl max-w-4xl w-full max-h-[90vh] overflow-hidden shadow-modal">
        {/* Header */}
        <div className="flex items-center justify-between p-4 border-b border-border">
          <div className="flex items-center space-x-3">
            <div
              className={`
              w-8 h-8 rounded-full flex items-center justify-center
              ${
                item?.type === "video"
                  ? "bg-primary/20 text-primary"
                  : item?.type?.includes("pdf") ||
                    item?.name?.toLowerCase()?.includes(".pdf")
                  ? "bg-accent/20 text-accent"
                  : "bg-secondary/20 text-secondary"
              }
            `}
            >
              <Icon
                name={
                  item?.type === "video"
                    ? "Video"
                    : item?.type?.includes("pdf") ||
                      item?.name?.toLowerCase()?.includes(".pdf")
                    ? "FileText"
                    : "Image"
                }
                size={16}
              />
            </div>
            <div>
              <h3 className="font-semibold text-foreground">{item?.name}</h3>
              <p className="text-sm text-muted-foreground">
                {formatFileSize(item?.size)} • Uploaded{" "}
                {formatDate(item?.uploadDate || item?.createdAt)}
              </p>
            </div>
          </div>

          <Button
            variant="ghost"
            size="icon"
            onClick={onClose}
            className="text-muted-foreground hover:text-foreground"
          >
            <Icon name="X" size={20} />
          </Button>
        </div>

        {/* Media Content */}
        <div className="p-4">
          <div className="bg-muted rounded-lg overflow-hidden">
            {item?.type === "video" ? (
              <video
                src={item?.url}
                controls
                className="w-full max-h-[60vh] object-contain"
                autoPlay
              >
                Your browser does not support the video tag.
              </video>
            ) : item?.type?.includes("pdf") ||
              item?.name?.toLowerCase()?.includes(".pdf") ? (
              <div className="flex items-center justify-center min-h-[60vh]">
                <iframe
                  src={item?.url}
                  className="w-full h-[60vh] border-0"
                  title={item?.name}
                />
              </div>
            ) : (
              <div className="flex items-center justify-center min-h-[300px]">
                <Image
                  src={item?.url}
                  alt={item?.name}
                  className="max-w-full max-h-[60vh] object-contain"
                />
              </div>
            )}
          </div>
        </div>

        {/* Actions */}
        <div className="flex items-center justify-between p-4 border-t border-border bg-muted/30">
          <div className="flex items-center space-x-2 text-sm text-muted-foreground">
            <Icon name="Calendar" size={16} />
            <span>Uploaded on {formatDate(item?.uploadDate || item?.updatedAt)}</span>
          </div>

          <div className="flex items-center space-x-2">
            {onReplace && (
              <Button
                variant="outline"
                onClick={onReplace}
                iconName="RefreshCw"
                iconPosition="left"
              >
                Replace
              </Button>
            )}
            <Button
              variant="destructive"
              onClick={handleDeleteModalVisibility}
              iconName="Trash2"
              iconPosition="left"
            >
              Delete
            </Button>
          </div>
        </div>
      </div>

      {showDeleteModal && (
        <DeleteModal
          type={type}
          onConfirm={() => {
            onDelete();
            handleDeleteModalVisibility();
          }}
          onClose={handleDeleteModalVisibility}
        />
      )}
    </div>
  );
};

export default MediaModal;
