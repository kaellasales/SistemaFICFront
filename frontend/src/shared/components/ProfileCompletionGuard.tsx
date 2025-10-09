import { useLocation, Navigate } from 'react-router-dom';
import { useAuthStore } from '@/shared/stores/authStore';

export function ProfileCompletionGuard({ children }: { children: React.ReactNode }) {
  const { user } = useAuthStore();
  const location = useLocation();

  const isAluno = user?.groups.includes('ALUNO');
  const isProfileComplete = user?.perfil_completo;
  const isTryingToCompleteProfile = location.pathname === '/aluno/complete-profile';

  if (isAluno && !isProfileComplete && !isTryingToCompleteProfile) {
    return <Navigate to="/aluno/complete-profile" state={{ from: location }} replace />;
  }

  return <>{children}</>;
}