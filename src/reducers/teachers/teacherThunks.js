import { createAsyncThunk } from '@reduxjs/toolkit';
import { fetchDetails as fetchTeacherDetailsService } from '../../services/teachers/findTeachers.service';

/**
 * Thunk: fetchTeacherDetails
 * - Calls existing service fetchDetails(teacherId)
 * - Stores the whole teacher response into state.selectedTeacher
 * - Overwrites selectedTeacher whenever called with a new id (per requirement)
 */
export const fetchTeacherDetails = createAsyncThunk(
  'teachers/fetchTeacherDetails',
  async (teacherId, { rejectWithValue }) => {
    try {
      if (!teacherId) throw new Error('teacherId is required');
      const res = await fetchTeacherDetailsService(teacherId);
      // service returns either { success, data } or data directly — normalize:
      const teacher = res?.data ?? res;
      return teacher;
    } catch (err) {
      const payload = err?.response?.data || { message: err.message };
      return rejectWithValue(payload);
    }
  }
);
