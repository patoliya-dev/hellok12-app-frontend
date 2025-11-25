import api from "../../utils/axiosInstance";

/**
 * Get teacher dashboard data
 * Returns today's sessions, metrics, and other dashboard information
 */
export const getDashboardData = async () => {
  try {
    const response = await api.get("/lessons/dashboard");
    return response.data;
  } catch (error) {
    console.error("Get dashboard data error:", error);
    throw new Error(
      error.response?.data?.message || "Failed to load dashboard data"
    );
  }
};

/**
 * Get calendar data for scheduled lessons
 * Used for: Page load and Month change
 * @param {number} month - Month (1-12)
 * @param {number} year - Year (e.g., 2025)
 */
export const getCalendarData = async (month, year) => {
  try {
    const response = await api.get("/lessons/calendar", {
      params: { month, year },
    });
    return response.data.data;
  } catch (error) {
    console.error("Get calendar data error:", error);
    throw new Error(
      error.response?.data?.message || "Failed to load calendar data"
    );
  }
};

/**
 * Get lessons for a specific date
 * Used for: When user clicks on a date
 * @param {string} date - Date in YYYY-MM-DD format
 */
export const getLessonsByDate = async (date) => {
  try {
    const response = await api.get(`/lessons/calendar/${date}`);
    return response.data;
  } catch (error) {
    console.error("Get lessons by date error:", error);
    throw new Error(
      error.response?.data?.message ||
        "Failed to load lessons for the selected date"
    );
  }
};

/**
 * Get manage lessons with pagination and filters
 * Used for: Manage Lessons page
 * @param {Object} params - Query parameters
 * @param {number} params.page - Page number (default: 1)
 * @param {number} params.limit - Items per page (default: 10)
 * @param {string} params.status - Filter by status (optional)
 * @param {string} params.studentName - Filter by student name (optional)
 * @param {string} params.startDate - Filter by start date (optional)
 * @param {string} params.endDate - Filter by end date (optional)
 * @param {string} params.sortBy - Sort field (optional)
 * @param {string} params.sortOrder - Sort order: 'asc' or 'desc' (optional)
 */
export const getManageLessons = async (params = {}) => {
  try {
    const response = await api.get("/lessons/list", { params });
    return response.data;
  } catch (error) {
    console.error("Get manage lessons error:", error);
    throw new Error(error.response?.data?.message || "Failed to load lessons");
  }
};
