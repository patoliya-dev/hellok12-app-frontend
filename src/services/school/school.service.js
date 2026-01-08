import api from "../../utils/axiosInstance";

export const schoolService = {
  /**
   * Get all teachers for a school
   */
  getTeachers: async () => {
    try {
      const { data } = await api.get(`/school/teachers`);
      return data?.data || data;
    } catch (error) {
      console.error("Failed to fetch teachers:", error);
      throw error.response?.data || { error: error.message };
    }
  },

  /**
   * Invite a teacher to the school
   * @param {Object} inviteData - { email, schoolId, message }
   */
  inviteTeacher: async ({ email, message }) => {
    try {
      const { data } = await api.post("/school/teacher/invite", {
        email,
        message,
      });
      return data?.data || data;
    } catch (error) {
      console.error("Failed to invite teacher:", error);
      throw error.response?.data || { error: error.message };
    }
  },

  approveRejectTeacher: async ({ teacherId, action }) => {
    try {
      const { data } = await api.post(
        `/school/teachers/${teacherId}/approval`,
        { action }
      );
      return data?.data || data;
    } catch (error) {
      console.error("Failed to approve/reject teacher:", error);
      throw error.response?.data || { error: error.message };
    }
  },

  /**
   * Get all students for a school with pagination
   * @param {Object} params - { page, limit, search, status }
   */
  getStudents: async (params = {}) => {
    try {
      const { data } = await api.get(`/school/students`, { params });
      return data?.data?.data || data?.data || data;
    } catch (error) {
      console.error("Failed to fetch students:", error);
      throw error.response?.data || { error: error.message };
    }
  },

  /**
   * Invite a student to the school
   * @param {Object} inviteData - { email, schoolId, message }
   */
  inviteStudent: async ({ email, message }) => {
    try {
      const { data } = await api.post("/school/student/invite", {
        email,
        message,
      });
      return data?.data || data;
    } catch (error) {
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

  getInvitations: async ({ role, status } = {}) => {
    try {
      const params = {};
      if (role) params.role = role; // "TEACHER" | "STUDENT"
      if (status) params.status = status; // "PENDING" | "ACCEPTED" | ...
      const { data } = await api.get("/school/invitations", { params });

      return data?.data?.data || data?.data || data;
    } catch (error) {
      console.error("Failed to get invitations:", error);
      throw error.response?.data || { error: error.message };
    }
  },

  cancelInvitation: async (invitationId) => {
    try {
      const { data } = await api.post(
        `/school/invitations/${invitationId}/cancel`
      );
      return data?.data?.data || data?.data || data;
    } catch (error) {
      console.error("Failed to cancel invitation:", error);
      throw error.response?.data || { error: error.message };
    }
  },
};
