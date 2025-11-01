import api from '../../utils/axiosInstance';

export const initUpload = (payload) => api.post(`/attachments/presign`, payload);
// payload: { filename, mime, size, entityType, entityId, scope? }

export const completeUpload = (body = {}) =>
  api.post(`/attachments/complete`, body);

// (Optional) lookups if your BE supports it
export const getAttachment = (id) => api.get(`/attachments/${id}`);

export const claimAttachment = (attachmentId, body = {}) =>
  api.patch(`/attachments/${attachmentId}/claim`, body);

export const updateAttachment = (attachmentId, body = {}) =>
  api.patch(`/attachments/${attachmentId}`, body);

export const deleteAttachment = (attachmentId) =>
  api.delete(`/attachments/${attachmentId}`);