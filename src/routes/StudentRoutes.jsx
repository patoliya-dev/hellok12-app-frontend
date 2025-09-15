import { Routes, Route } from "react-router-dom";
import StudentDashboard from "../pages/student/dashboard";
import BookLession from "../pages/book-lession";
import NotFound from "../pages/NotFound";
import ProgressAnalytics from "../pages/student/progress-analytics";
import Lessons from "../pages/student/lessons";
import Messages from "../pages/student/messages";

const StudentRoutes = () => {
  return (
    <Routes>
      <Route path="/dashboard" element={<StudentDashboard />} />
      <Route path="/book-lession/:id" element={<BookLession />} />
      <Route path="/progress-analytics" element={<ProgressAnalytics />} />
      <Route path="/lessons" element={<Lessons />} />
      <Route path="/messages" element={<Messages />} />

      {/* Catch-all */}
      <Route path="*" element={<NotFound />} />
    </Routes>
  );
};

export default StudentRoutes;
