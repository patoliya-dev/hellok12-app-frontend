import api from "../../utils/axiosInstance";
import { buildQueryParams, errorToast } from "../../utils/utils";

export const fetchTeachers = async (filters, pagination) => {
  try {
    const queryString = buildQueryParams(filters, pagination);
    const response = await api.get(`/find-teacher?${queryString}`);
    return response.data; // { success, data, count, nextOffset }
  } catch (error) {
    errorToast(error.response?.data || error.message);
    throw error;
  }
};

export const fetchDetails = async (teacherId) => {
  try {
    const response = await api.get(`/find-teacher/${teacherId}`);
    return response.data;
  } catch (error) {
    errorToast(error.response?.data || error.message);
    throw error;
  }
};
