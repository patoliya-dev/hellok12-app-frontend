import api from "../../utils/axiosInstance";

/**
 * Student service for student dashboard data
 */
export const studentService = {
  /**
   * Get weekly schedule for student dashboard
   * @returns {Promise} Weekly schedule data
   */
  getWeeklySchedule: async ({ studentId }) => {
    try {
      const response = await api.get(
        `students/dashboard/weekly-schedule/${studentId}`
      );
      return response.data;
    } catch (error) {
      throw error.response?.data || { error: error.message };
    }
  },
};
