import { Navigate, Outlet } from "react-router-dom";
import { useSelector } from "react-redux";
import { selectAuthUser } from "features/auth/authSelectors";
import { DEFAULT_ROUTES } from "../utils/constant";

export default function ProtectedRoute({ allowedRoles }) {
  const currentUser = useSelector(selectAuthUser);

  if (!currentUser) {
    return <Navigate to="/login" replace />;
  }

  const isAuthorized = allowedRoles.includes(currentUser.role);

  // If authorized, the <Outlet> will render the matching child route.
  // Otherwise, we redirect.
  return isAuthorized ? <Outlet /> : <Navigate to={DEFAULT_ROUTES[currentUser.role] || "/"} replace />;
}
