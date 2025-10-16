import { create } from 'zustand';
import { professorService } from '../services/professor.service';
import { fromSnakeCase } from '@/shared/utils/caseConverter';
import { Professor } from '../types/professor.types';

interface ProfessorState {
  professors: Professor[];
  fetchProfessors: () => Promise<void>;
  clearProfessors: () => void;
  selectedProfessor: Professor | null;
  fetchProfessorById: (id: string) => Promise<void>; 
  createProfessor: (data: any) => Promise<any>;
  updateProfessor: (id: string, data: any) => Promise<any>; 
}

export const useProfessorStore = create<ProfessorState>((set) => ({
  selectedProfessor: null,
  professors: [],
  fetchProfessors: async () => {
    try {
      const response = await professorService.list();
      set({ professors: fromSnakeCase(response.data) });
    } catch (error) {
      console.error("Falha ao buscar professores.", error);
      throw error;
    }
  },
  fetchProfessorById: async (id) => {
    try {
      const response = await professorService.getById(id);
      const formattedProfessor = fromSnakeCase(response.data);
      set({ selectedProfessor: formattedProfessor });
      
      return formattedProfessor; 

    } catch (error) {
      console.error(`Falha ao buscar professor com id ${id}.`, error);
      set({ selectedProfessor: null });
      throw error;
    }
  },
  clearProfessors: () => set({ professors: [], selectedProfessor: null }),
    createProfessor: (data) => {
    return professorService.create(data);
  },

  updateProfessor: (id, data) => {
    return professorService.update(id, data);
  },
}));