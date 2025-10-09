import { create } from 'zustand';
import { cursoService } from '@/features/courses/services/cursosService';
import { fromSnakeCase } from '@/shared/utils/caseConverter';
import { Course } from '@/features/courses/types/course.types';

interface CourseState {
  courses: Course[];
  fetchCourses: () => Promise<void>;
  createCourse: (payload: any) => Promise<any>;
  updateCourse: (id: string, payload: any) => Promise<any>;
  fetchCourse: (id: string) => Promise<any>;
}

export const useCourseStore = create<CourseState>((set) => ({
  courses: [],

  fetchCourses: async () => {
    try {
      const response = await cursoService.list();
      const formattedCourses: Course[] = fromSnakeCase(response.data);
      set({ courses: formattedCourses });
    } catch (error) {
      console.error("Erro ao buscar cursos na store:", error);
      throw error;
    }
  },

  createCourse: (payload) => {
    return cursoService.create(payload);
  },

  updateCourse: (id, payload) => {
    return cursoService.update(id, payload);
  },

  fetchCourse: (id) => {
    // A conversão de snake_case será feita no hook que consome isso
    return cursoService.getById(id).then(res => res.data);
  },
}));