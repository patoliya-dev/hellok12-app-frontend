import React, { useState, useEffect } from "react";
import FilterTabs from "./FilterTabs";
import BulkActionsBar from "./BulkActionsBar";
import MediaGallery from "./MediaGallery";

const TeachingHighlightsManagement = () => {
  const [mediaItems, setMediaItems] = useState([]);
  const [filteredItems, setFilteredItems] = useState([]);
  const [activeFilter, setActiveFilter] = useState("all");
  const [searchQuery, setSearchQuery] = useState("");
  const [selectedItems, setSelectedItems] = useState([]);

  // Mock data
  const mockMediaItems = [
    {
      id: 1,
      name: "Spanish Conversation Class - Beginner Level",
      type: "video",
      url: "https://download.blender.org/peach/bigbuckbunny_movies/BigBuckBunny_640x360.m4v",
      size: 15728640,
      uploadDate: new Date("2024-08-10T14:30:00"),
      format: "mp4",
    },
    {
      id: 2,
      name: "Grammar Lesson Whiteboard",
      type: "image",
      url: "https://images.pixabay.com/photo/2017/05/13/12/40/fashion-2309519_1280.jpg",
      size: 2097152,
      uploadDate: new Date("2024-08-09T10:15:00"),
      format: "jpg",
    },
    {
      id: 3,
      name: "Student Presentation - French Culture",
      type: "video",
      url: "https://images.unsplash.com/photo-1544717297-fa95b6ee9643",
      size: 25165824,
      uploadDate: new Date("2024-08-08T16:45:00"),
      format: "mov",
    },
    {
      id: 4,
      name: "Vocabulary Cards Activity",
      type: "image",
      url: "https://images.pexels.com/photos/8471918/pexels-photo-8471918.jpeg",
      size: 1572864,
      uploadDate: new Date("2024-08-07T11:20:00"),
      format: "png",
    },
    {
      id: 5,
      name: "Interactive Language Game Session",
      type: "video",
      url: "https://images.pixabay.com/photo/2015/07/17/22/43/student-849825_1280.jpg",
      size: 18874368,
      uploadDate: new Date("2024-08-06T13:10:00"),
      format: "mp4",
    },
    {
      id: 6,
      name: "Classroom Setup for Group Work",
      type: "image",
      url: "https://images.unsplash.com/photo-1509062522246-3755977927d7",
      size: 3145728,
      uploadDate: new Date("2024-08-05T09:30:00"),
      format: "jpg",
    },
  ];

  // Load mock data
  useEffect(() => {
    setMediaItems(mockMediaItems);
  }, []);

  // Filter and search logic
  useEffect(() => {
    let filtered = mediaItems;

    if (activeFilter === "videos")
      filtered = filtered.filter((item) => item.type === "video");
    if (activeFilter === "images")
      filtered = filtered.filter((item) => item.type === "image");

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
    videos: mediaItems.filter((item) => item.type === "video").length,
    images: mediaItems.filter((item) => item.type === "image").length,
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
