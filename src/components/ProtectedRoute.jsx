import { selectAuthToken } from 'features/auth/authSelectors';
import { useSelector } from 'react-redux';
import { Navigate } from 'react-router-dom';

export default function ProtectedRoute({ children }) {
  const accessToken = useSelector(selectAuthToken);
  return accessToken ? children : <Navigate to="/login" replace />;
}
