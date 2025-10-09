import { useState, useEffect } from 'react';
import { useCourseStore } from '@/features/courses/stores/useCourseStore';
import { Course } from '@/features/courses/course.types';
import toast from 'react-hot-toast';

export function useMyCourses() {
  const { courses, fetchCourses } = useCourseStore();
  const [loading, setLoading] = useState(true);
  const [selectedCourse, setSelectedCourse] = useState<Course | null>(null);

  useEffect(() => {
    const loadData = async () => {
      try {
        await fetchCourses();
      } catch (error) {
        toast.error("Falha ao carregar seus cursos.");
      } finally {
        setLoading(false);
      }
    };
    loadData();
  }, [fetchCourses]);

  return {
    courses,
    loading,
    selectedCourse,
    setSelectedCourse,
  };
}