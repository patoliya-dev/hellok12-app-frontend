import { useState, useEffect } from "react";
import { mockMediaItems } from "../data";
import UploadZone from "./UploadZone";
import FilterTabs from "./FilterTabs";
import BulkActionsBar from "./BulkActionsBar";
import MediaGallery from "./MediaGallery";
import DeleteModal from "components/ui/DeleteModal";

const TeachingHighlightsTab = () => {
  const [mediaItems, setMediaItems] = useState([]);
  const [isUploading, setIsUploading] = useState(false);
  const [uploadProgress, setUploadProgress] = useState(0);
  const [activeFilter, setActiveFilter] = useState("all");
  const [searchQuery, setSearchQuery] = useState("");
  const [selectedItems, setSelectedItems] = useState([]);
  const [filteredItems, setFilteredItems] = useState([]);
  const [showDeleteModal, setShowDeleteModal] = useState(false);

  useEffect(() => {
    // Simulate loading media items
    setMediaItems(mockMediaItems);
  }, []);

  useEffect(() => {
    // Filter and search logic
    let filtered = mediaItems;

    // Apply filter
    if (activeFilter === "videos") {
      filtered = filtered?.filter((item) => item?.type === "video");
    } else if (activeFilter === "images") {
      filtered = filtered?.filter((item) => item?.type === "image");
    }

    // Apply search
    if (searchQuery?.trim()) {
      filtered = filtered?.filter((item) =>
        item?.name?.toLowerCase()?.includes(searchQuery?.toLowerCase())
      );
    }

    setFilteredItems(filtered);
  }, [mediaItems, activeFilter, searchQuery]);

  const handleFileUpload = async (files) => {
    setIsUploading(true);
    setUploadProgress(0);

    // Simulate upload progress
    const uploadInterval = setInterval(() => {
      setUploadProgress((prev) => {
        if (prev >= 100) {
          clearInterval(uploadInterval);
          setIsUploading(false);

          // Add new files to media items
          const newItems = files?.map((file, index) => ({
            id: Date.now() + index,
            name: file?.name?.replace(/\.[^/.]+$/, ""),
            type: file?.type?.startsWith("video/") ? "video" : "image",
            url: URL.createObjectURL(file),
            size: file?.size,
            uploadDate: new Date(),
            format: file?.name?.split(".")?.pop()?.toLowerCase(),
          }));

          setMediaItems((prev) => [...newItems, ...prev]);
          return 100;
        }
        return prev + 10;
      });
    }, 200);
  };

  const mediaCounts = {
    all: mediaItems?.length,
    videos: mediaItems?.filter((item) => item?.type === "video")?.length,
    images: mediaItems?.filter((item) => item?.type === "image")?.length,
  };

  const handleItemSelect = (itemId) => {
    setSelectedItems((prev) =>
      prev?.includes(itemId)
        ? prev?.filter((id) => id !== itemId)
        : [...prev, itemId]
    );
  };

  const handleSelectAll = () => {
    setSelectedItems(filteredItems?.map((item) => item?.id));
  };

  const handleDeselectAll = () => {
    setSelectedItems([]);
  };

  const handleDeleteModalVisibility = () => {
    setShowDeleteModal(!showDeleteModal);
  };

  const handleBulkDelete = () => {
    setMediaItems((prev) =>
      prev?.filter((item) => !selectedItems?.includes(item?.id))
    );
    setSelectedItems([]);
  };

  const handleItemDelete = (itemId) => {
    setMediaItems((prev) => prev?.filter((item) => item?.id !== itemId));
    setSelectedItems((prev) => prev?.filter((id) => id !== itemId));
  };

  const handleItemReplace = (itemId) => {
    // In a real app, this would open a file dialog to replace the item
    console.log("Replace item:", itemId);
  };

  return (
    <div className="space-y-6">
      <div>
        <UploadZone
          onFileUpload={handleFileUpload}
          isUploading={isUploading}
          uploadProgress={uploadProgress}
        />
        <FilterTabs
          activeFilter={activeFilter}
          onFilterChange={setActiveFilter}
          searchQuery={searchQuery}
          onSearchChange={setSearchQuery}
          mediaCounts={mediaCounts}
        />
        {selectedItems?.length > 0 && (
          <BulkActionsBar
            selectedCount={selectedItems?.length}
            onSelectAll={handleSelectAll}
            onDeselectAll={handleDeselectAll}
            onBulkDelete={handleDeleteModalVisibility}
            totalItems={filteredItems?.length}
          />
        )}
        <MediaGallery
          mediaItems={filteredItems}
          selectedItems={selectedItems}
          onItemSelect={handleItemSelect}
          onItemDelete={handleItemDelete}
          onItemReplace={handleItemReplace}
        />
      </div>

      {showDeleteModal && (
        <DeleteModal
          type={`highlight${selectedItems?.length > 1 ? "s" : ""}`}
          onConfirm={() => {
            handleBulkDelete();
            handleDeleteModalVisibility();
          }}
          onClose={handleDeleteModalVisibility}
        />
      )}
    </div>
  );
};

export default TeachingHighlightsTab;
