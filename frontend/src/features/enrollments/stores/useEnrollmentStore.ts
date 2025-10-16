import { create } from 'zustand';
import { enrollmentService } from '@/features/enrollments/services/enrollment.service'
import { fromSnakeCase } from '@/shared/utils/caseConverter';
import { Enrollment, EnrollmentCreatePayload } from '@/features/enrollments/types/enrollment.types'; // <<< Importa os dois tipos

// A interface que define a estrutura da nossa Store
interface EnrollmentState {
  myEnrollments: Enrollment[];
  loading: boolean;
  courseEnrollments: Enrollment[];
  fetchMyEnrollments: () => Promise<void>;
  createEnrollment: (payload: EnrollmentCreatePayload) => Promise<any>; // <<< Usa o tipo correto
  fetchEnrollmentsByCourse: (courseId: string) => Promise<void>;
  clearEnrollments: () => void;
  pendingEnrollments: Enrollment[]; 
  fetchPendingEnrollments: () => Promise<void>;
  validateEnrollment: (enrollmentId: number, isApproved: boolean, reason?: string) => Promise<void>;
}

export const useEnrollmentStore = create<EnrollmentState>((set) => ({
  // --- Estado Inicial ---
  courseEnrollments: [],
  myEnrollments: [],
  loading: false,
  clearEnrollments: () => {
    set({ myEnrollments: [], courseEnrollments: [] });
  },

  // --- Ações ---

  fetchMyEnrollments: async () => {
    set({ loading: true });
    try {
      const response = await enrollmentService.listMyEnrollments();
      set({ myEnrollments: fromSnakeCase(response.data), loading: false });
    } catch (error) {
      console.error("Falha ao buscar minhas inscrições.", error);
      set({ loading: false });
      throw error;
    }
  },

  // A implementação desta função não muda, apenas a sua "assinatura" (o tipo do payload)
  createEnrollment: async (payload: EnrollmentCreatePayload) => {
    return enrollmentService.create(payload);
  },

  fetchEnrollmentsByCourse: async (courseId: string) => {
    set({ loading: true });
    try {
      const response = await enrollmentService.listByCourse(courseId);
      set({ courseEnrollments: fromSnakeCase(response.data), loading: false });
    } catch (error) {
      console.error("Falha ao buscar inscrições do curso.", error);
      set({ loading: false });
      throw error;
    }
  },

    pendingEnrollments: [],
  fetchPendingEnrollments: async () => {
    try {
      const response = await enrollmentService.listAllPending();
      set({ pendingEnrollments: fromSnakeCase(response.data) });
    } catch (error) {
      console.error("Falha ao buscar inscrições pendentes.", error);
      throw error;
    }
  },

   validateEnrollment: async (enrollmentId, isApproved, reason) => {
    // 1. Comanda o service para enviar a validação para a API
    const response = await enrollmentService.validate(enrollmentId, isApproved, reason);
    const updatedEnrollment = fromSnakeCase(response.data);

    // 2. ATUALIZA A LISTA NA MEMÓRIA!
    //    Isso faz com que a tela mude o status da inscrição instantaneamente,
    //    sem precisar recarregar a página.
    set(state => ({
      courseEnrollments: state.courseEnrollments.map(enrollment => 
        enrollment.id === updatedEnrollment.id ? updatedEnrollment : enrollment
      ),
    }));
  },
}));