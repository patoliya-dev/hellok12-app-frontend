import api from "../../utils/axiosInstance";

export const feedbackRatingAPI = {
  getFeedbackRatings: async (params = {}) => {
    try {
      const queryParams = new URLSearchParams();

      if (params.page) queryParams.append("page", params.page);
      if (params.limit) queryParams.append("limit", params.limit);
      if (params.rating && params.rating !== "all") {
        queryParams.append("rating", params.rating);
      }
      if (params.sortBy) queryParams.append("sortBy", params.sortBy);
      if (params.teacherId) queryParams.append("teacherId", params.teacherId);
      if (params.courseId) queryParams.append("courseId", params.courseId);

      const response = await api.get(`/feedbacks?${queryParams.toString()}`);

      return response.data;
    } catch (error) {
      throw error.response?.data || { error: error.message };
    }
  },

  getFeedbackStats: async (teacherId) => {
    try {
      const response = await api.get(`/feedbacks/stats/${teacherId}`);
      return response.data;
    } catch (error) {
      throw error.response?.data || { error: error.message };
    }
  },
};
