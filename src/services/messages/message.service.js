import api from "../../utils/axiosInstance";

/**
 * Get messages for a specific thread (deprecated - use socket instead)
 * Kept for backward compatibility
 */
export const getMessages = async (threadId) => {
  try {
    const response = await api.get(`/messages/${threadId}`);
    return response.data;
  } catch (error) {
    console.error("Get messages error:", error);
    return error.response?.data?.message || "Failed to get messages";
  }
};

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
      error.response?.data?.message || "Failed to load conversations"
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
 * Upload file/image for messaging
 * Returns file URL to be sent in message
 */
export const uploadMessageFile = async (file, threadId) => {
  try {
    const formData = new FormData();
    formData.append("file", file);
    formData.append("threadId", threadId);

    const { data } = await api.post("/messages/upload", formData, {
      headers: {
        "Content-Type": "multipart/form-data",
      },
    });

    return data.data;
  } catch (error) {
    console.error("Upload file error:", error);
    throw new Error(error.response?.data?.message || "Failed to upload file");
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
 * Search messages within a thread
 */
export const searchMessages = async (threadId, query) => {
  try {
    const { data } = await api.get(`/messages/search/${threadId}`, {
      params: { q: query },
    });
    return data.data || [];
  } catch (error) {
    console.error("Search messages error:", error);
    return [];
  }
};

/**
 * Delete a message
 */
export const deleteMessage = async (messageId) => {
  try {
    const { data } = await api.delete(`/messages/message/${messageId}`);
    return data.data;
  } catch (error) {
    console.error("Delete message error:", error);
    throw new Error(
      error.response?.data?.message || "Failed to delete message"
    );
  }
};

/**
 * Edit a message
 */
export const editMessage = async (messageId, newBody) => {
  try {
    const { data } = await api.put(`/messages/message/${messageId}`, {
      body: newBody,
    });
    return data.data;
  } catch (error) {
    console.error("Edit message error:", error);
    throw new Error(error.response?.data?.message || "Failed to edit message");
  }
};
