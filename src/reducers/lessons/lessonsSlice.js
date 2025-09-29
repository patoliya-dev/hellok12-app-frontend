// src/redux/slices/lessonsSlice.js
import { createSlice, createAsyncThunk } from '@reduxjs/toolkit';
import { mockFetchUpcomingLessons } from '../../services/mockApi';

export const fetchUpcomingLessons = createAsyncThunk(
  'lessons/fetchUpcoming',
  async (_, { rejectWithValue }) => {
    try {
      const response = await mockFetchUpcomingLessons();
      return response;
    } catch (error) {
      return rejectWithValue(error.message);
    }
  }
);

const lessonsSlice = createSlice({
  name: 'lessons',
  initialState: {
    upcomingLessons: [],
    status: 'idle', // 'idle' | 'loading' | 'succeeded' | 'failed'
    error: null,
  },
  reducers: {},
  extraReducers: (builder) => {
    builder
      .addCase(fetchUpcomingLessons.pending, (state) => {
        state.status = 'loading';
      })
      .addCase(fetchUpcomingLessons.fulfilled, (state, action) => {
        state.status = 'succeeded';
        state.upcomingLessons = action.payload;
      })
      .addCase(fetchUpcomingLessons.rejected, (state, action) => {
        state.status = 'failed';
        state.error = action.payload;
      });
  },
});

export default lessonsSlice.reducer;
