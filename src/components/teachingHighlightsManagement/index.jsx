import React, { useState, useEffect } from "react";
import FilterTabs from "./FilterTabs";
import BulkActionsBar from "./BulkActionsBar";
import MediaGallery from "./MediaGallery";

const TeachingHighlightsManagement = ({ highlights }) => {
  const [mediaItems, setMediaItems] = useState([]);
  const [filteredItems, setFilteredItems] = useState([]);
  const [activeFilter, setActiveFilter] = useState("all");
  const [searchQuery, setSearchQuery] = useState("");
  const [selectedItems, setSelectedItems] = useState([]);


  // Load data
  useEffect(() => {
    setMediaItems(highlights);
  }, []);

  // Filter and search logic
  useEffect(() => {
    let filtered = mediaItems;

    if (activeFilter === "videos")
      filtered = filtered.filter((item) => item.mime.startsWith("video"));
    if (activeFilter === "images")
      filtered = filtered.filter((item) => item.mime.startsWith("image"));

    if (searchQuery.trim()) {
      filtered = filtered.filter((item) =>
        item.name.toLowerCase().includes(searchQuery.toLowerCase())
      );
    }

    setFilteredItems(filtered);
  }, [mediaItems, activeFilter, searchQuery]);

  // Item selection handlers
  const handleItemSelect = (itemId) => {
    setSelectedItems((prev) =>
      prev.includes(itemId)
        ? prev.filter((id) => id !== itemId)
        : [...prev, itemId]
    );
  };

  const handleSelectAll = () =>
    setSelectedItems(filteredItems.map((item) => item.id));
  const handleDeselectAll = () => setSelectedItems([]);
  const handleItemDelete = (itemId) => {
    setMediaItems((prev) => prev.filter((item) => item.id !== itemId));
    setSelectedItems((prev) => prev.filter((id) => id !== itemId));
  };

  const handleBulkDelete = () => {
    if (
      window.confirm(
        `Are you sure you want to delete ${selectedItems.length} item${
          selectedItems.length !== 1 ? "s" : ""
        }?`
      )
    ) {
      setMediaItems((prev) =>
        prev.filter((item) => !selectedItems.includes(item.id))
      );
      setSelectedItems([]);
    }
  };

  const handleItemReplace = (itemId) => {
    console.log("Replace item:", itemId);
  };

  const mediaCounts = {
    all: mediaItems.length,
    videos: mediaItems.filter((item) => item?.mime?.startsWith("video")).length,
    images: mediaItems.filter((item) => item?.mime?.startsWith("image")).length,
  };

  return (
    <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
      <FilterTabs
        activeFilter={activeFilter}
        onFilterChange={setActiveFilter}
        searchQuery={searchQuery}
        onSearchChange={setSearchQuery}
        mediaCounts={mediaCounts}
      />

      {selectedItems.length > 0 && (
        <BulkActionsBar
          selectedCount={selectedItems.length}
          onSelectAll={handleSelectAll}
          onDeselectAll={handleDeselectAll}
          onBulkDelete={handleBulkDelete}
          totalItems={filteredItems.length}
        />
      )}

      <MediaGallery
        mediaItems={filteredItems}
        selectedItems={selectedItems}
        onItemSelect={handleItemSelect}
        onItemDelete={handleItemDelete}
        onItemReplace={handleItemReplace}
        showBulkActions={selectedItems.length > 0}
      />
    </div>
  );
};

export default TeachingHighlightsManagement;
