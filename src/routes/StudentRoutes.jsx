import { Routes, Route } from "react-router-dom";
import StudentDashboard from "../pages/student/dashboard";
import BookLesson from "../pages/book-lesson";
import NotFound from "../pages/NotFound";
import ProgressAnalytics from "../pages/student/progress-analytics";
import Lessons from "../pages/student/lessons";
import Messages from "../pages/student/messages";
import LessonsCalendar from "../pages/student/lesson-calendar";
import PaymentBilling from "../pages/student/payment-billing";

const StudentRoutes = () => {
  return (
    <Routes>
      <Route path="/dashboard" element={<StudentDashboard />} />
      <Route path="/book-lesson/:id" element={<BookLesson />} />
      <Route path="/progress-analytics" element={<ProgressAnalytics />} />
      <Route path="/lessons" element={<Lessons />} />
      <Route path="/messages" element={<Messages />} />
      <Route path="/lesson-calendar" element={<LessonsCalendar />} />
      <Route path="/payment-billing" element={<PaymentBilling />} />

      {/* Catch-all */}
      <Route path="*" element={<NotFound />} />
    </Routes>
  );
};

export default StudentRoutes;
