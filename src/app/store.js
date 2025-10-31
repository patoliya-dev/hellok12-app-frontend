import { configureStore } from '@reduxjs/toolkit';
import authReducer from '../reducers/auth/authSlice';
import progressReducer from '../reducers/progress/progressSlice';
import lessonsReducer from '../reducers/lessons/lessonsSlice';
import profileReducer from '../reducers/profile/profileSlice';
import attachmentReducer from '../reducers/attachments/attachmentSlice';
import courseReducers from '../reducers/courses/courseSlice';
import pageLoaderReducer from '../reducers/ui/pageLoaderSlice';

// In reducer:

const store = configureStore({
  reducer: {
    auth: authReducer,
    progress: progressReducer,
    lessons: lessonsReducer,
    profile: profileReducer,
    attachments: attachmentReducer,
    courseList: courseReducers.courseList,
    courseDetail: courseReducers.courseDetail,
    pageLoader: pageLoaderReducer,
  },
});

export default store;
