import { Routes, Route } from "react-router-dom";
import SchoolDashboard from "../pages/school/dashboard";
import NotFound from "../pages/NotFound";

const SchoolRoutes = () => {
  return (
    <Routes>
      <Route path="/dashboard" element={<SchoolDashboard />} />

      {/* Catch-all */}
      <Route path="*" element={<NotFound />} />
    </Routes>
  );
};

export default SchoolRoutes;
