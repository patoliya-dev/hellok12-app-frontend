import { createSlice } from "@reduxjs/toolkit";
import {
  fetchSchoolInvitations,
  cancelSchoolInvitation,
} from "./schoolInvitationsThunks";

const initialState = {
  byKey: {}, // key = `${role}:${status}`
  loadingByKey: {},
  errorByKey: {},
};

const keyOf = (role, status) => `${role || "ALL"}:${status || "ALL"}`;

const normalizeStatus = (s) => String(s || "").toUpperCase();

const slice = createSlice({
  name: "schoolInvitations",
  initialState,
  reducers: {
    clearInvitationsError: (state, action) => {
      const { role, status } = action.payload || {};
      const k = keyOf(role, status);
      delete state.errorByKey[k];
    },
  },
  extraReducers: (builder) => {
    builder
      .addCase(fetchSchoolInvitations.pending, (state, action) => {
        const { role, status } = action.meta.arg || {};
        const k = keyOf(role, status);
        state.loadingByKey[k] = true;
        state.errorByKey[k] = null;
      })
      .addCase(fetchSchoolInvitations.fulfilled, (state, action) => {
        const { role, status } = action.payload || {};
        const k = keyOf(role, status);

        const invitations = (action.payload?.invitations || []).map((inv) => ({
          ...inv,
          status: normalizeStatus(inv.status),
        }));

        state.byKey[k] = invitations;
        state.loadingByKey[k] = false;
      })
      .addCase(fetchSchoolInvitations.rejected, (state, action) => {
        const { role, status } = action.meta.arg || {};
        const k = keyOf(role, status);
        state.loadingByKey[k] = false;
        state.errorByKey[k] = action.payload || action.error?.message;
      })

      .addCase(cancelSchoolInvitation.pending, (state, action) => {
        // optional: could set a per-item loading flag, keeping simple here
      })
      .addCase(cancelSchoolInvitation.fulfilled, (state, action) => {
        const { invitationId, role, status } = action.payload || {};
        const k = keyOf(role, status);

        const list = state.byKey[k] || [];
        state.byKey[k] = list.map((inv) =>
          String(inv._id) === String(invitationId)
            ? { ...inv, status: "CANCELLED" }
            : inv
        );
      });
  },
});

export const { clearInvitationsError } = slice.actions;
export default slice.reducer;

export const selectInvitations = (state, role, status) => {
  const k = `${role || "ALL"}:${status || "ALL"}`;
  return state.schoolInvitations?.byKey?.[k] || [];
};
export const selectInvitationsLoading = (state, role, status) => {
  const k = `${role || "ALL"}:${status || "ALL"}`;
  return Boolean(state.schoolInvitations?.loadingByKey?.[k]);
};
export const selectInvitationsError = (state, role, status) => {
  const k = `${role || "ALL"}:${status || "ALL"}`;
  return state.schoolInvitations?.errorByKey?.[k] || null;
};
