// src/reducers/teachers/teachersSlice.js
import { createSlice } from '@reduxjs/toolkit';
import { errorToast } from '../../utils/utils';
import { fetchTeacherDetails } from './teacherThunks';

const initialState = {
  selectedTeacher: null, // single teacher object kept for the current teacher page / booking flows
  loading: false,
  error: null
};

const teachersSlice = createSlice({
  name: 'teachers',
  initialState,
  reducers: {
    clearSelectedTeacher(state) {
      state.selectedTeacher = null;
      state.loading = false;
      state.error = null;
    },
    setSelectedTeacher(state, action) {
      state.selectedTeacher = action.payload ?? null;
      state.loading = false;
      state.error = null;
    }
  },
  extraReducers: (builder) => {
    builder
      .addCase(fetchTeacherDetails.pending, (state) => {
        state.loading = true;
        state.error = null;
      })
      .addCase(fetchTeacherDetails.fulfilled, (state, action) => {
        state.loading = false;
        state.selectedTeacher = action.payload;
        state.error = null;
      })
      .addCase(fetchTeacherDetails.rejected, (state, action) => {
        state.loading = false;
        state.error = action.payload?.message || action.error?.message || 'Failed to load teacher';
        // show a toast for better UX
        try { errorToast(state.error); } catch (e) { /* toast optional */ }
      });
  }
});

export const { clearSelectedTeacher, setSelectedTeacher } = teachersSlice.actions;

export const selectSelectedTeacher = (state) => state.teachers?.selectedTeacher;
export const selectTeachersLoading = (state) => state.teachers?.loading;
export const selectTeachersError = (state) => state.teachers?.error;

export default teachersSlice.reducer;
