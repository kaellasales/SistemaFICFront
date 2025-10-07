import { useState, useEffect } from 'react'
import { useNavigate } from 'react-router-dom'
import { 
  BookOpen, 
  FileText, 
  Users, 
  TrendingUp,
  Clock,
  CheckCircle,
  XCircle,
  Plus,
  Settings
} from 'lucide-react'
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/Card'
import { Button } from '@/components/ui/Button'
import { useAuthStore } from '@/shared/stores/authStore'
import { Logo } from '@/components/ui/Logo'

export function ProfessorDashboardPage() {
  const { user, logout } = useAuthStore()
  const navigate = useNavigate()
  const [stats, setStats] = useState({
    totalCourses: 0,
    totalEnrollments: 0,
    approvedEnrollments: 0,
    pendingEnrollments: 0
  })
  const [recentActivities, setRecentActivities] = useState([])
  const [loading, setLoading] = useState(true)

  useEffect(() => {
    const loadDashboardData = async () => {
      try {
        // Simular carregamento de dados - em produção, viria da API
        await new Promise(resolve => setTimeout(resolve, 1000))
        
        setStats({
          totalCourses: 5,
          totalEnrollments: 47,
          approvedEnrollments: 35,
          pendingEnrollments: 12
        })
        
        setRecentActivities([
          { title: 'Novo curso "Python para Iniciantes"', status: 'Publicado', date: '2024-01-15' },
          { title: '15 novas inscrições em "Web Design"', status: 'Pendente', date: '2024-01-14' },
          { title: 'Curso "Excel Básico" finalizado', status: 'Completo', date: '2024-01-10' },
        ])
      } catch (error) {
        console.error('Erro ao carregar dados do dashboard:', error)
      } finally {
        setLoading(false)
      }
    }
    
    loadDashboardData()
  }, [])

  const handleLogout = () => {
    logout()
    navigate('/login')
  }

  const getStatusIcon = (status: string) => {
    switch (status) {
      case 'Aprovado':
      case 'Completo':
      case 'Publicado':
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
      case 'Publicado':
        return 'text-green-600'
      case 'Pendente':
        return 'text-yellow-600'
      case 'Reprovado':
        return 'text-red-600'
      default:
        return 'text-blue-600'
    }
  }

  if (loading) {
    return (
      <div className="min-h-screen bg-gray-50 flex items-center justify-center">
        <div className="text-center">
          <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-green-600 mx-auto mb-4"></div>
          <p className="text-gray-600">Carregando dashboard...</p>
        </div>
      </div>
    )
  }

  return (
    <div className="h-screen bg-white flex flex-col">
      {/* Header - Verde escuro com bordas arredondadas */}
      <header className="bg-green-800 text-white px-6 py-6 rounded-b-3xl flex-shrink-0">
        <div className="max-w-7xl mx-auto flex items-center justify-between">
          <div className="flex items-center space-x-4">
            <div className="w-12 h-12 bg-white rounded-full flex items-center justify-center">
              <Logo className="h-8 w-8" />
            </div>
            <div>
              <h1 className="text-xl font-bold">Instituto Federal de Educação</h1>
              <p className="text-green-200 text-sm">Campus Ceará</p>
            </div>
          </div>
          
          <nav className="flex items-center space-x-2">
            <button 
              className="px-4 py-2 text-green-600 bg-white border border-white rounded-lg hover:bg-green-50 transition-colors"
              onClick={() => navigate('/professor-dashboard')}
            >
              Inicio
            </button>
            <button 
              className="px-4 py-2 text-green-600 bg-white border border-white rounded-lg hover:bg-green-50 transition-colors"
              onClick={() => navigate('/my-courses')}
            >
              Meus cursos
            </button>
            <button 
              className="px-4 py-2 text-green-600 bg-white border border-white rounded-lg hover:bg-green-50 transition-colors"
              onClick={handleLogout}
            >
              Sair
            </button>
          </nav>
        </div>
      </header>

      {/* Main Content - Área branca central */}
      <main className="flex-1 bg-white flex items-center justify-center">
        <div className="text-center">
          <div className="flex items-center justify-center space-x-6">
            <Logo className="h-16 w-16" />
            <div className="text-left">
              <h2 className="text-3xl font-bold text-green-800">Bem-Vindo(a)</h2>
              <p className="text-2xl text-green-700 font-medium">
                {user?.name || 'Professor'}
              </p>
            </div>
          </div>
        </div>
      </main>

      {/* Footer - Verde claro com bordas arredondadas */}
      <footer className="bg-green-600 text-white px-6 py-6 rounded-t-3xl flex-shrink-0">
        <div className="max-w-7xl mx-auto text-center">
          <h3 className="text-lg font-medium mb-2">O que é?</h3>
          <div className="w-24 h-px bg-white mx-auto"></div>
        </div>
      </footer>
    </div>
  )
}
