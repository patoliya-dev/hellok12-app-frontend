import api from '../../utils/axiosInstance';
import { cleanParams } from '../../features/shared/apiTypes';

export const createBooking = ({ token, body }) =>
    api.post(`/bookings`, body, { headers: token ? { Authorization: `Bearer ${token}` } : undefined });
