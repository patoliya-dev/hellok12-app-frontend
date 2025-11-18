import { createAsyncThunk } from '@reduxjs/toolkit';
import * as bookingsApi from './bookingsApi';

export const createBooking = createAsyncThunk(
    'bookings/createBooking',
    async (payload, { getState, rejectWithValue }) => {
        try {
            const token = getState().auth?.token;
            const res = await bookingsApi.createBooking({ token, body: payload });
            return res.data || res;
        } catch (err) {
            return rejectWithValue(err.body || { message: err.message });
        }
    }
);
