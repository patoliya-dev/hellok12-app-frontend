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

export function parseAvailabilityValue(availability) {
  if (!availability) return null;

  const parts = availability.split(",");

  if (parts.length === 1) {
    return {
      startDate: new Date(parts[0]),
      endDate: new Date(parts[0]),
    };
  } else if (parts.length === 2) {
    return {
      startDate: new Date(parts[0]),
      endDate: new Date(parts[1]),
    };
  }

  return null;
}
