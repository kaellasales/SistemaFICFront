import { LogOut, Bell, User } from 'lucide-react'
import { useNavigate, useLocation, Link } from 'react-router-dom'
import { useAuthStore } from '@/shared/stores/authStore'
import { Button } from '@/components/ui/Button'
import { Logo } from '@/components/ui/Logo'
import { authService } from '@/shared/services/authService'

export function Header() {
  const { user, logout } = useAuthStore()
  const navigate = useNavigate()

  const handleLogout = async () => {
    try {
      await authService.logout() 
    } catch (error) {
      console.error('Erro ao deslogar:', error)
    } finally {
      logout() // Limpa Zustand store
      navigate('/login') // Redireciona para a página de login
    }
}

  return (
    <header className="bg-white border-b border-secondary-200 px-6 py-4">
      <div className="flex items-center justify-between">
        <div className="flex items-center space-x-4">
          <Logo size="md" showText={true} />
          <span className="text-sm text-secondary-600">
            Sistema de Inscrição em Cursos FIC
          </span>
        </div>

        <div className="flex items-center space-x-4">
          {/* Notificações */}
          <Button variant="ghost" size="sm">
            <Bell className="h-5 w-5" />
          </Button>

          {/* Perfil do usuário */}
          <div className="flex items-center space-x-3">
            <div className="text-right">
              <p className="text-sm font-medium text-secondary-900">
                {user?.email}
              </p>
            </div>
            <div className="h-8 w-8 rounded-full bg-primary-100 flex items-center justify-center">
              <User className="h-4 w-4 text-primary-600" />
            </div>
            <Button variant="ghost" size="sm" onClick={handleLogout}>
              <LogOut className="h-4 w-4" />
            </Button>
          </div>
        </div>
      </div>
    </header>
  )
}
