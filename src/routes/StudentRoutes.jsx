import { Routes, Route } from "react-router-dom";
import StudentDashboard from "../pages/student/dashboard";
import BookLession from "../pages/book-lession";
import NotFound from "../pages/NotFound";

const StudentRoutes = () => {
  return (
    <Routes>
      <Route path="/dashboard" element={<StudentDashboard />} />
      <Route path="/book-lession/:id" element={<BookLession />} />

      {/* Catch-all */}
      <Route path="*" element={<NotFound />} />
    </Routes>
  );
};

export default StudentRoutes;
