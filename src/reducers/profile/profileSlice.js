import { createSlice } from "@reduxjs/toolkit";
import { updateProfile } from "./profileThunks";
import {
  loginUser,
  signupUser,
  fetchCurrentUser,
  refreshToken,
} from "../auth/authThunks";

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
    updateParent(state, action) {
      state.parent = { ...state.parent, ...action.payload };
    },
    updateStudent(state, action) {
      const { id, data } = action.payload;
      state.students = state.students.map((student) =>
        student.id === id ? { ...student, ...data } : student
      );
    },
    addStudent(state, action) {
      state.students.push({ ...action.payload, id: Date.now() });
    },
    deleteStudent(state, action) {
      state.students = state.students.filter(
        (student) => student.id !== action.payload
      );
    },
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
          state.students = user.profile.children.map((child, index) => ({
            id: child._id || child.id || index + 1,
            fullName: child.name || child.fullName || "",
            email: child.email || "",
            address: child.profile?.address || child.address || "",
            age: child.age || child.profile?.age || "",
            gender: child.gender || child.profile?.gender || "",
            language: child.language || child.profile?.language || "",
            grade: child.grade || child.profile?.grade || "",
            profileImage:
              child.profileImage?.url ||
              child.profileImage ||
              state.students[index]?.profileImage ||
              "",
          }));
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
  },
});

export const {
  updateParent,
  updateStudent,
  addStudent,
  deleteStudent,
  selectStudent,
} = profileSlice.actions;
export default profileSlice.reducer;
