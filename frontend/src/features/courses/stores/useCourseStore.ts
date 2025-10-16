import { create } from 'zustand';
import { cursoService } from '@/features/courses/services/cursosService';
import { fromSnakeCase } from '@/shared/utils/caseConverter';
import { Course } from '@/features/courses/types/course.types';

interface CourseState {
  courses: Course[];
  selectedCourse: Course | null; 
  fetchCourses: () => Promise<void>;
  createCourse: (payload: any) => Promise<any>;
  updateCourse: (id: string, payload: any) => Promise<any>;
  fetchCourseById: (id: string) => Promise<void>; 
  clearCourses: () => void;
  updateCourse: (id: string, data: any) => Promise<any>;
  deleteCourse: (id: number) => Promise<void>; 
}

export const useCourseStore = create<CourseState>((set) => ({
  courses: [],
  selectedCourse: null, // <<< INICIALIZA O COMPARTIMENTO COMO VAZIO

  clearCourses: () => {
    set({ courses: [], selectedCourse: null }); // Limpa tudo
  },

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

  updateCourse: (id, data) => {
    return cursoService.update(id, data);
  },

  fetchCourseById: async (id: string) => {
    try {
      const response = await cursoService.getById(id);
      const course = fromSnakeCase(response.data);
      set({ selectedCourse: course });
      return course;
    } catch (error) {
      console.error(`Falha ao buscar curso com id ${id}.`, error);
      set({ selectedCourse: null });
      throw error;
    }
  },
  deleteCourse: async (id) => {
    await cursoService.deleteCourse(id);
    // Remove o curso da lista na memória para a UI atualizar na hora
    set((state) => ({
      courses: state.courses.filter((course) => course.id !== id),
    }));
  },
}));