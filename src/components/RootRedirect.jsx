import { selectAuthUser } from "features/auth/authSelectors";
import { useSelector } from "react-redux";
import { Navigate } from "react-router-dom";
import { DEFAULT_ROUTES } from "../utils/constant";

const RootRedirect = () => {
  const currentUser = useSelector(selectAuthUser);

  if (currentUser) {
    return <Navigate to={DEFAULT_ROUTES[currentUser.role]} replace />;
  } else {
    return <Navigate to="/login" replace />;
  }
};

export default RootRedirect;
