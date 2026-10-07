import { Outlet } from 'react-router-dom'
import { useAuth } from '@/context/AuthContext'

export default function PublicOnlyLayout() {
  const { session, loading } = useAuth()
  if (loading) return <div className="route-loading"><span className="spinner" aria-label="Chargement" /></div>
  return session ? <Navigate to="/" replace /> : <Outlet />
}
