import { useState, useEffect } from 'react';
import { useProfessorStore } from '../stores/useProfessorStore';
import toast from 'react-hot-toast';

export function useProfessorsList() {
  const { professors, fetchProfessors } = useProfessorStore();
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    fetchProfessors()
      .catch(() => toast.error("Não foi possível carregar a lista de professores."))
      .finally(() => setLoading(false));
  }, [fetchProfessors]);

  return {
    professors,
    loading,
  };
}