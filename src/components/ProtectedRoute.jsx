import { Navigate, Outlet } from "react-router-dom";
import { useSelector } from "react-redux";
import { selectAuthUser } from "reducers/auth/authSelectors";
import { DEFAULT_ROUTES } from "../utils/constant";
import useAutoSelectChild from "../hooks/useAutoSelectChild";

export default function ProtectedRoute({ allowedRoles }) {
  const currentUser = useSelector(selectAuthUser);

  if (!currentUser) {
    return <Navigate to="/login" replace />;
  }

  const isAuthorized = allowedRoles.includes(currentUser.role);
  useAutoSelectChild();

  // If authorized, the <Outlet> will render the matching child route.
  // Otherwise, we redirect.
  return isAuthorized ? (
    <Outlet />
  ) : (
    <Navigate to={DEFAULT_ROUTES[currentUser.role] || "/"} replace />
  );
}
