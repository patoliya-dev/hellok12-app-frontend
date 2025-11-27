import { createSlice } from "@reduxjs/toolkit";
import { fetchTeacherDetails } from "./teacherThunks";

/**
 * localStorage key for persistence
 */
const LS_KEY = "hk12_selectedTeacher_v1";

/**
 * Try to read cached teacher from localStorage on initialization
 */
function loadFromLocalStorage() {
  try {
    const raw = localStorage.getItem(LS_KEY);
    if (!raw) return null;
    return JSON.parse(raw);
  } catch (err) {
    console.warn("Failed to read selectedTeacher from localStorage", err);
    return null;
  }
}

/**
 * Save selectedTeacher to localStorage (small, safe copy)
 */
function saveToLocalStorage(teacher) {
  try {
    if (!teacher) {
      localStorage.removeItem(LS_KEY);
      return;
    }
    // Keep only necessary fields to avoid bloating LS
    localStorage.setItem(LS_KEY, JSON.stringify(teacher));
  } catch (err) {
    console.warn("Failed to persist selectedTeacher to localStorage", err);
  }
}

const initialTeacherFromLS = loadFromLocalStorage();

const teachersSlice = createSlice({
  name: "teachers",
  initialState: {
    selectedTeacher: initialTeacherFromLS || null,
    loading: false,
    error: null,
  },
  reducers: {
    // Allow manual set/clear from other parts of the app
    setSelectedTeacher(state, action) {
      state.selectedTeacher = action.payload;
      saveToLocalStorage(action.payload);
    },
    clearSelectedTeacher(state) {
      state.selectedTeacher = null;
      state.loading = false;
      state.error = null;
      saveToLocalStorage(null);
    },
  },
  extraReducers: (builder) => {
    builder
      .addCase(fetchTeacherDetails.pending, (state) => {
        state.loading = true;
        state.error = null;
      })
      .addCase(fetchTeacherDetails.fulfilled, (state, action) => {
        state.loading = false;
        // action.payload is teacher doc
        state.selectedTeacher = action.payload;
        state.error = null;
        saveToLocalStorage(action.payload);
      })
      .addCase(fetchTeacherDetails.rejected, (state, action) => {
        state.loading = false;
        state.error = action?.payload?.message || action.error?.message || "Failed to fetch teacher";
      });
  },
});

export const { setSelectedTeacher, clearSelectedTeacher } = teachersSlice.actions;

// Selectors
export const selectSelectedTeacher = (state) => state.teachers?.selectedTeacher || null;
export const selectTeacherLoading = (state) => state.teachers?.loading || false;
export const selectTeacherError = (state) => state.teachers?.error || null;

export default teachersSlice.reducer;
