import { createAsyncThunk } from "@reduxjs/toolkit";
import api from "../../utils/axiosInstance";

// Update any user profile (parent, student, teacher, school) by id
export const updateProfile = createAsyncThunk(
  "profile/updateProfile",
  async (payload, { rejectWithValue }) => {
    try {
      const { id, ...rest } = payload || {};
      if (!id) throw new Error("Missing user id");
      await api.patch(`/auth/updateProfile/${id}`, rest, {
        headers: { "Content-Type": "application/json" },
      });
      const { data } = await api.get(`/auth/me`);
      return data?.data || null; // return refreshed user
    } catch (err) {
      return rejectWithValue(err.response?.data || err.message);
    }
  }
);

// Add a student under the current parent
export const addStudentToParent = createAsyncThunk(
  "profile/addStudentToParent",
  async (payload, { rejectWithValue }) => {
    try {
      const { data } = await api.post(`/auth/addStudentToParent`, payload, {
        headers: { "Content-Type": "application/json" },
      });
      return data?.data || data || null;
    } catch (err) {
      return rejectWithValue(err.response?.data || err.message);
    }
  }
);

// Delete a student (child) by id under current parent
export const deleteStudentFromParent = createAsyncThunk(
  "profile/deleteStudentFromParent",
  async (studentId, { rejectWithValue }) => {
    try {
      await api.delete(`/auth/deleteChildren/${studentId}`);
      return studentId;
    } catch (err) {
      return rejectWithValue(err.response?.data || err.message);
    }
  }
);
