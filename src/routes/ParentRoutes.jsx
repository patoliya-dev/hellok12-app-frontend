import { Routes, Route } from "react-router-dom";
import ParentDashboard from "../pages/parent/dashboard";
import NotFound from "../pages/NotFound";
import ProfileAccountSettings from "../pages/student-parent/profile-settings";

const ParentRoutes = () => {
  return (
    <Routes>
      <Route path="/dashboard" element={<ParentDashboard />} />

      {/* Catch-all */}
      <Route path="*" element={<NotFound />} />
      <Route path="/profile-settings" element={<ProfileAccountSettings />} />
    </Routes>
  );
};

export default ParentRoutes;
