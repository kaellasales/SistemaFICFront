import { create } from 'zustand';
import { persist, createJSONStorage } from 'zustand/middleware';
import { User } from '@/shared/types';
import { authService } from '@/shared/services/authService';

// --- IMPORTANDO AS OUTRAS STORES PARA A LIMPEZA ---
import { useCourseStore } from '@/features/courses/stores/useCourseStore';
import { useEnrollmentStore } from '@/features/enrollments/stores/useEnrollmentStore';

interface AuthState {
  user: User | null;
  accessToken: string | null;
  refreshToken: string | null;
  isAuthenticated: boolean;
  isLoading: boolean;
}

interface AuthActions {
  login: (user: User, accessToken: string, refreshToken: string) => void;
  logout: () => void;
  updateUser: (user: Partial<User>) => void;
  setLoading: (loading: boolean) => void;
  refreshUser: () => Promise<void>;
}

type AuthStore = AuthState & AuthActions;

export const useAuthStore = create<AuthStore>()(
  persist(
    (set, get) => ({
      user: null,
      accessToken: null,
      refreshToken: null,
      isAuthenticated: false,
      isLoading: false,

      login: (user, accessToken, refreshToken) => {
        set({
          user,
          accessToken,
          refreshToken,
          isAuthenticated: true,
          isLoading: false,
        });
      },

      logout: () => {
        // 1. Limpa a si mesma
        set({
          user: null,
          accessToken: null,
          refreshToken: null,
          isAuthenticated: false,
          isLoading: false,
        });

        // 2. Comanda as outras stores a se limparem
        useCourseStore.getState().clearCourses();
        useEnrollmentStore.getState().clearEnrollments();
        // (Adicione outras stores aqui no futuro, se necessário)

        // 3. Limpa o armazenamento local (opcional, mas bom)
        // O `persist` middleware tem uma função para isso!
        // localStorage.removeItem('auth-storage');
        // A forma mais limpa é deixar o 'persist' gerenciar isso.
        // Apenas chamar set() já deve atualizar o localStorage.
        
        console.log("Limpeza geral de estado concluída!");
      },

      updateUser: (userData) => {
        const currentUser = get().user;
        if (currentUser) {
          set({ user: { ...currentUser, ...userData } });
        }
      },

      setLoading: (loading) => set({ isLoading: loading }),

      refreshUser: async () => {
        try {
          const updatedUser = await authService.me();
          set({ user: updatedUser });
        } catch (err) {
          console.error('Erro ao atualizar usuário:', err);
          get().logout();
        }
      },
    }),
    {
      name: 'auth-storage',
      storage: createJSONStorage(() => localStorage),
      partialize: (state) => ({
        user: state.user,
        accessToken: state.accessToken,
        refreshToken: state.refreshToken,
        isAuthenticated: state.isAuthenticated,
      }),
    }
  )
);