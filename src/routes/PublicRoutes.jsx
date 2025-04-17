import { Navigate } from 'react-router-dom';
import useAuthStore from '../stores/authStore';

const PublicRoute = ({ children }) => {
  const isLoggedIn = useAuthStore((state) => state.isLoggedIn);

  if (isLoggedIn) {
    return <Navigate to="/dashboard" replace />;
  }

  return children;
};

export default PublicRoute;
