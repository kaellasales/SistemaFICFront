import { create } from 'zustand';
// ... (outros imports)
import { BookOpen, FileText, Users } from 'lucide-react'; // Importe os ícones necessários

// ...

export const useDashboardStore = create<DashboardState>((set) => ({
  stats: [],
  recentActivities: [],
  quickActions: [], // Continua começando vazio, está certo.
  loading: true,

  fetchDashboardData: async (userGroups) => {
    set({ loading: true });
    try {
      const role = userGroups[0] || '';
      // ... (sua lógica de buscar cursos e stats continua aqui)

      let dashboardData = { stats: [], recentActivities: [], quickActions: [] };

      if (role === 'ALUNO') {
        // ... (lógica de stats e recentActivities para ALUNO)
        
        // <<< ADICIONAR AS AÇÕES RÁPIDAS AQUI
        dashboardData.quickActions = [
          { label: 'Ver Cursos Disponíveis', description: 'Explore os cursos abertos', icon: BookOpen, color: 'text-primary-600', path: '/courses' },
          { label: 'Minhas Inscrições', description: 'Acompanhe o status', icon: FileText, color: 'text-blue-600', path: '/enrollments' },
        ];

      } else if (role === 'PROFESSOR') {
        // ... (lógica de stats e recentActivities para PROFESSOR)

        // <<< ADICIONAR AS AÇÕES RÁPIDAS AQUI
        dashboardData.quickActions = [
          { label: 'Criar Novo Curso', description: 'Cadastre um novo curso', icon: BookOpen, color: 'text-primary-600', path: '/courses/create' },
          { label: 'Meus Cursos', description: 'Gerencie seus cursos', icon: FileText, color: 'text-blue-600', path: '/my-courses' },
        ];

      } else if (role === 'CCA') {
        // ... (lógica de stats e recentActivities para CCA)

        // <<< ADICIONAR AS AÇÕES RÁPIDAS AQUI
        dashboardData.quickActions = [
          { label: 'Professores', description: 'Ver lista completa de professores', icon: Users, color: 'text-green-600', path: '/professores' },
          { label: 'Analisar Inscrições', description: 'Valide as inscrições pendentes', icon: FileText, color: 'text-primary-600', path: '/enrollments' },
          { label: 'Gerenciar Usuários', description: 'Administre todos os usuários', icon: Users, color: 'text-blue-600', path: '/users' },
        ];
      }

      // Atualiza o estado com TUDO (stats, activities e as quickActions)
      set({ ...dashboardData, loading: false });
    } catch (error) {
      console.error("Erro ao carregar dados da dashboard:", error);
      set({ loading: false, stats: [], recentActivities: [], quickActions: [] }); // Limpa em caso de erro
    }
  },
}));