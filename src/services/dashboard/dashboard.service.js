import api from "../../utils/axiosInstance";

/**
 * Dashboard service for teacher dashboard metrics and data
 */
export const dashboardService = {
  /**
   * Get dashboard metrics for a teacher
   * @returns {Promise} Dashboard metrics data
   */
  getDashboardMetrics: async () => {
    try {
      const response = await api.get("/teachers/dashboard");
      return response.data;
    } catch (error) {
      throw error.response?.data || { error: error.message };
    }
  },
};
