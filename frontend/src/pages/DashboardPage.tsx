import { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import {
  BookOpen,
  FileText,
  Award,
  Users,
  Clock,
  CheckCircle,
  XCircle,
  TrendingUp,
} from 'lucide-react';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/Card';
import { useAuthStore } from '@/shared/stores/authStore';
import { useCourseStore } from '@/features/courses/stores/useCourseStore';

// Interface para padronizar as ações rápidas
interface QuickAction {
    label: string;
    description: string;
    icon: React.ElementType;
    color: string;
    path: string;
}

export function DashboardPage() {
  const { user } = useAuthStore();
  const navigate = useNavigate();
  const { fetchCourses } = useCourseStore();

  const [loading, setLoading] = useState(true);
  // ESTADO PARA GUARDAR OS DADOS FINAIS (MOCK + REAIS)
  const [dashboardData, setDashboardData] = useState<{
    stats: any[],
    recentActivities: any[],
    quickActions: QuickAction[]
  }>({
    stats: [],
    recentActivities: [],
    quickActions: [],
  });
  
  // EFEITO PARA BUSCAR DADOS REAIS E MESCLAR COM OS MOCKS
  useEffect(() => {
    const loadAndMergeData = async () => {
      try {
        // 1. Busca os cursos reais da API
        await fetchCourses();
        const realCourses = useCourseStore.getState().courses;

        // 2. Pega os dados mockados como base
        const mockData = getMockDashboardData();

        // 3. Mescla os dados: substitui os valores mockados pelos reais
        const groups = user?.groups || [];
        let statLabelToUpdate = '';
        if (groups.includes('PROFESSOR')) {
            statLabelToUpdate = 'Meus Cursos';
        } else if (groups.includes('ALUNO')) {
            statLabelToUpdate = 'Cursos Disponíveis';
        } else if (groups.includes('CCA')) {
            statLabelToUpdate = 'Total de Cursos';
        }

        if (statLabelToUpdate) {
            const courseStat = mockData.stats.find(s => s.label === statLabelToUpdate);
            if (courseStat) {
                courseStat.value = realCourses.length.toString();
            }
        }
        
        // 4. Salva os dados finais (mesclados) no estado da página
        setDashboardData(mockData);

      } catch (error) {
        console.error("Erro ao carregar dados da dashboard", error);
        setDashboardData(getMockDashboardData()); // Em caso de erro, mostra os mocks
      } finally {
        setLoading(false);
      }
    };

    if (user?.groups) {
        loadAndMergeData();
    }
  }, [user, fetchCourses]);

  // Sua função original que serve como "molde" para os dados mockados
  const getMockDashboardData = () => {
    const groups = user?.groups || [];

    if (groups.includes('CCA')) {
      return {
        stats: [
          { label: 'Total de Cursos', value: '...', icon: BookOpen, color: 'text-primary-600' },
          { label: 'Inscrições Pendentes', value: '156', icon: FileText, color: 'text-blue-600' },
          { label: 'Usuários Ativos', value: '342', icon: Users, color: 'text-green-600' },
          { label: 'Certificados Emitidos', value: '89', icon: Award, color: 'text-purple-600' },
        ],
        recentActivities: [
          { title: '156 inscrições aguardando análise', status: 'Pendente', date: '2025-10-01' },
          { title: 'Novo professor cadastrado', status: 'Completo', date: '2025-09-30' },
        ],
        quickActions: [
          { label: 'Professores', description: 'Ver lista completa de professores', icon: Users, color: 'text-green-600', path: '/professores' },
          { label: 'Analisar Inscrições', description: '156 pendentes', icon: FileText, color: 'text-primary-600', path: '/enrollments' },
        ] as QuickAction[]
      };
    } else if (groups.includes('PROFESSOR')) {
      return {
        stats: [
          { label: 'Meus Cursos', value: '...', icon: BookOpen, color: 'text-primary-600' },
          { label: 'Total de Inscrições', value: '47', icon: FileText, color: 'text-blue-600' },
          { label: 'Aprovados', value: '35', icon: CheckCircle, color: 'text-green-600' },
          { label: 'Pendentes', value: '12', icon: Clock, color: 'text-yellow-600' },
        ],
        recentActivities: [
          { title: 'Novo curso "Python para Iniciantes"', status: 'Publicado', date: '2025-09-29' },
          { title: '12 novas inscrições em "Web Design"', status: 'Pendente', date: '2025-09-28' },
        ],
        quickActions: [
            { label: 'Criar Novo Curso', description: 'Cadastre um novo curso', icon: BookOpen, color: 'text-primary-600', path: '/courses/create' },
            { label: 'Meus Cursos', description: 'Gerencie seus cursos', icon: FileText, color: 'text-blue-600', path: '/my-courses' },
        ] as QuickAction[]
      };
    } else if (groups.includes('ALUNO')) {
      return {
        stats: [
          { label: 'Cursos Disponíveis', value: '...', icon: BookOpen, color: 'text-primary-600' },
          { label: 'Minhas Inscrições', value: '3', icon: FileText, color: 'text-blue-600' },
          { label: 'Certificados', value: '1', icon: Award, color: 'text-green-600' },
          { label: 'Em Análise', value: '2', icon: Clock, color: 'text-yellow-600' },
        ],
        recentActivities: [
          { title: 'Inscrição em "Programação Web"', status: 'Aprovado', date: '2025-09-30' },
          { title: 'Inscrição em "Design Gráfico"', status: 'Pendente', date: '2025-09-29' },
        ],
        quickActions: [
            { label: 'Ver Cursos Disponíveis', description: 'Explore os cursos abertos', icon: BookOpen, color: 'text-primary-600', path: '/courses' },
            { label: 'Minhas Inscrições', description: 'Acompanhe o status', icon: FileText, color: 'text-blue-600', path: '/enrollments' },
        ] as QuickAction[]
      };
    }
    return { stats: [], recentActivities: [], quickActions: [] };
  };

  const { stats, recentActivities, quickActions } = dashboardData;
  const getStatusIcon = (status: string) => { /* ... sua função ... */ return <Clock />; };
  const getStatusColor = (status: string) => { /* ... sua função ... */ return 'text-gray-600'; };

  if (loading) {
    return (
        <div className="flex justify-center items-center h-[calc(100vh-80px)]">
            <div className="text-center">
                <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-green-600 mx-auto mb-4"></div>
                <p className="text-gray-600">Carregando dashboard...</p>
            </div>
        </div>
    );
  }

  return (
    <div className="space-y-6">
      <div>
        <h1 className="text-3xl font-bold text-secondary-900">Bem-vindo, {user?.first_name || 'Usuário'}!</h1>
        <p className="text-secondary-600 mt-2">Aqui está um resumo das suas atividades no sistema.</p>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
        {stats.map((stat, index) => {
          const Icon = stat.icon;
          return (
            <Card key={index}>
              <CardContent className="p-6">
                <div className="flex items-center justify-between">
                  <div>
                    <p className="text-sm font-medium text-secondary-600">{stat.label}</p>
                    <p className="text-3xl font-bold text-secondary-900">{stat.value}</p>
                  </div>
                  <Icon className={`h-8 w-8 ${stat.color}`} />
                </div>
              </CardContent>
            </Card>
          );
        })}
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
        <Card>
          <CardHeader>
            <CardTitle>Atividades Recentes</CardTitle>
            <CardDescription>Suas últimas ações no sistema</CardDescription>
          </CardHeader>
          <CardContent>
            <div className="space-y-4">
              {recentActivities.map((activity, index) => (
                <div key={index} className="flex items-center space-x-3">
                  {getStatusIcon(activity.status)}
                  <div className="flex-1">
                    <p className="text-sm font-medium text-secondary-900">{activity.title}</p>
                    <p className="text-xs text-secondary-600">{new Date(activity.date).toLocaleDateString('pt-BR')}</p>
                  </div>
                  <span className={`text-xs font-medium ${getStatusColor(activity.status)}`}>{activity.status}</span>
                </div>
              ))}
            </div>
          </CardContent>
        </Card>

        <Card>
          <CardHeader>
            <CardTitle>Ações Rápidas</CardTitle>
            <CardDescription>Acesso rápido às principais funcionalidades</CardDescription>
          </CardHeader>
          <CardContent>
            <div className="space-y-3">
              {quickActions.map((action, index) => {
                const Icon = action.icon;
                return (
                  <button key={index} onClick={() => navigate(action.path)} className="w-full text-left p-3 rounded-lg border border-secondary-200 hover:bg-secondary-50 transition-colors">
                    <div className="flex items-center space-x-3">
                      <Icon className={`h-5 w-5 ${action.color}`} />
                      <div>
                        <p className="font-medium">{action.label}</p>
                        <p className="text-sm text-secondary-600">{action.description}</p>
                      </div>
                    </div>
                  </button>
                );
              })}
            </div>
          </CardContent>
        </Card>
      </div>
    </div>
  );
}