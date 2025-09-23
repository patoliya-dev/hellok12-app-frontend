import { Routes, Route } from "react-router-dom";
import TeacherDashboard from "../pages/teacher/dashboard";
import NotFound from "../pages/NotFound";
import StudentsFeedback from "../pages/teacher/students-feedback";
import ScheduledLessons from "../pages/teacher/scheduled-lessons";
import ManageLessons from "../pages/teacher/manage-lessons";

const TeacherRoutes = () => {
  return (
    <Routes>
      <Route path="/dashboard" element={<TeacherDashboard />} />
      <Route path="/students-feedback" element={<StudentsFeedback />} />
      <Route path="/scheduled-lessons" element={<ScheduledLessons />} />
      <Route path="/manage-lessons" element={<ManageLessons />} />

      {/* Catch-all */}
      <Route path="*" element={<NotFound />} />
    </Routes>
  );
};

export default TeacherRoutes;
