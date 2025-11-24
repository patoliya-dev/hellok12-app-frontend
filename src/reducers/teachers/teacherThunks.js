import { createAsyncThunk } from '@reduxjs/toolkit';
import { fetchDetails as fetchTeacherDetailsService } from '../../services/teachers/findTeachers.service';

/**
 * Thunk: fetchTeacherDetails
 * - Calls existing service fetchDetails(teacherId)
 * - Stores the whole teacher response into state.selectedTeacher
 * - Overwrites selectedTeacher whenever called with a new id (per requirement)
 * - Async thunk to fetch teacher details by id.
 * - Idempotent: if the same id is requested and we already have it, it returns immediately.
 */
export const fetchTeacherDetails = createAsyncThunk(
  "teachers/fetchTeacherDetails",
  /**
   * payload: { teacherId, forceReload = false }
   */
  async ({ teacherId, forceReload = false }, { getState, rejectWithValue }) => {
    try {
      if (!teacherId) {
        return rejectWithValue({ message: "teacherId required" });
      }

      const state = getState();
      const current = state.teachers?.selectedTeacher;
      // If we already have the same teacher and not forced, return it (avoid network)
      if (!forceReload && current && (current._id === teacherId || current.id === teacherId)) {
        return current;
      }

      const { data } = await fetchTeacherDetailsService(teacherId);
      if (!data) {
        return rejectWithValue({ message: "Empty teacher payload" });
      }
      return data;
    } catch (err) {
      const payload = err?.response?.data || { message: err.message };
      return rejectWithValue(payload);
    }
  }
);
