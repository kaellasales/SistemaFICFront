import { useState, useEffect } from 'react';
import { useCourseStore } from '@/features/courses/stores/useCourseStore';
import { Course } from '@/features/courses/course.types';
import toast from 'react-hot-toast';

export function useCoursesList() {
  // Pega a lista de cursos e a função de busca do nosso "cérebro" (Store)
  const { courses, fetchCourses } = useCourseStore();
  
  const [loading, setLoading] = useState(true);

  // O useEffect é o responsável por disparar a busca de dados
  useEffect(() => {
    const loadData = async () => {
      try {
        // Comanda a store para buscar os cursos da API
        await fetchCourses();
      } catch (error) {
        toast.error("Não foi possível carregar os cursos.");
      } finally {
        setLoading(false);
      }
    };
    
    loadData();
  }, [fetchCourses]); // A dependência garante que isso rode apenas uma vez

  // O hook retorna a lista de cursos e o estado de carregamento
  return {
    courses,
    loading,
  };
}