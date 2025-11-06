import api from "../../utils/axiosInstance";

export const getTeacherSchedule = (teacherId) =>
  api.get(`/teachers/${teacherId}/schedule`);

export const upsertTeacherSchedule = (teacherId, body) =>
  api.patch(`/teachers/${teacherId}/schedule`, body);

export const getSlotsForDate = (teacherId, date) =>
  api.get(`/teachers/${teacherId}/schedule/slots`, { params: { date } });

export const patchDateSlots = (teacherId, body) =>
  api.post(`/teachers/${teacherId}/schedule/date`, body);

export const validateLessonSlot = (teacherId, body) =>
  api.post(`/teachers/${teacherId}/schedule/validate`, body);
