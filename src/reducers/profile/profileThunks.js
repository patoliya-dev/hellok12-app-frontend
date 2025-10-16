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
      const { data } = await api.get("/auth/me");
      return data?.data || null; // return refreshed user
    } catch (err) {
      return rejectWithValue(err.response?.data || err.message);
    }
  }
);
