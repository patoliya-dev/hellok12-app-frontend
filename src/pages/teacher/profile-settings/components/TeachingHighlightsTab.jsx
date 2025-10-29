import { useState, useEffect } from "react";
import { useDispatch } from "react-redux";
import UploadZone from "./UploadZone";
import FilterTabs from "./FilterTabs";
import BulkActionsBar from "./BulkActionsBar";
import MediaGallery from "./MediaGallery";
import DeleteModal from "components/ui/DeleteModal";
import { errorToast, successToast } from "../../../../utils/utils";
import { upsertAttachmentAndUpdateEntity } from "../../../../utils/s3";
import { updateProfile as updateProfileThunk } from "reducers/profile/profileThunks";
import api from "../../../../utils/axiosInstance";

const TeachingHighlightsTab = ({ formData, setFormData }) => {
  const dispatch = useDispatch();
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
    setMediaItems(formData?.profile?.highlights || []);
    console.log(formData?.profile?.highlights, "formData?.profile?.highlights");
  }, []);

  useEffect(() => {
    // Filter and search logic
    let filtered = mediaItems;
    console.log(filtered, "filtered");
    // Apply filter
    if (activeFilter === "videos") {
      filtered = filtered?.filter((item) => item?.mime.startsWith("video"));
    } else if (activeFilter === "images") {
      filtered = filtered?.filter((item) => item?.mime.startsWith("image"));
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
    for (const file of files) {
      if (file.size > 100000000) {
        errorToast("File size exceeds 100MB");
        return;
      }
    }

    setIsUploading(true);
    setUploadProgress(0);

    let intervalId;
    const startSmoothProgress = () => {
      let progress = 0;
      intervalId = setInterval(() => {
        progress += Math.floor(Math.random() * 10);
        if (progress >= 90) progress = 90;
        setUploadProgress(progress);
      }, 200);
    };

    try {
      startSmoothProgress();

      let keys = [...(formData?.profile?.highlights || [])];
      for (const file of files) {
        const key = await upsertAttachmentAndUpdateEntity({
          file,
          entityType: "TeacherProfile",
          entityId: formData?.profile?._id,
          apiClient: api,
          scope: "highlights",
          onUpdateEntity: () => {},
        });
        keys.push(key?.id);
      }

      let updatedFormData = {
        ...formData,
        profile: { ...formData.profile, highlights: keys },
      };

      const result = await dispatch(updateProfileThunk(updatedFormData));
      if (!updateProfileThunk.fulfilled.match(result)) {
        throw new Error(result.payload || "Failed to update profile");
      }

      const refreshed = result.payload;
      if (refreshed) {
        clearInterval(intervalId);
        setUploadProgress(100);

        setFormData(refreshed);
        setMediaItems(refreshed?.profile?.highlights || []);
        successToast("Highlights updated successfully");
      }
    } catch (error) {
      clearInterval(intervalId);
      setUploadProgress(0);
      errorToast(error?.message || "Failed to update highlights");
    } finally {
      setIsUploading(false);
      setTimeout(() => setUploadProgress(0), 1000);
    }
  };

  const mediaCounts = {
    all: mediaItems?.length,
    videos: mediaItems?.filter((item) => item?.mime.startsWith("video"))
      ?.length,
    images: mediaItems?.filter((item) => item?.mime.startsWith("image"))
      ?.length,
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
    const introItems = mediaItems.filter(
      (item) => selectedItems.includes(item.id) && item.isIntro
    );

    setMediaItems((prev) =>
      prev.filter((item) => !selectedItems.includes(item.id) || item.isIntro)
    );

    setSelectedItems([]);

    if (introItems.length) {
      errorToast("Some highlights were kept because they’re intro highlights.");
    } else {
      successToast("Selected highlights deleted successfully.");
    }
  };

  const handleItemDelete = (itemId) => {
    const item = mediaItems.find((m) => m.id === itemId);

    if (!item) return; // safety check

    if (item.isIntro) {
      return errorToast(
        "You can’t delete this highlight. It’s an intro media highlight."
      );
    }

    setMediaItems((items) => items.filter((m) => m.id !== itemId));
    setSelectedItems((ids) => ids.filter((id) => id !== itemId));

    return successToast("Highlight removed successfully.");
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
