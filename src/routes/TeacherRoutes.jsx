import { Routes, Route } from "react-router-dom";
import TeacherDashboard from "../pages/teacher/dashboard";
import NotFound from "../pages/NotFound";
import StudentsFeedback from "../pages/teacher/students-feedback";

const TeacherRoutes = () => {
  return (
    <Routes>
      <Route path="/dashboard" element={<TeacherDashboard />} />
      <Route path="/students-feedback" element={<StudentsFeedback />} />

      {/* Catch-all */}
      <Route path="*" element={<NotFound />} />
    </Routes>
  );
};

export default TeacherRoutes;
