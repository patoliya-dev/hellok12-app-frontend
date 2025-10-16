import api from '../../utils/axiosInstance';
import { cleanParams } from '../../features/shared/apiTypes';

const BASE = '/api/v1';

export const listByCourse = (courseId, params) =>
  api.get(`${BASE}/courses/${courseId}/lessons`, { params: cleanParams(params) });

export const getLesson = (lessonId) => api.get(`${BASE}/lessons/${lessonId}`);

export const createLessons = (courseId, payload) =>
  api.post(`${BASE}/courses/${courseId}/lessons`, payload);

export const updateLesson = (lessonId, patch) =>
  api.patch(`${BASE}/lessons/${lessonId}`, patch);

export const deleteLesson = (lessonId) =>
  api.delete(`${BASE}/lessons/${lessonId}`);

export const duplicateLesson = (lessonId) =>
  api.post(`${BASE}/lessons/${lessonId}/duplicate`);
