import { Routes, Route } from "react-router-dom";
import StudentDashboard from "../pages/student-parent/dashboard";
import BookLesson from "../pages/student-parent/book-lesson";
import NotFound from "../pages/NotFound";
import ProgressAnalytics from "../pages/student-parent/progress-analytics";
import Lessons from "../pages/student-parent/lessons";
import Messages from "../pages/student-parent/messages";
import LessonsCalendar from "../pages/student-parent/lesson-calendar";
import ProfileAccountSettings from "../pages/student-parent/profile-settings";
import PaymentBilling from "../pages/student-parent/payment-billing";

const StudentParentRoutes = () => {
  return (
    <Routes>
      <Route path="/dashboard" element={<StudentDashboard />} />
      <Route path="/book-lesson/:id" element={<BookLesson />} />
      <Route path="/progress-analytics" element={<ProgressAnalytics />} />
      <Route path="/lessons" element={<Lessons />} />
      <Route path="/messages" element={<Messages />} />
      <Route path="/lesson-calendar" element={<LessonsCalendar />} />
      <Route path="/profile-settings" element={<ProfileAccountSettings />} />
      <Route path="/payment-billing" element={<PaymentBilling />} />

      {/* Catch-all */}
      <Route path="*" element={<NotFound />} />
    </Routes>
  );
};

export default StudentParentRoutes;
