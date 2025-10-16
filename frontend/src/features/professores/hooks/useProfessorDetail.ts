import { useState, useEffect } from 'react';
import { useParams } from 'react-router-dom';
import { useProfessorStore } from '../stores/useProfessorStore';
import toast from 'react-hot-toast';

export function useProfessorDetail() {
  const { id } = useParams<{ id: string }>();
  
  const { selectedProfessor, fetchProfessorById } = useProfessorStore();
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    if (id) {
      setLoading(true);
      fetchProfessorById(id)
        .catch(() => toast.error("Não foi possível carregar os dados do professor."))
        .finally(() => setLoading(false));
    }
  }, [id, fetchProfessorById]);

  return {
    professor: selectedProfessor,
    loading,
  };
}