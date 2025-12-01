import api from "../../utils/axiosInstance";

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

export const getManageLessons = async (params = {}) => {
  try {
    const response = await api.get("/lessons/list", { params });
    return response.data;
  } catch (error) {
    console.error("Get manage lessons error:", error);
    throw new Error(error.response?.data?.message || "Failed to load lessons");
  }
};

export const getLessonsForStudent = async ({ studentId }) => {
  try {
    const response = await api.get(
      `/lessons/getLessonsForStudent/${studentId}`
    );
    return response.data;
  } catch (error) {
    console.error("Get lessons for student error:", error);
    throw new Error(
      error.response?.data?.message || "Failed to load student lessons"
    );
  }
};

export const getStudentCalendarData = async (studentId, month, year) => {
  try {
    const response = await api.get(`/lessons/students/${studentId}/calendar`, {
      params: { month, year },
    });
    return response.data.data;
  } catch (error) {
    console.error("Get student calendar data error:", error);
    throw new Error(
      error.response?.data?.message || "Failed to load calendar data"
    );
  }
};
