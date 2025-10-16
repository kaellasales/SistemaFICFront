import { useState, useEffect } from 'react';
import toast from 'react-hot-toast';
import { useAuthStore } from '@/shared/stores/authStore';
import { useEnrollmentStore } from '../stores/useEnrollmentStore';

export function useMyEnrollments() {
  const { user } = useAuthStore();
  
  // 1. Ele NÃO precisa do useParams.
  
  // 2. Ele pega as ferramentas específicas do ALUNO da store.
  const { 
    myEnrollments, 
    loading, 
    fetchMyEnrollments, 
  } = useEnrollmentStore();

  const [searchTerm, setSearchTerm] = useState('');
  
  useEffect(() => {
    const loadData = async () => {
      if (!user?.groups) return; 

      try {
        // 3. Ele chama a função que busca APENAS as inscrições do aluno logado.
        if (user.groups.includes('ALUNO')) {
          await fetchMyEnrollments();
        }
      } catch (error) {
        toast.error("Não foi possível carregar suas inscrições.");
      }
    };
    loadData();
  }, [user, fetchMyEnrollments]);

  // 4. A lógica de filtro é mais simples, só busca pelo nome do curso.
  const filteredEnrollments = myEnrollments.filter(enrollment =>
    (enrollment.curso?.nome || '').toLowerCase().includes(searchTerm.toLowerCase())
  );

  // 5. Ele retorna SÓ o que a página do aluno precisa.
  return {
    enrollments: filteredEnrollments,
    loading,
    searchTerm,
    setSearchTerm,
  };
}