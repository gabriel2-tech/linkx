import { Navigate, Outlet, useLocation } from 'react-router-dom'
import { useAuth } from '@/context/AuthContext'

export default function ProtectedLayout() {
  const { session, loading } = useAuth()
  const location = useLocation()
  if (loading) return <div className="route-loading"><span className="spinner" aria-label="Chargement" /></div>
  if (!session) return <Navigate to="/login" replace state={{ from: location }} />
  return <Outlet />
}
