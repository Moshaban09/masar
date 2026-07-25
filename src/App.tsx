import { createBrowserRouter, RouterProvider, Navigate } from 'react-router-dom';
import { AppLayout } from './components/layout/AppLayout';
import { ProtectedRoute } from './components/routes/ProtectedRoute';
import { PublicRoute } from './components/routes/PublicRoute';

// We will import pages here as we build them
// import { Login } from './pages/Auth/Login';
// import { Dashboard } from './pages/Dashboard/Dashboard';

const router = createBrowserRouter([
  {
    element: <PublicRoute />,
    children: [
      {
        path: '/',
        element: <div className="p-8">Login Page (Coming in Phase 3)</div>,
      },
    ],
  },
  {
    element: <ProtectedRoute />,
    children: [
      {
        element: <AppLayout />,
        children: [
          {
            path: '/dashboard',
            element: <div className="p-8">Dashboard Page (Coming later)</div>,
          },
          {
            path: '/projects',
            element: <div className="p-8">Projects Page</div>,
          },
          {
            path: '/tasks',
            element: <div className="p-8">Tasks Page</div>,
          },
          {
            path: '/team',
            element: <div className="p-8">Team Page</div>,
          },
          {
            path: '/calendar',
            element: <div className="p-8">Calendar Page</div>,
          },
          {
            path: '/notifications',
            element: <div className="p-8">Notifications Page</div>,
          },
          {
            path: '/settings',
            element: <div className="p-8">Settings Page</div>,
          },
        ],
      },
    ],
  },
  {
    path: '*',
    element: <Navigate to="/" replace />,
  },
]);

export default function App() {
  return <RouterProvider router={router} />;
}
