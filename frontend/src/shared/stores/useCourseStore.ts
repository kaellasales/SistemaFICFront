import { create } from 'zustand';
import { cursoService } from '@/shared/services/curso.service';

interface CourseState {
  // Estados que você pode querer guardar, como a lista de cursos
  // courses: any[]; 
  
  // Ações que os componentes podem chamar
  createCourse: (payload: any, status: 'RASCUNHO' | 'PUBLICADO') => Promise<void>;
  updateCourse: (id: string, payload: any, status: 'RASCUNHO' | 'PUBLICADO') => Promise<void>;
  fetchCourse: (id: string) => Promise<any>;
}

export const useCourseStore = create<CourseState>((set) => ({
  // --- Ações ---
  
  createCourse: async (payload, status) => {
    // Adiciona o status ao payload antes de enviar
    const finalPayload = { ...payload, status };
    // Chama o "Mensageiro" para fazer a requisição
    await cursoService.create(finalPayload);
  },

  updateCourse: async (id, payload, status) => {
    const finalPayload = { ...payload, status };
    await cursoService.update(id, finalPayload);
  },

  fetchCourse: async (id) => {
    const response = await cursoService.getById(id);
    return response.data; // Retorna os dados do curso para o componente
  },
}));