import { configureStore } from '@reduxjs/toolkit';
import authReducer from '../features/auth/authSlice';
import progressReducer from '../features/progress/progressSlice';
import lessonsReducer from '../features/lessons/lessonsSlice';

// In reducer:

const store = configureStore({
  reducer: {
    auth: authReducer,
    progress: progressReducer,
    lessons: lessonsReducer,
  },
});

export default store;
