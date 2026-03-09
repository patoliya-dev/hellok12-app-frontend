import api from "../../utils/axiosInstance";

/**
 * List all conversations for current user
 * Returns conversations with unread counts and last message
 */
export const listConversations = async () => {
  try {
    const { data } = await api.get("/messages/");
    return data.data || [];
  } catch (error) {
    console.error("List conversations error:", error);
    throw new Error(
      error.response?.data?.message || "Failed to load conversations",
    );
  }
};

/**
 * List all teachers (for new message modal)
 */
export const listTeachers = async () => {
  try {
    const { data } = await api.get("/messages/listTeachers");
    return data.data || [];
  } catch (error) {
    console.error("List teachers error:", error);
    throw new Error(error.response?.data?.message || "Failed to load teachers");
  }
};

/**
 * Create a new thread or get existing one
 * For direct messages, returns existing thread if found
 */
export const createThread = async (threadData) => {
  try {
    const { data } = await api.post("/messages/thread", threadData);
    return data.data;
  } catch (error) {
    console.error("Create thread error:", error);
    throw new Error(error.response?.data?.message || "Failed to create thread");
  }
};

/**
 * Get messages/chats for a specific thread
 * Used for initial load and pagination
 */
export const listChats = async (threadId, limit = 30, skip = 0) => {
  try {
    const { data } = await api.get(`/messages/messages/${threadId}`, {
      params: { limit, skip },
    });
    return data.data || [];
  } catch (error) {
    console.error("List chats error:", error);
    throw new Error(error.response?.data?.message || "Failed to load messages");
  }
};

/**
 * Get total unread message count across all threads
 */
export const getTotalUnreadCount = async () => {
  try {
    const { data } = await api.get("/messages/unread-count");
    return data.data?.count || 0;
  } catch (error) {
    console.error("Get unread count error:", error);
    return 0;
  }
};

/**
 * Add participants to a group
 */
export const addParticipantsToGroup = async (threadId, participants) => {
  try {
    const { data } = await api.post(
      `/messages/thread/${threadId}/participants`,
      {
        participants,
      },
    );
    return data.data;
  } catch (error) {
    console.error("Add participants error:", error);
    throw new Error(
      error.response?.data?.message || "Failed to add participants",
    );
  }
};

/**
 * Leave a group
 */
export const leaveGroup = async (threadId) => {
  try {
    const { data } = await api.delete(`/messages/thread/${threadId}/leave`);
    return data.data;
  } catch (error) {
    console.error("Leave group error:", error);
    throw new Error(error.response?.data?.message || "Failed to leave group");
  }
};

/**
 * Download attachment
 */
export const downloadAttachment = async (url, filename) => {
  try {
    const response = await fetch(url);
    const blob = await response.blob();

    // Create a temporary URL for the blob
    const blobUrl = window.URL.createObjectURL(blob);

    // Create a temporary anchor element and trigger download
    const link = document.createElement("a");
    link.href = blobUrl;
    link.download = filename;
    document.body.appendChild(link);
    link.click();

    // Cleanup
    document.body.removeChild(link);
    window.URL.revokeObjectURL(blobUrl);

    return true;
  } catch (error) {
    console.error("Download error:", error);
    throw new Error("Failed to download file");
  }
};
