import { useEffect } from "react";
import { Navigate, useNavigate } from "react-router-dom";
import { useSelector } from "react-redux";
import { selectAuthUser } from "features/auth/authSelectors";
import { DEFAULT_ROUTES } from "../utils/constant";

export default function ProtectedRoute({ children, allowedRoles }) {
  const currentUser = useSelector(selectAuthUser);
  const navigate = useNavigate();

  if (!currentUser) {
    return <Navigate to="/login" replace />;
  }

  if (!allowedRoles.includes(currentUser.role)) {
    useEffect(() => {
      if (window.history.length > 1) {
        navigate(-1);
      } else {
        navigate(
          DEFAULT_ROUTES[currentUser.role] || "/student-parent/dashboard",
          { replace: true }
        );
      }
    }, [navigate, currentUser.role]);

    return null;
  }

  return children;
}
