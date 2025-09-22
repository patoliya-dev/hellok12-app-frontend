import { Routes, Route } from "react-router-dom";
import TeacherDashboard from "../pages/teacher/dashboard";
import NotFound from "../pages/NotFound";

const TeacherRoutes = () => {
  return (
    <Routes>
      <Route path="/dashboard" element={<TeacherDashboard />} />

      {/* Catch-all */}
      <Route path="*" element={<NotFound />} />
    </Routes>
  );
};

export default TeacherRoutes;
