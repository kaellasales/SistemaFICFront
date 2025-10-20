import { useState, useEffect } from 'react';
import { useParams } from 'react-router-dom';
import toast from 'react-hot-toast';
import { useEnrollmentStore } from '../stores/useEnrollmentStore';
import { useCourseStore } from '@/features/courses/stores/useCourseStore';
import { Course } from '@/features/courses/types/course.types';

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
    const actionPromise = validateEnrollment(enrollmentId, isApproved, reason);
    
    toast.promise(actionPromise, {
        loading: 'Atualizando status...',
        success: 'Status atualizado com sucesso!',
        error: 'Falha ao atualizar status.',
    });
  };

  const filteredEnrollments = courseEnrollments.filter(enrollment => {
    const vagaMatch = vagaFilter === 'all' || enrollment.tipoVaga === vagaFilter;
    const statusMatch = statusFilter === 'all' || enrollment.status === statusFilter;
    return vagaMatch && statusMatch;
  });

  return {
    course: selectedCourse,
    enrollments: filteredEnrollments,
    courseEnrollments,
    loading: enrollmentsLoading || !selectedCourse,
    statusFilter,
    setStatusFilter,
    vagaFilter,
    setVagaFilter,
    handleStatusChange,
  };
}