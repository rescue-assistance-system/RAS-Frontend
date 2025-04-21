import { Navigate } from 'react-router-dom';
import useAuthStore from '../stores/authStore';

const ProtectedRoute = ({ children }) => {
  const isLoggedIn = useAuthStore((state) => state.isLoggedIn);

  if (!isLoggedIn) {
    return <Navigate to="/login" replace />;
  }

  return children;
};

export default ProtectedRoute;
