import React from "react";
import {
  BrowserRouter as Router,
  Routes as RouterRoutes,
  Route,
  Navigate,
} from "react-router-dom";
import ScrollToTop from "./components/ScrollToTop";
import ErrorBoundary from "./components/ErrorBoundary";
import Login from "./pages/auth/login";
import UserRegistration from "./pages/auth/user-registration";
import PasswordReset from "./pages/auth/password-reset";
import NotFound from "./pages/NotFound";
import ProtectedRoute from "./components/ProtectedRoute";
import VerifyEmailPage from "./pages/auth/user-registration/components/VerifyEmailPage";
import StudentRoutes from "./routes/StudentRoutes";
import TeacherRoutes from "./routes/TeacherRoutes";
import SchoolRoutes from "./routes/SchoolRoutes";

const Protected = ({ children }) => <ProtectedRoute>{children}</ProtectedRoute>;

// 🔹 Public routes
const publicRoutes = [
  { path: "/login", element: <Login /> },
  { path: "/user-registration", element: <UserRegistration /> },
  { path: "/verify-email", element: <VerifyEmailPage /> },
  { path: "/password-reset", element: <PasswordReset /> },
];

// 🔹 Protected routes
const protectedRoutes = [
  { path: "/teacher/*", element: <TeacherRoutes /> },
  { path: "/student-parent/*", element: <StudentRoutes /> },
  { path: "/school/*", element: <SchoolRoutes /> },
];

const Routes = () => {
  return (
    <Router>
      <ErrorBoundary>
        <ScrollToTop />
        <RouterRoutes>
          {/* Redirect root to /login */}
          <Route path="/" element={<Navigate to="/login" replace />} />

          {/* Public routes */}
          {publicRoutes.map(({ path, element }) => (
            <Route key={path} path={path} element={element} />
          ))}

          {/* Protected routes */}
          {protectedRoutes.map(({ path, element }) => (
            <Route
              key={path}
              path={path}
              element={<Protected>{element}</Protected>}
            />
          ))}

          {/* Catch-all */}
          <Route path="*" element={<NotFound />} />
        </RouterRoutes>
      </ErrorBoundary>
    </Router>
  );
};

export default Routes;
