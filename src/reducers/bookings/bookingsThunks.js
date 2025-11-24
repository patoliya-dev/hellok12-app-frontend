import { createAsyncThunk } from '@reduxjs/toolkit';
import * as bookingsApi from './bookingsApi';

export const createBooking = createAsyncThunk(
    'bookings/createBooking',
    async (payload, { rejectWithValue }) => {
        try {
            const { data } = await bookingsApi.createBooking(payload);
            return data;
        } catch (err) {
            return rejectWithValue(err.body || { message: err.message });
        }
    }
);
