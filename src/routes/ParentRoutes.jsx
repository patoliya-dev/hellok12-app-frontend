import { Routes, Route } from "react-router-dom";
import ParentDashboard from "../pages/parent/dashboard";
import NotFound from "../pages/NotFound";

const ParentRoutes = () => {
  return (
    <Routes>
      <Route path="/dashboard" element={<ParentDashboard />} />

      {/* Catch-all */}
      <Route path="*" element={<NotFound />} />
    </Routes>
  );
};

export default ParentRoutes;
