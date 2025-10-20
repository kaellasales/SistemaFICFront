import { useState, useEffect } from 'react';
import { useAuthStore } from '@/shared/stores/authStore';
import { useAlunoStore } from '@/features/alunos/stores/useAlunoStore';
import { useProfessorStore } from '@/features/professores/stores/useProfessorStore';
import toast from 'react-hot-toast';
import { fromSnakeCase } from '@/shared/utils/caseConverter'; // <<< O TRADUTOR

export function useUserProfile() {
  const { user } = useAuthStore();
  const { fetchProfile: fetchAlunoProfile } = useAlunoStore();
  const { fetchProfile: fetchProfessorProfile } = useProfessorStore(); // (Lembre-se de criar esta função na store do professor)

  const [profileData, setProfileData] = useState<any>(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const loadProfile = async () => {
      if (!user?.groups) return;
      
      try {
        let rawData; 
        if (user.groups.includes('ALUNO')) {
          rawData = await fetchAlunoProfile();
        } else if (user.groups.includes('PROFESSOR')) {
          rawData = await fetchProfessorProfile();
        } else {
          rawData = { user: fromSnakeCase(user) }; 
        }
        
        setProfileData(fromSnakeCase(rawData));

      } catch (error) {
        toast.error("Não foi possível carregar os dados do seu perfil.");
      } finally {
        setLoading(false);
      }
    };
    loadProfile();
  }, [user, fetchAlunoProfile, fetchProfessorProfile]);

  return { profileData, loading, userGroups: user?.groups || [] };
}