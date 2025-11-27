import api from '../../utils/axiosInstance';

export const createBooking = (body) =>
    api.post(`/bookings`, body);
