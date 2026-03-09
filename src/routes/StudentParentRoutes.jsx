import { Routes, Route, Navigate } from "react-router-dom";

import StudentDashboard from "../pages/student-parent/dashboard";
import FindTeacher from "../pages/student-parent/find-teacher";
import BookLesson from "../pages/student-parent/book-lesson";
import ProgressAnalytics from "../pages/student-parent/progress-analytics";
import Lessons from "../pages/student-parent/lessons";
import Messages from "../pages/student-parent/messages";
import LessonsCalendar from "../pages/student-parent/lesson-calendar";
import ProfileAccountSettings from "../pages/student-parent/profile-settings";
import PaymentBilling from "../pages/student-parent/payment-billing";
import TeacherProfileDetail from "../pages/student-parent/teacher-profile-detail";
import PublicCourseDetails from "../pages/student-parent/course-details";
import NotificationsPage from "../pages/shared/notifications";

import NotFound from "../pages/NotFound";
import useAutoSelectChild from "../hooks/useAutoSelectChild";

const StudentParentRoutes = () => {
  useAutoSelectChild();

  return (
    <Routes>
      {/* Optional: if user hits /student or /parent without a sub-path */}
      <Route index element={<Navigate to="dashboard" replace />} />

      <Route path="dashboard" element={<StudentDashboard />} />
      <Route path="find-teacher" element={<FindTeacher />} />
      <Route path="book-lesson/:id" element={<BookLesson />} />

      <Route path="progress-analytics" element={<ProgressAnalytics />} />
      <Route path="lessons" element={<Lessons />} />
      <Route path="messages" element={<Messages />} />
      <Route path="notifications" element={<NotificationsPage />} />
      <Route path="lesson-calendar" element={<LessonsCalendar />} />

      <Route path="profile-settings" element={<ProfileAccountSettings />} />
      <Route path="payment-billing" element={<PaymentBilling />} />

      <Route
        path="teacher-profile-detail/:id"
        element={<TeacherProfileDetail />}
      />
      <Route path="course-details/:id" element={<PublicCourseDetails />} />

      {/* Catch-all */}
      <Route path="*" element={<NotFound />} />
    </Routes>
  );
};

export default StudentParentRoutes;
