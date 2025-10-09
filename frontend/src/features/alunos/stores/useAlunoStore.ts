import { create } from 'zustand'
import { alunoService } from '../services/aluno.service'

interface AlunoState {
  fetchProfile: () => Promise<any>
  saveProfile: (payload: any) => Promise<any>
}

export const useAlunoStore = create<AlunoState>((set) => ({
  fetchProfile: async () => {
    const response = await alunoService.getProfile()
    return response.data
  },
  saveProfile: async (payload) => {
    const response = await alunoService.saveProfile(payload)
    return response.data 
  },
}))
