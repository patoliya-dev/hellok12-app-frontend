import { createSlice, createAsyncThunk } from '@reduxjs/toolkit';
import { mockFetchProgress, mockFetchCourses } from '../../services/mockApi';

export const fetchProgress = createAsyncThunk('progress/fetchProgress', async (courseId) => {
  const response = await mockFetchProgress(courseId);
  return response;
});

export const fetchCourses = createAsyncThunk('progress/fetchCourses', async () => {
  const response = await mockFetchCourses();
  return response;
});

const progressSlice = createSlice({
  name: 'progress',
  initialState: {
    courses: [],
    selectedCourse: 'all',
    data: {},
    loading: false,
    error: null,
  },
  reducers: {
    setSelectedCourse: (state, action) => {
      state.selectedCourse = action.payload;
    },
  },
  extraReducers: (builder) => {
    builder
      .addCase(fetchProgress.pending, (state) => { state.loading = true; })
      .addCase(fetchProgress.fulfilled, (state, action) => { state.loading = false; state.data = action.payload; })
      .addCase(fetchProgress.rejected, (state, action) => { state.loading = false; state.error = action.error.message; })
      .addCase(fetchCourses.fulfilled, (state, action) => { state.courses = action.payload; });
  },
});

export const { setSelectedCourse } = progressSlice.actions;
export default progressSlice.reducer;
