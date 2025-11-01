import { createSlice } from "@reduxjs/toolkit";
import { updateProfile } from "./profileThunks";

const initialState = {
  parent: {
    fullName: "Emma Johnson",
    phone: "+1 (555) 123-4567",
    email: "emmajohnson@email.com",
    address: "19 Washington Square N, New York, NY 10011, USA",
    profileImage:
      "https://images.unsplash.com/photo-1544005313-94ddf0286df2?w=150&h=150&fit=crop&crop=face",
  },
  students: [
    {
      id: 1,
      fullName: "Alex Johnson",
      email: "alexjohnson@email.com",
      address: "19 Washington Square N, New York, NY 10011, USA",
      age: 15,
      gender: "Male",
      language: "English",
      grade: "Grade 9",
      profileImage:
        "https://images.unsplash.com/photo-1507003211169-0a1dd7228f2d?w=150&h=150&fit=crop&crop=face",
    },
    {
      id: 2,
      fullName: "Mia Johnson",
      email: "miajohnson@email.com",
      address: "19 Washington Square N, New York, NY 10011, USA",
      age: 12,
      gender: "Female",
      language: "English, Spanish",
      grade: "Grade 6",
      profileImage:
        "https://images.unsplash.com/photo-1494790108377-be9c29b29330?w=150&h=150&fit=crop&crop=face",
    },
  ],
  selectedChildId: 1,
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
    builder.addCase(updateProfile.fulfilled, (state, action) => {
      const user = action.payload;
      if (!user) return;
      state.parent = {
        ...state.parent,
        fullName: user?.name ?? state.parent.fullName,
        email: user?.email ?? state.parent.email,
        address: user?.profile?.address ?? state.parent.address,
        profileImage: user?.profileImage?.url ?? state.parent.profileImage,
      };
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
