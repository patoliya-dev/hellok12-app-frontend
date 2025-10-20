import api from '../../utils/axiosInstance';
import { cleanParams } from '../../features/shared/apiTypes';

// const BASE = '/api/v1';

export const listCourses = (params) =>
  api.get(`/courses`, { params: cleanParams(params) });

export const getCourse = (id) => api.get(`/courses/${id}`);

export const createCourse = (payload) => api.post(`/courses`, payload);

export const updateCourse = (id, patch) => api.patch(`/courses/${id}`, patch);

export const deleteCourse = (id) => api.delete(`/courses/${id}`);

export const duplicateCourse = (id) => api.post(`/courses/${id}/duplicate`);

export const getCourseWithLessons = (id) => api.get(`/courses/${id}/lessons`);

