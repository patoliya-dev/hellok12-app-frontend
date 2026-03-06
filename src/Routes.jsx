import React from "react";
import {
  BrowserRouter as Router,
  Routes as RouterRoutes,
  Route,
} from "react-router-dom";

import ScrollToTop from "./components/ScrollToTop";
import ErrorBoundary from "./components/ErrorBoundary";

import Login from "./pages/auth/login";
import UserRegistration from "./pages/auth/user-registration";
import PasswordReset from "./pages/auth/password-reset";
import VerifyEmailPage from "./pages/auth/user-registration/components/VerifyEmailPage";
import AcceptInvitation from "./pages/auth/accept-invitation";

import NotFound from "./pages/NotFound";
import RootRedirect from "components/RootRedirect";

import ProtectedRoute from "./components/ProtectedRoute";
import StudentParentRoutes from "./routes/StudentParentRoutes";
import TeacherRoutes from "./routes/TeacherRoutes";
import SchoolRoutes from "./routes/SchoolRoutes";

const Routes = () => {
  return (
    <Router>
      <ErrorBoundary>
        <ScrollToTop />
        <RouterRoutes>
          {/* Root and Public Routes */}
          <Route path="/" element={<RootRedirect />} />
          <Route path="/login" element={<Login />} />
          <Route path="/user-registration" element={<UserRegistration />} />
          <Route path="/verify-email" element={<VerifyEmailPage />} />
          <Route path="/password-reset" element={<PasswordReset />} />
          <Route path="/accept-invitation" element={<AcceptInvitation />} />

          {/* Protected Routes - grouped by role */}
          <Route element={<ProtectedRoute allowedRoles={["teacher"]} />}>
            <Route path="/teacher/*" element={<TeacherRoutes />} />
          </Route>

          <Route element={<ProtectedRoute allowedRoles={["student"]} />}>
            <Route path="/student/*" element={<StudentParentRoutes />} />
          </Route>

          <Route element={<ProtectedRoute allowedRoles={["parent"]} />}>
            <Route path="/parent/*" element={<StudentParentRoutes />} />
          </Route>

          <Route element={<ProtectedRoute allowedRoles={["admin", "school"]} />}>
            <Route path="/school/*" element={<SchoolRoutes />} />
          </Route>

          {/* Catch-all */}
          <Route path="*" element={<NotFound />} />
        </RouterRoutes>
      </ErrorBoundary>
    </Router>
  );
};

export default Routes;
