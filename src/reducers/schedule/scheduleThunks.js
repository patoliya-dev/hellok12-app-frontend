import { createAsyncThunk } from "@reduxjs/toolkit";
import * as api from "./scheduleApi";

export const fetchSchedule = createAsyncThunk(
  "schedule/fetch",
  async (teacherId, { rejectWithValue }) => {
    try {
      const { data } = await api.getTeacherSchedule(teacherId);
      if (!data.success) return rejectWithValue(data);
      return data.data;
    } catch (err) {
      return rejectWithValue(err.response?.data || { message: "Fetch failed" });
    }
  }
);

export const saveSchedule = createAsyncThunk(
  "schedule/save",
  async ({ teacherId, body }, { rejectWithValue }) => {
    try {
      const { data } = await api.upsertTeacherSchedule(teacherId, body);
      if (!data.success) return rejectWithValue(data);
      return data.data;
    } catch (err) {
      return rejectWithValue(err.response?.data || { message: "Save failed" });
    }
  }
);

export const fetchSlotsForDate = createAsyncThunk(
  "schedule/fetchSlots",
  async ({ teacherId, date }, { rejectWithValue }) => {
    try {
      const { data } = await api.getSlotsForDate(teacherId, date);
      if (!data.success) return rejectWithValue(data);
      return { date, slots: data.data.slots };
    } catch (err) {
      return rejectWithValue(err.response?.data || { message: "Slots fetch failed" });
    }
  }
);

export const updateDateSlots = createAsyncThunk(
  "schedule/updateDateSlots",
  async ({ teacherId, body }, { rejectWithValue }) => {
    try {
      const { data } = await api.patchDateSlots(teacherId, body);
      if (!data.success) return rejectWithValue(data);
      return { date: body.date, slots: data.data.slots };
    } catch (err) {
      return rejectWithValue(err.response?.data || { message: "Update date slots failed" });
    }
  }
);

export const validateLessonSlot = createAsyncThunk(
  "schedule/validateLesson",
  async ({ teacherId, body }, { rejectWithValue }) => {
    try {
      const { data } = await api.validateLessonSlot(teacherId, body);
      return data.data; // { ok: true/false, reasons: [...] }
    } catch (err) {
      return rejectWithValue(err.response?.data || { message: "Validation failed" });
    }
  }
);
