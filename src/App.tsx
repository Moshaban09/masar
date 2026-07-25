import { lazy, Suspense } from 'react';
import { createBrowserRouter, RouterProvider } from 'react-router-dom';
import { AppLayout } from './components/layout/AppLayout';
import { ProtectedRoute } from './components/routes/ProtectedRoute';
import { PublicRoute } from './components/routes/PublicRoute';
import { Toaster } from './components/ui/sonner';

// Lazy loaded routes (Code Splitting)
const AuthLayout = lazy(() => import('./pages/Auth/AuthLayout').then(m => ({ default: m.AuthLayout })));
const Login = lazy(() => import('./pages/Auth/Login').then(m => ({ default: m.Login })));
const Signup = lazy(() => import('./pages/Auth/Signup').then(m => ({ default: m.Signup })));
const ForgotPassword = lazy(() => import('./pages/Auth/ForgotPassword').then(m => ({ default: m.ForgotPassword })));

const Dashboard = lazy(() => import('./pages/Dashboard/Dashboard').then(m => ({ default: m.Dashboard })));
const ProjectsList = lazy(() => import('./pages/Projects/ProjectsList').then(m => ({ default: m.ProjectsList })));
const ProjectDetails = lazy(() => import('./pages/Projects/ProjectDetails').then(m => ({ default: m.ProjectDetails })));
const Tasks = lazy(() => import('./pages/Tasks/Tasks').then(m => ({ default: m.Tasks })));
const Team = lazy(() => import('./pages/Team/Team').then(m => ({ default: m.Team })));
const Calendar = lazy(() => import('./pages/Calendar/Calendar').then(m => ({ default: m.Calendar })));
const Notifications = lazy(() => import('./pages/Notifications/Notifications').then(m => ({ default: m.Notifications })));
const Settings = lazy(() => import('./pages/Settings/Settings').then(m => ({ default: m.Settings })));
const NotFound = lazy(() => import('./pages/NotFound/NotFound').then(m => ({ default: m.NotFound })));

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
          { path: '/dashboard', element: <Dashboard /> },
          { path: '/projects', element: <ProjectsList /> },
          { path: '/projects/:id', element: <ProjectDetails /> },
          { path: '/tasks', element: <Tasks /> },
          { path: '/team', element: <Team /> },
          { path: '/calendar', element: <Calendar /> },
          { path: '/notifications', element: <Notifications /> },
          { path: '/settings', element: <Settings /> },
        ],
      },
    ],
  },
  {
    path: '*',
    element: <NotFound />,
  },
]);

const PageFallback = () => (
  <div className="flex h-screen w-full items-center justify-center bg-slate-50">
    <div className="w-8 h-8 border-4 border-slate-200 border-t-[var(--primary)] rounded-full animate-spin"></div>
  </div>
);

export default function App() {
  return (
    <>
      <Suspense fallback={<PageFallback />}>
        <RouterProvider router={router} />
      </Suspense>
      <Toaster position="top-center" richColors />
    </>
  );
}
