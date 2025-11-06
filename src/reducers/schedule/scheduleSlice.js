import { createSlice } from "@reduxjs/toolkit";
import {
  fetchSchedule,
  saveSchedule,
  fetchSlotsForDate,
  updateDateSlots,
  validateLessonSlot,
} from "./scheduleThunks";

const initialState = {
  loading: false,
  error: null,
  schedule: null,
  slotsByDate: {},
  validation: null,
};

const scheduleSlice = createSlice({
  name: "schedule",
  initialState,
  reducers: {
    clearValidation(state) {
      state.validation = null;
    },
  },
  extraReducers: (builder) => {
    builder
      .addCase(fetchSchedule.pending, (s) => {
        s.loading = true;
        s.error = null;
      })
      .addCase(fetchSchedule.fulfilled, (s, { payload }) => {
        s.loading = false;
        s.schedule = payload;
      })
      .addCase(fetchSchedule.rejected, (s, { payload }) => {
        s.loading = false;
        s.error = payload?.message;
      })

      .addCase(saveSchedule.fulfilled, (s, { payload }) => {
        s.schedule = payload;
      })

      .addCase(fetchSlotsForDate.fulfilled, (s, { payload }) => {
        s.slotsByDate[payload.date] = payload.slots;
      })

      .addCase(updateDateSlots.fulfilled, (s, { payload }) => {
        s.slotsByDate[payload.date] = payload.slots;
      })

      .addCase(validateLessonSlot.fulfilled, (s, { payload }) => {
        s.validation = payload;
      });
  },
});

export const { clearValidation } = scheduleSlice.actions;
export default scheduleSlice.reducer;
