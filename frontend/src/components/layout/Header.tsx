import { LogOut, Bell, User } from 'lucide-react'
import { useAuthStore } from '@/shared/stores/authStore'
import { Button } from '@/components/ui/Button'
import { Logo } from '@/components/ui/Logo'

export function Header() {
  const { user, logout } = useAuthStore()

  const handleLogout = () => {
    logout()
  }

  const getRoleLabel = (role: string) => {
    switch (role) {
      case 'candidate':
        return 'Candidato'
      case 'professor':
        return 'Professor'
      case 'admin':
        return 'Administrador'
      default:
        return role
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
                {user?.name}
              </p>
              <p className="text-xs text-secondary-600">
                {getRoleLabel(user?.role || '')}
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
