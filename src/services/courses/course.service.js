import { errorToast } from "../../utils/utils";
import api from "../../utils/axiosInstance";

export const getCourseDetails = async (id) => {
  try {
    const response = await api.get(`/courses/getCourseDetails/${id}`);
    return response.data;
  } catch (error) {
    errorToast(error.response?.data || error.message);
    throw error;
  }
};
