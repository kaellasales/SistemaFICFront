import { Bell } from 'lucide-react';
import { useNavigate } from 'react-router-dom';
import { Button } from '@/components/ui/Button'; 
import { Logo } from '@/components/ui/Logo'; 
import { UserProfile } from './UserProfile'; 

export function Header() {
  const navigate = useNavigate();

  // <<< 2. O 'handleLogout' e o 'user' não são mais necessários aqui >>>
  // A lógica agora mora dentro do UserProfile.

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
          <Button variant="ghost" size="icon" className="rounded-full">
            <Bell className="h-5 w-5" />
          </Button>
          <UserProfile />

        </div>
      </div>
    </header>
  );
}