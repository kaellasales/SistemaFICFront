import { useState, useEffect } from 'react';
import { useParams } from 'react-router-dom';
import toast from 'react-hot-toast';
import { useEnrollmentStore } from '../stores/useEnrollmentStore';
import { useCourseStore } from '@/features/courses/stores/useCourseStore';
import { Course } from '@/features/courses/types/course.types';

// Define os tipos de filtro que a página vai usar
type StatusFilter = 'all' | 'AGUARDANDO_VALIDACAO' | 'CONFIRMADA' | 'CANCELADA';
type VagaFilter = 'all' | 'INTERNO' | 'EXTERNO';

export function useCourseEnrollments() {
  const { courseId } = useParams<{ courseId: string }>();
  
  const { 
    courseEnrollments, 
    loading: enrollmentsLoading, 
    fetchEnrollmentsByCourse, 
    validateEnrollment 
  } = useEnrollmentStore();
  
  const { selectedCourse, fetchCourseById } = useCourseStore();
  
  // Estados para controlar os filtros selecionados
  const [statusFilter, setStatusFilter] = useState<StatusFilter>('all');
  const [vagaFilter, setVagaFilter] = useState<VagaFilter>('all');

  useEffect(() => {
    if (courseId) {
      Promise.all([
        fetchEnrollmentsByCourse(courseId),
        fetchCourseById(courseId)
      ]).catch(() => toast.error("Falha ao carregar dados da página."));
    }
  }, [courseId, fetchEnrollmentsByCourse, fetchCourseById]);

  const handleStatusChange = (enrollmentId: number, isApproved: boolean, reason?: string) => {
    let actionPromise;

    if (isApproved) {
        actionPromise = validateEnrollment(enrollmentId, true);
    } else {
        // Se for uma recusa, o 'reason' agora vem como parâmetro
        actionPromise = validateEnrollment(enrollmentId, false, reason);
    }
    
    // O toast.promise continua perfeito para dar o feedback
    toast.promise(actionPromise, {
        loading: 'Atualizando status...',
        success: 'Status atualizado com sucesso!',
        error: 'Falha ao atualizar status.',
    });
  };

  // Lógica de filtro com duas camadas
  const filteredEnrollments = courseEnrollments.filter(enrollment => {
    const vagaMatch = vagaFilter === 'all' || enrollment.tipoVaga === vagaFilter;
    const statusMatch = statusFilter === 'all' || enrollment.status === statusFilter;
    return vagaMatch && statusMatch;
  });

  // --- O RETURN COMPLETO ---
  return {
    course: selectedCourse,
    enrollments: filteredEnrollments, // A lista já filtrada
    courseEnrollments, // A lista original, para as contagens
    loading: enrollmentsLoading || !selectedCourse,
    statusFilter,
    setStatusFilter,
    vagaFilter,
    setVagaFilter,
    handleStatusChange,
  };
}