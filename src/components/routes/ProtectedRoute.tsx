import { Navigate, Outlet } from 'react-router-dom';
import { useAuth } from '../../store/useAuth';

export function ProtectedRoute() {
  const isAuthenticated = useAuth((state) => state.isAuthenticated);

  if (!isAuthenticated) {
    return <Navigate to="/login" replace />;
  }

  return <Outlet />;
}
