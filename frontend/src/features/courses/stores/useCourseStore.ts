import { create } from 'zustand';
import { cursoService } from '@/features/courses/services/cursosService';
import { CourseFormData } from '@/hooks/useCourseForm'; 


const initialFormData: CourseFormData = {
  nome: '',
  descricao: '',
  descricaoCurta: '',
  cargaHoraria: 0,
  vagasInternas: 0,
  vagasExternas: 0,
  dataInicioInscricoes: '',
  dataFimInscricoes: '',
  dataInicioCurso: '',
  dataFimCurso: '',
  requisitos: '',
};

interface CourseState {
  // O estado que guarda o formulário atual
  formData: CourseFormData;

  // Uma ação para iniciar ou limpar o formulário
  initializeForm: () => void;

  // Suas ações existentes
  createCourse: (payload: any) => Promise<any>;
  updateCourse: (id: string, payload: any) => Promise<any>;
  fetchCourse: (id: string) => Promise<any>;
}

export const useCourseStore = create<CourseState>((set) => ({
  formData: initialFormData,

  initializeForm: () => {
    // Ação para resetar o formulário para o estado inicial
    set({ formData: initialFormData });
  },
  
  // Suas outras ações (create, update, fetch) continuam iguais...
  createCourse: async (payload) => {
    return cursoService.create(payload);
  },
  updateCourse: async (id, payload) => {
    return cursoService.update(id, payload);
  },
  fetchCourse: async (id) => {
    const response = await cursoService.getById(id);
    return response.data;
  },
}));