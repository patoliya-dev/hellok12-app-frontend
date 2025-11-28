import { createSlice } from "@reduxjs/toolkit";
import { addStudentToParent, deleteStudentFromParent, updateProfile } from "./profileThunks";
import {
  loginUser,
  signupUser,
  fetchCurrentUser,
  refreshToken,
} from "../auth/authThunks";
import { setCurrentUser } from "../../utils/storage";

const initialState = {
  parent: {
  },
  students: [],
  selectedChildId: "",
};

const profileSlice = createSlice({
  name: "profile",
  initialState,
  reducers: {
    selectStudent(state, action) {
      state.selectedChildId = action.payload;
    },
  },
  extraReducers: (builder) => {
    // Helper function to update profile from user data
    const updateProfileFromUser = (state, user) => {
      if (!user) return;

      // Update parent profile
      if (user.role === "parent" || !user.role) {
        state.parent = {
          ...state.parent,
          fullName: user?.name ?? user?.fullName ?? state.parent.fullName,
          email: user?.email ?? state.parent.email,
          phone: user?.phone ?? user?.profile?.phone ?? state.parent.phone,
          address:
            user?.profile?.address ?? user?.address ?? state.parent.address,
          profileImage:
            user?.profileImage?.url ??
            user?.profileImage ??
            state.parent.profileImage,
        };

        // Update students/children if they exist
        if (user.profile?.children && Array.isArray(user.profile.children)) {
          state.students = user.profile.children
        }

        // ensure selectedChildId points to a valid student, or default to first
        if (!state.selectedChildId && state.students && state.students.length > 0) {
          state.selectedChildId = state.students[0]._id;
        } else if (
          state.selectedChildId &&
          !state.students.some((s) => s._id === state.selectedChildId)
        ) {
          // previously selected id is no longer present (deleted) -> reset to first or empty
          state.selectedChildId = state.students.length > 0 ? state.students[0]._id : "";
        }
      }
    };

    // Update profile after successful login
    builder.addCase(loginUser.fulfilled, (state, action) => {
      const payload = action.payload || {};
      const user = payload.user;
      updateProfileFromUser(state, user);
    });

    // Update profile after successful signup
    builder.addCase(signupUser.fulfilled, (state, action) => {
      const payload = action.payload || {};
      const user = payload.user;
      updateProfileFromUser(state, user);
    });

    // Update profile when fetching current user
    builder.addCase(fetchCurrentUser.fulfilled, (state, action) => {
      const user = action.payload;
      updateProfileFromUser(state, user);
      setCurrentUser(user);
    });

    // Update profile after token refresh (if user data is included)
    builder.addCase(refreshToken.fulfilled, (state, action) => {
      const payload = action.payload || {};
      const user = payload.user;
      if (user) {
        updateProfileFromUser(state, user);
      }
    });

    // Update profile after manual update
    builder.addCase(updateProfile.fulfilled, (state, action) => {
      const user = action.payload;
      updateProfileFromUser(state, user);
    });

    // After adding a child: payload likely contains created child object (or user)
    builder.addCase(addStudentToParent.fulfilled, (state, action) => {
      const payload = action.payload;
      // If API returned an object representing the created child
      const createdChild = payload && (payload._id || payload.id) ? payload : null;

      // If fetchCurrentUser() was dispatched successfully, updateProfileFromUser will run,
      // so students will already be refreshed. We still make sure selectedChildId points to the new child.
      if (createdChild) {
        // normalize id shape to state students (your mapping uses id: child._id || child.id)
        const newId = createdChild._id || createdChild.id;
        // If no selectedChildId yet or selectedChildId no longer valid, select the new child
        if (!state.selectedChildId || !state.students.some((s) => s.id === state.selectedChildId)) {
          state.selectedChildId = newId;
        }
      } else {
        // createdChild not returned — fallback: if students array now has at least one and no selectedChildId, pick first
        if (state.students.length > 0 && !state.selectedChildId) {
          state.selectedChildId = state.students[0].id;
        }
      }
    });

    // After deleting a child: payload is studentId (as our thunk returns studentId)
    builder.addCase(deleteStudentFromParent.fulfilled, (state, action) => {
      const deletedId = action.payload;
      if (!deletedId) {
        // fallback: nothing to do
        return;
      }

      // Remove from students array if present
      state.students = state.students.filter((s) => s.id !== deletedId);

      // If the deleted child was selected, pick a sensible fallback
      if (state.selectedChildId === deletedId) {
        if (state.students.length > 0) {
          // prefer the first student
          state.selectedChildId = state.students[0].id;
        } else {
          state.selectedChildId = "";
        }
      }
    });
  },
});

export const {
  selectStudent,
} = profileSlice.actions;
export default profileSlice.reducer;
