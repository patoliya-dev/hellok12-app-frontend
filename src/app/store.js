import { configureStore } from '@reduxjs/toolkit';
import authReducer from '../reducers/auth/authSlice';
import progressReducer from '../reducers/progress/progressSlice';
import lessonsReducer from '../reducers/lessons/lessonsSlice';
import profileReducer from '../reducers/profile/profileSlice';
import attachmentReducer from '../reducers/attachments/attachmentSlice';
import courseReducers from '../reducers/courses/courseSlice';
import pageLoaderReducer from '../reducers/ui/pageLoaderSlice';
import scheduleReducer from '../reducers/schedule/scheduleSlice'
import paymentReducer from '../reducers/payments/paymentsSlice';
import teachersReducer from '../reducers/teachers/teachersSlice';
import stripeReducer from "../reducers/stripe/stripeSlice";
import messagesReducer from "../reducers/messages/messageSlice";
import schoolReducer from "../reducers/school/schoolSlice";
import invitationReducer from "../reducers/invitations/invitationSlice";
import schoolInvitationsReducer from "../reducers/schoolInvitations/schoolInvitationsSlice"

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
    schedule: scheduleReducer,
    payments: paymentReducer,
    teachers: teachersReducer,
    stripe: stripeReducer,
    messages: messagesReducer,
    school: schoolReducer,
    invitations: invitationReducer,
    schoolInvitations: schoolInvitationsReducer
  },
});

export default store;
