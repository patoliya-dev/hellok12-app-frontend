import { useState, useEffect } from "react";
import { useDispatch } from "react-redux";
import UploadZone from "./UploadZone";
import FilterTabs from "./FilterTabs";
import BulkActionsBar from "./BulkActionsBar";
import MediaGallery from "./MediaGallery";
import DeleteModal from "components/ui/DeleteModal";
import { errorToast, successToast } from "../../../../utils/utils";
import { updateProfile as updateProfileThunk } from "reducers/profile/profileThunks";
import {
  uploadAttachmentFlow,
  deleteAttachment,
} from "reducers/attachments/attachmentThunks";

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
    // Load media items and mark intro items based on formData.profile.intro._id
    const highlights = formData?.profile?.highlights || [];
    const introId = formData?.profile?.intro?._id;
    const itemsWithIntroFlag = highlights.map((item) => {
      const itemId = item?._id || item?.id;
      return {
        ...item,
        isIntro: itemId === introId,
      };
    });
    setMediaItems(itemsWithIntroFlag);
  }, [formData]);

  useEffect(() => {
    // Filter and search logic
    let filtered = mediaItems;
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
        const result = await dispatch(
          uploadAttachmentFlow({
            file: file,
            entityType: "TeacherProfile",
            entityId: formData?.profile?._id,
            scope: "highlights",
          })
        ).unwrap();
        keys.push(result?.id || result._id);
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
        // Refresh mediaItems with updated intro flag
        const highlights = refreshed?.profile?.highlights || [];
        const introId = refreshed?.profile?.intro?._id;
        const itemsWithIntroFlag = highlights.map((item) => {
          const itemId = item?._id || item?.id;
          return {
            ...item,
            isIntro: itemId === introId,
          };
        });
        setMediaItems(itemsWithIntroFlag);
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
    setSelectedItems(filteredItems?.map((item) => item?._id || item?.id));
  };

  const handleDeselectAll = () => {
    setSelectedItems([]);
  };

  const handleDeleteModalVisibility = () => {
    setShowDeleteModal(!showDeleteModal);
  };

  const handleBulkDelete = async () => {
    try {
      const introId = formData?.profile?.intro?._id;

      // Filter out intro items that cannot be deleted
      const itemsToDelete = mediaItems.filter((item) => {
        const itemId = item?._id || item?.id;
        return selectedItems.includes(itemId) && itemId !== introId;
      });

      const introItems = mediaItems.filter((item) => {
        const itemId = item?._id || item?.id;
        return selectedItems.includes(itemId) && itemId === introId;
      });

      if (introItems.length > 0) {
        errorToast(
          "Some highlights were kept because they're intro highlights."
        );
      }

      if (itemsToDelete.length === 0) {
        setSelectedItems([]);
        return;
      }

      // Delete attachments from backend
      const deletePromises = itemsToDelete.map((item) => {
        const itemId = item?._id || item?.id;
        return dispatch(deleteAttachment(itemId)).unwrap();
      });

      await Promise.all(deletePromises);

      // Get IDs of deleted items
      const deletedIds = itemsToDelete.map((item) => item?._id || item?.id);

      // Remove deleted IDs from highlights array
      const updatedHighlights = (formData?.profile?.highlights || []).filter(
        (highlightId) => !deletedIds.includes(highlightId)
      );

      // Update profile with new highlights array
      const updatedFormData = {
        ...formData,
        profile: { ...formData.profile, highlights: updatedHighlights },
      };

      const result = await dispatch(updateProfileThunk(updatedFormData));
      if (!updateProfileThunk.fulfilled.match(result)) {
        throw new Error(result.payload || "Failed to update profile");
      }

      const refreshed = result.payload;
      if (refreshed) {
        setFormData(refreshed);
        // Refresh mediaItems with updated intro flag
        const highlights = refreshed?.profile?.highlights || [];
        const newIntroId = refreshed?.profile?.intro?._id;
        const itemsWithIntroFlag = highlights.map((item) => {
          const itemId = item?._id || item?.id;
          return {
            ...item,
            isIntro: itemId === newIntroId,
          };
        });
        setMediaItems(itemsWithIntroFlag);
      }

      setSelectedItems([]);
      successToast("Selected highlights deleted successfully.");
    } catch (error) {
      errorToast(error?.message || "Failed to delete highlights");
    }
  };

  const handleItemDelete = async (itemId) => {
    try {
      const item = mediaItems.find((m) => (m?._id || m?.id) === itemId);
      const introId = formData?.profile?.intro?._id;

      if (!item) {
        errorToast("Highlight not found");
        return;
      }

      if (itemId === introId) {
        return errorToast(
          "You can't delete this highlight. It's an intro media highlight."
        );
      }

      // Delete attachment from backend
      await dispatch(deleteAttachment(itemId)).unwrap();

      // Remove ID from highlights array
      const updatedHighlights = (formData?.profile?.highlights || []).filter(
        (highlightId) => highlightId !== itemId
      );

      // Update profile with new highlights array
      const updatedFormData = {
        ...formData,
        profile: { ...formData.profile, highlights: updatedHighlights },
      };

      const result = await dispatch(updateProfileThunk(updatedFormData));
      if (!updateProfileThunk.fulfilled.match(result)) {
        throw new Error(result.payload || "Failed to update profile");
      }

      const refreshed = result.payload;
      if (refreshed) {
        setFormData(refreshed);
        // Refresh mediaItems with updated intro flag
        const highlights = refreshed?.profile?.highlights || [];
        const newIntroId = refreshed?.profile?.intro?._id;
        const itemsWithIntroFlag = highlights.map((item) => {
          const itemId = item?._id || item?.id;
          return {
            ...item,
            isIntro: itemId === newIntroId,
          };
        });
        setMediaItems(itemsWithIntroFlag);
      }

      setSelectedItems((ids) => ids.filter((id) => id !== itemId));
      successToast("Highlight removed successfully.");
    } catch (error) {
      errorToast(error?.message || "Failed to delete highlight");
    }
  };

  const handleItemReplace = (itemId) => {
    // In a real app, this would open a file dialog to replace the item
    console.log("Replace item:", itemId);
  };

  const handleIntroChange = async (updatedItems) => {
    try {
      // Find the item that is marked as intro
      const introItem = updatedItems.find((item) => item.isIntro);
      const introId = introItem ? introItem?._id || introItem?.id : null;

      // Update the mediaItems state with the new intro status
      setMediaItems((prevItems) => {
        return prevItems.map((prevItem) => {
          const prevItemId = prevItem?._id || prevItem?.id;
          const updatedItem = updatedItems.find(
            (item) => (item?._id || item?.id) === prevItemId
          );
          return updatedItem
            ? { ...prevItem, isIntro: updatedItem.isIntro }
            : prevItem;
        });
      });

      // Update profile with new intro ID
      const updatedFormData = {
        ...formData,
        profile: {
          ...formData.profile,
          intro: introId, // Pass just the ID as per requirement
        },
      };

      const result = await dispatch(updateProfileThunk(updatedFormData));
      if (!updateProfileThunk.fulfilled.match(result)) {
        throw new Error(result.payload || "Failed to update intro");
      }

      const refreshed = result.payload;
      if (refreshed) {
        setFormData(refreshed);
        // Refresh mediaItems with updated intro flag
        const highlights = refreshed?.profile?.highlights || [];
        const newIntroId = refreshed?.profile?.intro?._id;
        const itemsWithIntroFlag = highlights.map((item) => {
          const itemId = item?._id || item?.id;
          return {
            ...item,
            isIntro: itemId === newIntroId,
          };
        });
        setMediaItems(itemsWithIntroFlag);
      }

      successToast("Intro highlight updated successfully.");
    } catch (error) {
      errorToast(error?.message || "Failed to update intro");
    }
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
          onIntroChange={handleIntroChange}
        />
      </div>

      {showDeleteModal && (
        <DeleteModal
          type={`highlight${selectedItems?.length > 1 ? "s" : ""}`}
          onConfirm={async () => {
            await handleBulkDelete();
            handleDeleteModalVisibility();
          }}
          onClose={handleDeleteModalVisibility}
        />
      )}
    </div>
  );
};

export default TeachingHighlightsTab;
