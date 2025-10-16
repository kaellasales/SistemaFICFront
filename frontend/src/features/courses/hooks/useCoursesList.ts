import { useState, useEffect, useMemo } from 'react';
import { useCourseStore } from '@/features/courses/stores/useCourseStore';
import { useEnrollmentStore } from '@/features/enrollments/stores/useEnrollmentStore';
import toast from 'react-hot-toast';
import { Course } from '@/features/courses/types/course.types';

// O "molde" para o nosso objeto de curso "enriquecido"
export type EnrichedCourse = Course & { isEnrolled: boolean };

export function useCoursesList() {
  // 1. Pega as ferramentas das duas stores
  const { courses, fetchCourses } = useCourseStore();
  const { myEnrollments, fetchMyEnrollments } = useEnrollmentStore();
  
  const [loading, setLoading] = useState(true);

  // 2. Busca todos os dados necessários quando a página carrega
  useEffect(() => {
    const loadAllData = async () => {
      try {
        await Promise.all([
          fetchCourses(),
          fetchMyEnrollments()
        ]);
      } catch (error) {
        toast.error("Não foi possível carregar os cursos.");
      } finally {
        setLoading(false);
      }
    };
    
    loadAllData();
  }, [fetchCourses, fetchMyEnrollments]);

  // 3. Cruza os dados de forma eficiente para criar a lista "enriquecida"
  const enrichedCourses: EnrichedCourse[] = useMemo(() => {
    const enrolledCourseIds = new Set(myEnrollments.map(enrollment => enrollment.curso.id));

    return courses.map(course => ({
      ...course,
      isEnrolled: enrolledCourseIds.has(course.id),
    }));
  }, [courses, myEnrollments]);

  // 4. Entrega a lista final e o estado de loading para a página
  return {
    courses: enrichedCourses,
    loading,
  };
}