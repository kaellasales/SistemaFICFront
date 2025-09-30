import { Navigate, useLocation } from 'react-router-dom'
import { useAuthStore } from '@/shared/stores/authStore'

interface ProtectedRouteProps {
  children: React.ReactNode
}

export function ProtectedRoute({ children }: ProtectedRouteProps) {
  const { isAuthenticated } = useAuthStore()
  const location = useLocation()

  if (!isAuthenticated) {
    // Redirecionar para login, mantendo a rota atual para redirecionamento posterior
    return <Navigate to="/login" state={{ from: location }} replace />
  }

  return <>{children}</>
}

