import React from "react";
import { BrowserRouter, Routes as RouterRoutes, Route, Navigate } from "react-router-dom";
import ScrollToTop from "./components/ScrollToTop";
import ErrorBoundary from "./components/ErrorBoundary";
// Add your imports here
import Login from "./pages/login";
import UserRegistration from "./pages/user-registration";
import PasswordReset from "./pages/password-reset";
import ParentDashboard from "./pages/parent-dashboard";
import TeacherDashboard from "./pages/teacher-dashboard";
import StudentDashboard from "./pages/student-dashboard";
import NotFound from "./pages/NotFound";
import ProtectedRoute from "components/ProtectedRoute";

const Routes = () => {
  return (
    <BrowserRouter>
      <ErrorBoundary>
      <ScrollToTop />
      <RouterRoutes>
        {/* Define your routes here */}
        <Route path="/" element={<Navigate to="/login" replace />} />
        <Route path="/login" element={<Login />} />
        <Route path="/user-registration" element={<UserRegistration />} />
        <Route path="/password-reset" element={<PasswordReset />} />
        <Route path="/parent-dashboard" element={<ProtectedRoute><ParentDashboard /></ProtectedRoute>} />
        <Route path="/teacher-dashboard" element={<ProtectedRoute><TeacherDashboard /></ProtectedRoute>} />
        <Route path="/student-dashboard" element={<ProtectedRoute><StudentDashboard /></ProtectedRoute>} />
        <Route path="*" element={<NotFound />} />
      </RouterRoutes>
      </ErrorBoundary>
    </BrowserRouter>
  );
};

export default Routes;