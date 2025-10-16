import { create } from 'zustand';
import { alunoService } from '../services/aluno.service';
import { fromSnakeCase } from '@/shared/utils/caseConverter';
import { Aluno } from '../types/aluno.types';

interface AlunoState {
  selectedAlunoProfile: Aluno | null; 
  fetchProfile: () => Promise<any>;
  saveProfile: (payload: any) => Promise<any>;
  fetchAlunoById: (alunoId: number) => Promise<Aluno>; 
}

export const useAlunoStore = create<AlunoState>((set) => ({
  selectedAlunoProfile: null, 

  fetchProfile: async () => {
    const response = await alunoService.getProfile();
    return response.data;
  },

  saveProfile: async (payload) => {
    return alunoService.saveProfile(payload);
  },

  fetchAlunoById: async (alunoId) => {
    try {
      const response = await alunoService.getById(alunoId);
      const formattedProfile = fromSnakeCase(response.data);
      // Guarda o perfil completo na "gaveta" da store
      set({ selectedAlunoProfile: formattedProfile });
      return formattedProfile;
    } catch (error) {
      console.error("Falha ao buscar perfil detalhado do aluno.", error);
      set({ selectedAlunoProfile: null });
      throw error;
    }
  },
}));