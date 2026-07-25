import { Navigate, Outlet } from 'react-router-dom';
import { useAuth } from '../../store/useAuth';

export function PublicRoute() {
  const isAuthenticated = useAuth((state) => state.isAuthenticated);

  if (isAuthenticated) {
    return <Navigate to="/dashboard" replace />;
  }

  return <Outlet />;
}
