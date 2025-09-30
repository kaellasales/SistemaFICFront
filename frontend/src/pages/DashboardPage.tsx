import { 
  BookOpen, 
  FileText, 
  Award, 
  Users, 
  TrendingUp,
  Clock,
  CheckCircle,
  XCircle
} from 'lucide-react'
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/Card'
import { useAuthStore } from '@/shared/stores/authStore'

export function DashboardPage() {
  const { user } = useAuthStore()

  const getDashboardData = () => {
    // Mock data - em produção, viria da API
    switch (user?.role) {
      case 'candidate':
        return {
          stats: [
            { label: 'Cursos Disponíveis', value: '12', icon: BookOpen, color: 'text-primary-600' },
            { label: 'Minhas Inscrições', value: '3', icon: FileText, color: 'text-blue-600' },
            { label: 'Certificados', value: '1', icon: Award, color: 'text-green-600' },
            { label: 'Em Análise', value: '2', icon: Clock, color: 'text-yellow-600' },
          ],
          recentActivities: [
            { title: 'Inscrição em "Programação Web"', status: 'aprovada', date: '2024-01-15' },
            { title: 'Inscrição em "Design Gráfico"', status: 'pendente', date: '2024-01-14' },
            { title: 'Certificado emitido para "Excel Avançado"', status: 'Completo', date: '2024-01-10' },
          ]
        }
      case 'professor':
        return {
          stats: [
            { label: 'Meus Cursos', value: '5', icon: BookOpen, color: 'text-primary-600' },
            { label: 'Total de Inscrições', value: '47', icon: FileText, color: 'text-blue-600' },
            { label: 'Aprovados', value: '35', icon: CheckCircle, color: 'text-green-600' },
            { label: 'Pendentes', value: '12', icon: Clock, color: 'text-yellow-600' },
          ],
          recentActivities: [
            { title: 'Novo curso "Python para Iniciantes"', status: 'Publicado', date: '2024-01-15' },
            { title: '15 novas inscrições em "Web Design"', status: 'Pendente', date: '2024-01-14' },
            { title: 'Curso "Excel Básico" finalizado', status: 'Completo', date: '2024-01-10' },
          ]
        }
      case 'admin':
        return {
          stats: [
            { label: 'Total de Cursos', value: '28', icon: BookOpen, color: 'text-primary-600' },
            { label: 'Inscrições Pendentes', value: '156', icon: FileText, color: 'text-blue-600' },
            { label: 'Usuários Ativos', value: '342', icon: Users, color: 'text-green-600' },
            { label: 'Certificados Emitidos', value: '89', icon: Award, color: 'text-purple-600' },
          ],
          recentActivities: [
            { title: '156 inscrições aguardando análise', status: 'Pendente', date: '2024-01-15' },
            { title: 'Novo professor cadastrado', status: 'Aprovado', date: '2024-01-14' },
            { title: 'Relatório mensal gerado', status: 'Completo', date: '2024-01-10' },
          ]
        }
      default:
        return { stats: [], recentActivities: [] }
    }
  }

  const { stats, recentActivities } = getDashboardData()

  const getStatusIcon = (status: string) => {
    switch (status) {
      case 'Aprovado':
      case 'Completo':
        return <CheckCircle className="h-4 w-4 text-green-600" />
      case 'Pendente':
        return <Clock className="h-4 w-4 text-yellow-600" />
      case 'Reprovado':
        return <XCircle className="h-4 w-4 text-red-600" />
      default:
        return <TrendingUp className="h-4 w-4 text-blue-600" />
    }
  }

  const getStatusColor = (status: string) => {
    switch (status) {
      case 'Aprovado':
      case 'Completo':
        return 'text-green-600'
      case 'Pendente':
        return 'text-yellow-600'
      case 'Reprovado':
        return 'text-red-600'
      default:
        return 'text-blue-600'
    }
  }

  return (
    <div className="space-y-6">
      <div>
        <h1 className="text-3xl font-bold text-secondary-900">
          Bem-vindo, {user?.name}!
        </h1>
        <p className="text-secondary-600 mt-2">
          Aqui está um resumo das suas atividades no sistema.
        </p>
      </div>

      {/* Estatísticas */}
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
        {stats.map((stat, index) => {
          const Icon = stat.icon
          return (
            <Card key={index}>
              <CardContent className="p-6">
                <div className="flex items-center justify-between">
                  <div>
                    <p className="text-sm font-medium text-secondary-600">
                      {stat.label}
                    </p>
                    <p className="text-3xl font-bold text-secondary-900">
                      {stat.value}
                    </p>
                  </div>
                  <Icon className={`h-8 w-8 ${stat.color}`} />
                </div>
              </CardContent>
            </Card>
          )
        })}
      </div>

      {/* Atividades Recentes */}
      <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
        <Card>
          <CardHeader>
            <CardTitle>Atividades Recentes</CardTitle>
            <CardDescription>
              Suas últimas ações no sistema
            </CardDescription>
          </CardHeader>
          <CardContent>
            <div className="space-y-4">
              {recentActivities.map((activity, index) => (
                <div key={index} className="flex items-center space-x-3">
                  {getStatusIcon(activity.status)}
                  <div className="flex-1">
                    <p className="text-sm font-medium text-secondary-900">
                      {activity.title}
                    </p>
                    <p className="text-xs text-secondary-600">
                      {new Date(activity.date).toLocaleDateString('pt-BR')}
                    </p>
                  </div>
                  <span className={`text-xs font-medium ${getStatusColor(activity.status)}`}>
                    {activity.status}
                  </span>
                </div>
              ))}
            </div>
          </CardContent>
        </Card>

        <Card>
          <CardHeader>
            <CardTitle>Ações Rápidas</CardTitle>
            <CardDescription>
              Acesso rápido às principais funcionalidades
            </CardDescription>
          </CardHeader>
          <CardContent>
            <div className="space-y-3">
              {user?.role === 'candidate' && (
                <>
                  <button className="w-full text-left p-3 rounded-lg border border-secondary-200 hover:bg-secondary-50 transition-colors">
                    <div className="flex items-center space-x-3">
                      <BookOpen className="h-5 w-5 text-primary-600" />
                      <div>
                        <p className="font-medium">Ver Cursos Disponíveis</p>
                        <p className="text-sm text-secondary-600">Explore os cursos abertos</p>
                      </div>
                    </div>
                  </button>
                  <button className="w-full text-left p-3 rounded-lg border border-secondary-200 hover:bg-secondary-50 transition-colors">
                    <div className="flex items-center space-x-3">
                      <FileText className="h-5 w-5 text-blue-600" />
                      <div>
                        <p className="font-medium">Minhas Inscrições</p>
                        <p className="text-sm text-secondary-600">Acompanhe o status</p>
                      </div>
                    </div>
                  </button>
                </>
              )}
              
              {user?.role === 'professor' && (
                <>
                  <button className="w-full text-left p-3 rounded-lg border border-secondary-200 hover:bg-secondary-50 transition-colors">
                    <div className="flex items-center space-x-3">
                      <BookOpen className="h-5 w-5 text-primary-600" />
                      <div>
                        <p className="font-medium">Criar Novo Curso</p>
                        <p className="text-sm text-secondary-600">Cadastre um novo curso</p>
                      </div>
                    </div>
                  </button>
                  <button className="w-full text-left p-3 rounded-lg border border-secondary-200 hover:bg-secondary-50 transition-colors">
                    <div className="flex items-center space-x-3">
                      <FileText className="h-5 w-5 text-blue-600" />
                      <div>
                        <p className="font-medium">Gerenciar Inscrições</p>
                        <p className="text-sm text-secondary-600">Analise as candidaturas</p>
                      </div>
                    </div>
                  </button>
                </>
              )}
              
              {user?.role === 'admin' && (
                <>
                  <button className="w-full text-left p-3 rounded-lg border border-secondary-200 hover:bg-secondary-50 transition-colors">
                    <div className="flex items-center space-x-3">
                      <FileText className="h-5 w-5 text-primary-600" />
                      <div>
                        <p className="font-medium">Analisar Inscrições</p>
                        <p className="text-sm text-secondary-600">156 pendentes</p>
                      </div>
                    </div>
                  </button>
                  <button className="w-full text-left p-3 rounded-lg border border-secondary-200 hover:bg-secondary-50 transition-colors">
                    <div className="flex items-center space-x-3">
                      <Users className="h-5 w-5 text-blue-600" />
                      <div>
                        <p className="font-medium">Gerenciar Usuários</p>
                        <p className="text-sm text-secondary-600">342 usuários ativos</p>
                      </div>
                    </div>
                  </button>
                </>
              )}
            </div>
          </CardContent>
        </Card>
      </div>
    </div>
  )
}