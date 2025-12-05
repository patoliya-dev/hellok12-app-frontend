import { Routes, Route } from "react-router-dom";
// import SchoolDashboard from "../pages/school/dashboard";
import NotFound from "../pages/NotFound";
import UpcomingLessons from "../pages/school/upcoming-lessons";
import ScheduledLessons from "../pages/school/scheduled-lessons";
import ManageTeachers from "../pages/school/manage-teachers";
import SchoolDashboard from "../pages/school/dashboard";
import ManageStudents from "../pages/school/manage-students";

const SchoolRoutes = () => {
  return (
    <Routes>
      <Route path="/dashboard" element={<SchoolDashboard />} />
      <Route path="/upcoming-lessons" element={<UpcomingLessons />} />
      <Route path="/scheduled-lessons" element={<ScheduledLessons />} />
      <Route path="/manage-teachers" element={<ManageTeachers />} />
      <Route path="/manage-students" element={<ManageStudents />} />

      {/* Catch-all */}
      <Route path="*" element={<NotFound />} />
    </Routes>
  );
};

export default SchoolRoutes;
