import React, { useEffect, useState } from "react";
import { Tooltip as ReactTooltip } from "react-tooltip";
import Icon from "../../../../components/AppIcon";
import Image from "../../../../components/AppImage";
import Button from "../../../../components/ui/Button";
import MediaModal from "./MediaModal";
import DeleteModal from "components/ui/DeleteModal";
import { successToast } from "../../../../utils/utils";

const MediaGallery = ({
  mediaItems,
  selectedItems,
  onItemSelect,
  onItemDelete,
  onItemReplace,
  showBulkActions,
}) => {
  const [modalItem, setModalItem] = useState(null);
  const [showDeleteModal, setShowDeleteModal] = useState(false);
  const [deleteItemId, setDeleteItemId] = useState(null);
  const [items, setItems] = useState([]);

  useEffect(() => {
    setItems(mediaItems);
  }, [mediaItems]);

  const formatFileSize = (bytes) => {
    if (bytes === 0) return "0 Bytes";
    const k = 1024;
    const sizes = ["Bytes", "KB", "MB", "GB"];
    const i = Math.floor(Math.log(bytes) / Math.log(k));
    return parseFloat((bytes / Math.pow(k, i))?.toFixed(2)) + " " + sizes?.[i];
  };

  const formatDate = (date) => {
    return new Date(date)?.toLocaleDateString("en-US", {
      month: "short",
      day: "numeric",
      year: "numeric",
    });
  };

  const getFileIcon = (type) => {
    return type === "video" ? "Video" : "Image";
  };

  const handleItemClick = (item) => {
    setModalItem(item);
  };

  const handleModalClose = () => {
    setModalItem(null);
  };

  const handleDeleteModalVisibility = () => {
    setShowDeleteModal(!showDeleteModal);
  };

  const handleIntroChange = (item) => {
    const updatedItems = items.map((mediaItems) => {
      if (mediaItems.id === item?.id) {
        mediaItems.isIntro = !mediaItems.isIntro;
      } else {
        mediaItems.isIntro = false;
      }
      return mediaItems;
    });
    setItems(updatedItems);

    return successToast("Intro highlight updated successfully.");
  };

  if (items?.length === 0) {
    return (
      <div className="bg-card rounded-xl p-12 text-center">
        <div className="w-20 h-20 mx-auto bg-muted rounded-full flex items-center justify-center mb-4">
          <Icon name="FileImage" size={40} className="text-muted-foreground" />
        </div>
        <h3 className="text-xl font-semibold text-foreground mb-2">
          No highlights yet
        </h3>
        <p className="text-muted-foreground mb-6">
          Start building your teaching portfolio by uploading your first video
          or image
        </p>
        <div className="flex flex-wrap justify-center gap-2 text-sm">
          <span className="bg-primary/20 text-primary px-3 py-1 rounded-full">
            Share classroom moments
          </span>
          <span className="bg-secondary/20 text-secondary px-3 py-1 rounded-full">
            Showcase teaching skills
          </span>
          <span className="bg-accent/20 text-accent px-3 py-1 rounded-full">
            Build your portfolio
          </span>
        </div>
      </div>
    );
  }

  return (
    <>
      <div className="grid grid-cols-2 md:grid-cols-3 gap-4">
        {items?.map((item) => (
          <div
            key={item?.id}
            className="relative bg-card rounded-lg border border-border overflow-hidden shadow-card hover:shadow-modal transition-all duration-200 hover-scale"
          >
            {/* Selection Checkbox */}
            <div className="absolute top-2 left-2 z-10">
              <input
                type="checkbox"
                checked={selectedItems?.includes(item?.id)}
                onChange={() => onItemSelect(item?.id)}
                className="w-4 h-4 text-primary bg-card border-border rounded focus:ring-primary focus:ring-2"
              />
            </div>

            {/* Media Preview */}
            <div
              className="relative aspect-video bg-muted cursor-pointer"
              onClick={() => handleItemClick(item)}
            >
              {item?.type === "video" ? (
                <div className="w-full h-full flex items-center justify-center">
                  <div className="w-12 h-12 bg-primary/20 rounded-full flex items-center justify-center">
                    <Icon name="Play" size={24} className="text-primary ml-1" />
                  </div>
                  <video
                    src={item?.url}
                    className="absolute inset-0 w-full h-full object-cover"
                    muted
                  />
                </div>
              ) : (
                <Image
                  src={item?.url}
                  alt={item?.name}
                  className="w-full h-full object-cover"
                />
              )}

              {/* File Type Badge */}
              <div className="absolute top-2 right-2">
                <div
                  className={`
                  px-2 py-1 rounded-full text-xs font-medium
                  ${
                    item?.mime.startsWith("video")
                      ? "bg-primary/90 text-primary-foreground"
                      : "bg-secondary/90 text-secondary-foreground"
                  }
                `}
                >
                  <Icon
                    name={getFileIcon(item?.type)}
                    size={12}
                    className="inline mr-1"
                  />
                  {item?.type?.toUpperCase()}
                </div>
              </div>
            </div>

            {/* Media Info */}
            <div className="p-3">
              <div className="flex items-start justify-between">
                <div className="flex-1 min-w-0">
                  <h4 className="text-sm font-medium text-foreground truncate">
                    {item?.name?.substring(item?.name?.indexOf("_") + 1)}
                  </h4>
                  <div className="flex items-center space-x-2 mt-1 text-xs text-muted-foreground">
                    <span>{formatFileSize(item?.size)}</span>
                    <span>•</span>
                    <span>{formatDate(item?.createdAt)}</span>
                  </div>
                </div>

                <input
                  type="checkbox"
                  data-tooltip-id={`intro-tooltip-${item?.id}`}
                  disabled={item?.isIntro}
                  checked={item?.isIntro}
                  onChange={() => handleIntroChange(item)}
                  className="absolute bottom-1 right-3.5 h-5 w-5 rounded-full bg-[#E8E8E8] border-none cursor-pointer appearance-none checked:bg-primary checked:border-primary checked:before:text-white checked:before:flex checked:before:items-center checked:before:justify-center outline-none focus:outline-none focus:ring-0"
                />

                <ReactTooltip
                  id={`intro-tooltip-${item?.id}`}
                  place="top"
                  content="Select to set the intro video"
                />

                {/* Action Menu */}
                <div className="relative group">
                  <Button variant="ghost" size="icon" className="w-6 h-6">
                    <Icon name="MoreVertical" size={14} />
                  </Button>

                  {/* Dropdown Menu */}
                  <div className="absolute right-0 bottom-full mt-1 w-32 bg-popover border border-border rounded-lg shadow-modal opacity-0 invisible group-hover:opacity-100 group-hover:visible transition-all duration-200 z-20">
                    <div className="py-1">
                      <button
                        onClick={() => handleItemClick(item)}
                        className="w-full px-3 py-2 text-left text-sm text-foreground hover:bg-muted transition-colors flex items-center space-x-2"
                      >
                        <Icon name="Eye" size={14} />
                        <span>View</span>
                      </button>
                      <button
                        onClick={() => onItemReplace(item?.id)}
                        className="w-full px-3 py-2 text-left text-sm text-foreground hover:bg-muted transition-colors flex items-center space-x-2"
                      >
                        <Icon name="RefreshCw" size={14} />
                        <span>Replace</span>
                      </button>
                      <button
                        onClick={() => {
                          setDeleteItemId(item?.id);
                          handleDeleteModalVisibility();
                        }}
                        className="w-full px-3 py-2 text-left text-sm text-error hover:bg-error/10 transition-colors flex items-center space-x-2"
                      >
                        <Icon name="Trash2" size={14} />
                        <span>Delete</span>
                      </button>
                    </div>
                  </div>
                </div>
              </div>
            </div>
          </div>
        ))}
      </div>
      {/* Media Modal */}
      {modalItem && (
        <MediaModal
          item={modalItem}
          onClose={handleModalClose}
          onDelete={() => {
            onItemDelete(modalItem?.id);
            handleModalClose();
          }}
          onReplace={() => {
            onItemReplace(modalItem?.id);
            handleModalClose();
          }}
        />
      )}

      {showDeleteModal && (
        <DeleteModal
          type="highlight"
          onConfirm={() => {
            onItemDelete(deleteItemId);
            handleDeleteModalVisibility();
          }}
          onClose={() => {
            setDeleteItemId(null);
            handleDeleteModalVisibility();
          }}
        />
      )}
    </>
  );
};

export default MediaGallery;
