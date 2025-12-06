import api from "../../utils/axiosInstance";

/**
 * School service for school-related API calls
 */
export const schoolService = {
  /**
   * Get all teachers for a school
   */
  getTeachers: async (schoolId) => {
    try {
      const { data } = await api.get(`/school/${schoolId}/teachers`);
      return data?.data || data || [];
    } catch (error) {
      console.error("Failed to fetch teachers:", error);
      throw error.response?.data || { error: error.message };
    }
  },

  /**
   * Invite a teacher to the school
   * @param {Object} inviteData - { email, schoolId, message }
   */
  inviteTeacher: async (inviteData) => {
    try {
      const { data } = await api.post("/school/teacher/invite", {
        email: inviteData.email,
        schoolId: inviteData.schoolId,
        message: inviteData.message,
      });
      return data?.data || data;
    } catch (error) {
      console.error("Failed to invite teacher:", error);
      throw error.response?.data || { error: error.message };
    }
  },

  /**
   * Invite a student to the school
   * @param {Object} inviteData - { email, schoolId, message }
   */
  inviteStudent: async (inviteData) => {
    try {
      const { data } = await api.post("/school/student/invite", {
        email: inviteData.email,
        schoolId: inviteData.schoolId,
        message: inviteData.message,
      });
      return data?.data || data;
    } catch (error) {
      console.error("Failed to invite student:", error);
      throw error.response?.data || { error: error.message };
    }
  },

  /**
   * Get all students for a school with pagination
   * @param {Object} params - { page, limit, search, status }
   */
  getStudents: async (params = {}) => {
    try {
      const queryParams = new URLSearchParams();
      if (params.page) queryParams.append("page", params.page);
      if (params.limit) queryParams.append("limit", params.limit);
      if (params.search) queryParams.append("search", params.search);
      if (params.status && params.status !== "all")
        queryParams.append("status", params.status);

      const queryString = queryParams.toString();
      const url = `/school/students${queryString ? `?${queryString}` : ""}`;

      const { data } = await api.get(url);
      return data?.data?.data || data?.data || data;
    } catch (error) {
      console.error("Failed to fetch students:", error);
      throw error.response?.data || { error: error.message };
    }
  },

  /**
   * Get upcoming lessons for a school
   * @param {Object} params - { limit }
   */
  getUpcomingLessons: async (params = {}) => {
    try {
      const queryParams = new URLSearchParams();
      if (params.limit) queryParams.append("limit", params.limit);

      const queryString = queryParams.toString();
      const url = `/school/upcoming-lessons${
        queryString ? `?${queryString}` : ""
      }`;

      const { data } = await api.get(url);
      return data?.data?.data || data?.data || data;
    } catch (error) {
      console.error("Failed to fetch upcoming lessons:", error);
      throw error.response?.data || { error: error.message };
    }
  },
};
