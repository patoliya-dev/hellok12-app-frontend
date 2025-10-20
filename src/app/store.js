import { configureStore } from '@reduxjs/toolkit';
import authReducer from '../reducers/auth/authSlice';
import progressReducer from '../reducers/progress/progressSlice';
import lessonsReducer from '../reducers/lessons/lessonsSlice';
import profileReducer from '../reducers/profile/profileSlice';

// In reducer:

const store = configureStore({
  reducer: {
    auth: authReducer,
    progress: progressReducer,
    lessons: lessonsReducer,
    profile: profileReducer,
  },
});

export default store;
