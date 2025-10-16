import { create } from 'zustand';
import { dashboardService } from '../services/dashboard.service';
import { fromSnakeCase } from '@/shared/utils/caseConverter';
import { Course } from '@/features/courses/types/course.types';
import { useEnrollmentStore } from '@/features/enrollments/stores/useEnrollmentStore';
import { 
  BookOpen, 
  FileText, 
  Award, 
  Users, 
  Clock, 
  CheckCircle 
} from 'lucide-react';

// A interface que define a estrutura da nossa Store
interface DashboardState {
  stats: any[];
  recentActivities: any[];
  quickActions: any[];
  loading: boolean;
  fetchDashboardData: (userGroups: string[]) => Promise<void>;
}

export const useDashboardStore = create<DashboardState>((set) => ({
  stats: [],
  recentActivities: [],
  quickActions: [],
  loading: true,

  fetchDashboardData: async (userGroups) => {
    set({ loading: true });
    try {
      const role = userGroups[0] || '';

      // --- BUSCANDO DADOS REAIS ---
      // 1. Busca os cursos (a lista filtrada pela API)
      const coursesResponse = await dashboardService.getCourses();
      const courses: Course[] = fromSnakeCase(coursesResponse.data);

      // 2. Comanda a outra store para buscar as inscrições do aluno
      await useEnrollmentStore.getState().fetchMyEnrollments();
      const myEnrollments = useEnrollmentStore.getState().enrollments;

      // 3. Faz os cálculos com os dados reais
      const totalInscricoes = myEnrollments.length;
      const emAnalise = myEnrollments.filter(e => e.status === 'AGUARDANDO_VALIDACAO').length;

      let dashboardData = { stats: [], recentActivities: [], quickActions: [] };

      if (role === 'ALUNO') {
        dashboardData = {
          stats: [
            { label: 'Cursos Disponíveis', value: courses.length.toString(), icon: BookOpen, color: 'text-primary-600' },
            { label: 'Minhas Inscrições', value: totalInscricoes.toString(), icon: FileText, color: 'text-blue-600' },
            { label: 'Certificados', value: '0', icon: Award, color: 'text-green-600' }, // Mock
            { label: 'Em Análise', value: emAnalise.toString(), icon: Clock, color: 'text-yellow-600' },
          ],
          recentActivities: [ /* ... mock de atividades recentes do aluno ... */ ],
          quickActions: [
            { label: 'Ver Cursos Disponíveis', description: 'Explore os cursos abertos', icon: BookOpen, color: 'text-primary-600', path: '/courses' },
            { label: 'Minhas Inscrições', description: 'Acompanhe o status', icon: FileText, color: 'text-blue-600', path: '/enrollments' },
          ],
        };
      } else if (role === 'PROFESSOR') {
        dashboardData = {
          stats: [
            { label: 'Meus Cursos', value: courses.length.toString(), icon: BookOpen, color: 'text-primary-600' },
            { label: 'Total de Inscrições', value: '47', icon: FileText, color: 'text-blue-600' }, // Mock
            { label: 'Aprovados', value: '35', icon: CheckCircle, color: 'text-green-600' }, // Mock
            { label: 'Pendentes', value: '12', icon: Clock, color: 'text-yellow-600' }, // Mock
          ],
          recentActivities: [ /* ... mock de atividades recentes do professor ... */ ],
          quickActions: [
            { label: 'Criar Novo Curso', description: 'Cadastre um novo curso', icon: BookOpen, color: 'text-primary-600', path: '/courses/create' },
            { label: 'Meus Cursos', description: 'Gerencie seus cursos', icon: FileText, color: 'text-blue-600', path: '/my-courses' },
          ],
        };
      } else if (role === 'CCA') {
        dashboardData = {
          stats: [
            { label: 'Total de Cursos', value: courses.length.toString(), icon: BookOpen, color: 'text-primary-600' },
            { label: 'Inscrições Pendentes', value: '156', icon: FileText, color: 'text-blue-600' }, // Mock
            { label: 'Usuários Ativos', value: '342', icon: Users, color: 'text-green-600' }, // Mock
            { label: 'Certificados Emitidos', value: '89', icon: Award, color: 'text-purple-600' }, // Mock
          ],
          recentActivities: [ /* ... mock de atividades recentes do CCA ... */ ],
          quickActions: [
            { label: 'Professores', description: 'Ver lista de professores', icon: Users, color: 'text-green-600', path: '/professores' },
            { label: 'Analisar Inscrições', description: 'Valide as inscrições', icon: FileText, color: 'text-primary-600', path: '/enrollments' }, // Rota genérica para o CCA
          ],
        };
      }

      set({ ...dashboardData, loading: false });
    } catch (error) {
      console.error("Erro ao carregar dados da dashboard:", error);
      set({ loading: false, stats: [], recentActivities: [], quickActions: [] });
    }
  },
}));