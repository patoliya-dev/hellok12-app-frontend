import { Routes, Route } from "react-router-dom";
import StudentDashboard from "../pages/student/dashboard";
import BookLesson from "../pages/book-lesson";
import NotFound from "../pages/NotFound";
import ProgressAnalytics from "../pages/student/progress-analytics";
import Lessons from "../pages/student/lessons";
import Messages from "../pages/student/messages";

const StudentRoutes = () => {
  return (
    <Routes>
      <Route path="/dashboard" element={<StudentDashboard />} />
      <Route path="/book-lesson/:id" element={<BookLesson />} />
      <Route path="/progress-analytics" element={<ProgressAnalytics />} />
      <Route path="/lessons" element={<Lessons />} />
      <Route path="/messages" element={<Messages />} />

      {/* Catch-all */}
      <Route path="*" element={<NotFound />} />
    </Routes>
  );
};

export default StudentRoutes;
