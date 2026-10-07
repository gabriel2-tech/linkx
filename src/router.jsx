import { Navigate, Outlet, createBrowserRouter, useLocation } from 'react-router-dom'
import { useAuth } from '@/context/AuthContext'
import AppLayout from '@/layouts/AppLayout'
import RootLayout from '@/layouts/RootLayout'
import PublicOnlyLayout from '@/layouts/PublicOnlyLayout'
import ProtectedLayout from '@/layouts/ProtectedLayout'
import Login from '@/pages/Login'
import Signup from '@/pages/Signup'
import ForgotPassword from '@/pages/ForgotPassword'
import ResetPassword from '@/pages/ResetPassword'
import Home from '@/pages/Home'
import Profile from '@/pages/Profile'
import Friends from '@/pages/Friends'
import NotFound from '@/pages/NotFound'
import ErrorPage from '@/pages/ErrorPage'

function LoadingScreen() {
  return <div className="route-loading"><span className="spinner" aria-label="Chargement" /></div>
}

export function PublicGuard() {
  const { session, loading } = useAuth()
  if (loading) return <LoadingScreen />
  return session ? <Navigate to="/" replace /> : <Outlet />
}

export function ProtectedGuard() {
  const { session, loading } = useAuth()
  const location = useLocation()
  if (loading) return <LoadingScreen />
  if (!session) return <Navigate to="/login" replace state={{ from: location }} />
  return <Outlet />
}

export const router = createBrowserRouter([
  {
    element: <RootLayout />,
    errorElement: <ErrorPage />,
    children: [
      {
        element: <PublicOnlyLayout />,
        children: [
          { path: '/login', element: <Login /> },
          { path: '/signup', element: <Signup /> },
        ],
      },
      { path: '/forgot-password', element: <ForgotPassword /> },
      { path: '/reset-password', element: <ResetPassword /> },
      {
        element: <ProtectedLayout />,
        children: [
          {
            element: <AppLayout />,
            children: [
              { index: true, element: <Home /> },
              { path: 'profile', element: <Profile /> },
              { path: 'friends', element: <Friends /> },
            ],
          },
        ],
      },
      { path: '*', element: <NotFound /> },
    ],
  },
])
