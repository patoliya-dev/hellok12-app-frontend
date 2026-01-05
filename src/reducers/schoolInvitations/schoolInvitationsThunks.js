import { createAsyncThunk } from "@reduxjs/toolkit";
import { schoolService } from "../../services/school/school.service";

export const fetchSchoolInvitations = createAsyncThunk(
  "schoolInvitations/fetch",
  async ({ role, status }, { rejectWithValue }) => {
    try {
      const res = await schoolService.getInvitations({ role, status });
      return { role, status, ...res };
    } catch (e) {
      return rejectWithValue(
        e?.response?.data?.message ||
          e?.message ||
          "Failed to fetch invitations"
      );
    }
  }
);

export const cancelSchoolInvitation = createAsyncThunk(
  "schoolInvitations/cancel",
  async ({ invitationId, role, status }, { rejectWithValue }) => {
    try {
      await schoolService.cancelInvitation(invitationId);
      return { invitationId, role, status };
    } catch (e) {
      return rejectWithValue(
        e?.response?.data?.message ||
          e?.message ||
          "Failed to cancel invitation"
      );
    }
  }
);
