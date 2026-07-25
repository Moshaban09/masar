import { createBrowserRouter, RouterProvider, Navigate } from 'react-router-dom';
import { AppLayout } from './components/layout/AppLayout';
import { ProtectedRoute } from './components/routes/ProtectedRoute';
import { PublicRoute } from './components/routes/PublicRoute';

import { AuthLayout } from './pages/Auth/AuthLayout';
import { Login } from './pages/Auth/Login';
import { Signup } from './pages/Auth/Signup';
import { ForgotPassword } from './pages/Auth/ForgotPassword';
import { Dashboard } from './pages/Dashboard/Dashboard';
import { ProjectsList } from './pages/Projects/ProjectsList';
import { ProjectDetails } from './pages/Projects/ProjectDetails';
import { Tasks } from './pages/Tasks/Tasks';
import { Team } from './pages/Team/Team';
import { Calendar } from './pages/Calendar/Calendar';
import { Notifications } from './pages/Notifications/Notifications';
import { Settings } from './pages/Settings/Settings';
import { Toaster } from './components/ui/sonner';

const router = createBrowserRouter([
  {
    element: <PublicRoute />,
    children: [
      {
        element: <AuthLayout />,
        children: [
          { path: '/', element: <Login /> },
          { path: '/signup', element: <Signup /> },
          { path: '/forgot-password', element: <ForgotPassword /> },
        ]
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
            element: <Dashboard />,
          },
          {
            path: '/projects',
            element: <ProjectsList />,
          },
          {
            path: '/projects/:id',
            element: <ProjectDetails />,
          },
          {
            path: '/tasks',
            element: <Tasks />,
          },
          {
            path: '/team',
            element: <Team />,
          },
          {
            path: '/calendar',
            element: <Calendar />,
          },
          {
            path: '/notifications',
            element: <Notifications />,
          },
          {
            path: '/settings',
            element: <Settings />,
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
  return (
    <>
      <RouterProvider router={router} />
      <Toaster position="top-center" richColors />
    </>
  );
}
