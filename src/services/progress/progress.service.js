import api from "../../utils/axiosInstance";

/**
 * Progress service for student progress tracking and analytics
 */
export const progressService = {
  /**
   * Get progress dashboard data for a student
   * @param {string} studentId - The student ID
   * @returns {Promise} Progress dashboard data
   */
  getProgressDashboard: async (studentId) => {
    try {
      const response = await api.get(`/progress/dashboard/${studentId}`);
      return response.data;
    } catch (error) {
      throw error.response?.data || { error: error.message };
    }
  },

  /**
   * Get progress analytics data for a student
   * @param {string} studentId - The student ID
   * @param {string} courseId - Optional course ID to filter analytics
   * @returns {Promise} Progress analytics data
   */
  getProgressAnalytics: async (studentId, courseId = null) => {
    try {
      const params = courseId && courseId !== "all" ? { courseId } : {};
      const response = await api.get(`/progress/analytics/${studentId}`, {
        params,
      });
      return response.data;
    } catch (error) {
      throw error.response?.data || { error: error.message };
    }
  },
};
