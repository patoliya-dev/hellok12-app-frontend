import api from "../../utils/axiosInstance";
import { buildQueryParams } from "../../utils/utils";

export const fetchTeachers = async (filters, pagination) => {
  try {
    const queryString = buildQueryParams(filters, pagination);
    const response = await api.get(`/find-teacher?${queryString}`);
    return response.data; // { success, data, count, nextOffset }
  } catch (error) {
    console.error(
      "Error fetching teachers:",
      error.response?.data || error.message
    );
    throw error;
  }
};
