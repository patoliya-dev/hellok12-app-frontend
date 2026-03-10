import { createAsyncThunk } from "@reduxjs/toolkit";
import { schoolService } from "../../services/school/school.service";

export const fetchSchoolInvitations = createAsyncThunk(
  "schoolInvitations/fetch",
  async ({ role, search = "", page = 1, limit = 10 }, { rejectWithValue }) => {
    try {
      const res = await schoolService.getInvitations({
        role,
        search,
        page,
        limit,
      });
      // res should be: { invitations, pagination }
      return { role, search, page, limit, ...res };
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
  async (
    { invitationId, role, search = "", page = 1, limit = 10 },
    { rejectWithValue }
  ) => {
    try {
      await schoolService.cancelInvitation(invitationId);
      return { invitationId, role, search, page, limit };
    } catch (e) {
      return rejectWithValue(
        e?.response?.data?.message ||
          e?.message ||
          "Failed to cancel invitation"
      );
    }
  }
);
