import { useState, useEffect } from 'react'
import { useNavigate } from 'react-router-dom'
import { 
  BookOpen, 
  Plus, 
  Edit, 
  Trash2, 
  Users, 
  Calendar,
  Clock,
  CheckCircle,
  XCircle
} from 'lucide-react'
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/Card'
import { Button } from '@/components/ui/Button'
import { useAuthStore } from '@/shared/stores/authStore'
import { Logo } from '@/components/ui/Logo'

interface Course {
  id: string
  name: string
  description: string
  status: 'draft' | 'published' | 'cancelled' | 'completed'
  enrollmentCount: number
  maxSlots: number
  startDate: string
  endDate: string
  createdAt: string
}

export function MyCoursesPage() {
  const { user, logout } = useAuthStore()
  const navigate = useNavigate()
  const [courses, setCourses] = useState<Course[]>([])
  const [loading, setLoading] = useState(true)
  const [selectedCourse, setSelectedCourse] = useState<Course | null>(null)

  console.log('MyCoursesPage - User role:', user?.role)

  useEffect(() => {
    const loadCourses = async () => {
      try {
        // Simular carregamento de dados - em produção, viria da API
        await new Promise(resolve => setTimeout(resolve, 1000))
        
        setCourses([
          {
            id: '1',
            name: 'Programação Web com React',
            description: 'Curso completo de programação web moderna',
            status: 'published',
            enrollmentCount: 25,
            maxSlots: 30,
            startDate: '2024-04-01',
            endDate: '2024-06-30',
            createdAt: '2024-01-15'
          },
          {
            id: '2',
            name: 'Design Gráfico Digital',
            description: 'Fundamentos do design gráfico e ferramentas digitais',
            status: 'published',
            enrollmentCount: 18,
            maxSlots: 25,
            startDate: '2024-04-15',
            endDate: '2024-07-15',
            createdAt: '2024-01-10'
          },
          {
            id: '3',
            name: 'Python para Iniciantes',
            description: 'Introdução à programação com Python',
            status: 'draft',
            enrollmentCount: 0,
            maxSlots: 20,
            startDate: '2024-05-01',
            endDate: '2024-07-31',
            createdAt: '2024-01-20'
          }
        ])
      } catch (error) {
        console.error('Erro ao carregar cursos:', error)
      } finally {
        setLoading(false)
      }
    }
    
    loadCourses()
  }, [])

  const handleLogout = () => {
    logout()
    navigate('/login')
  }

  const getStatusIcon = (status: string) => {
    switch (status) {
      case 'published':
        return <CheckCircle className="h-4 w-4 text-green-600" />
      case 'draft':
        return <Clock className="h-4 w-4 text-yellow-600" />
      case 'cancelled':
        return <XCircle className="h-4 w-4 text-red-600" />
      case 'completed':
        return <CheckCircle className="h-4 w-4 text-blue-600" />
      default:
        return <Clock className="h-4 w-4 text-gray-600" />
    }
  }

  const getStatusText = (status: string) => {
    switch (status) {
      case 'published':
        return 'Publicado'
      case 'draft':
        return 'Rascunho'
      case 'cancelled':
        return 'Cancelado'
      case 'completed':
        return 'Finalizado'
      default:
        return 'Desconhecido'
    }
  }

  const getStatusColor = (status: string) => {
    switch (status) {
      case 'published':
        return 'text-green-600 bg-green-100'
      case 'draft':
        return 'text-yellow-600 bg-yellow-100'
      case 'cancelled':
        return 'text-red-600 bg-red-100'
      case 'completed':
        return 'text-blue-600 bg-blue-100'
      default:
        return 'text-gray-600 bg-gray-100'
    }
  }

  if (loading) {
    return (
      <div className="min-h-screen bg-gray-50 flex items-center justify-center">
        <div className="text-center">
          <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-green-600 mx-auto mb-4"></div>
          <p className="text-gray-600">Carregando cursos...</p>
        </div>
      </div>
    )
  }

  return (
    <div className="min-h-screen bg-gray-100">
      {/* Header - Verde escuro com bordas arredondadas */}
      <header className="bg-green-800 text-white px-6 py-6 rounded-b-3xl">
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

      {/* Main Content - Área cinza clara */}
      <main className="bg-gray-100 min-h-screen px-6 py-8">
        <div className="max-w-7xl mx-auto">
          {/* Header Section */}
          <div className="flex items-center justify-between mb-8">
            <div className="flex items-center space-x-2">
              <div className="w-2 h-2 bg-red-500 rounded-full"></div>
              <h2 className="text-2xl font-bold text-green-800">Seus Cursos</h2>
            </div>
            
            <Button 
              className="bg-green-600 hover:bg-green-700 w-16 h-16 rounded-full flex items-center justify-center"
              onClick={() => navigate('/courses/create')}
            >
              <Plus className="h-8 w-8 text-white" />
            </Button>
          </div>

          {/* Courses Grid - Layout horizontal como na imagem */}
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
            {courses.map((course) => (
              <div 
                key={course.id} 
                className="bg-white border-2 border-green-600 rounded-lg p-4 cursor-pointer hover:shadow-lg transition-shadow"
                onClick={() => setSelectedCourse(course)}
              >
                {/* Course Image Placeholder */}
                <div className="w-full h-32 bg-gray-200 border border-green-600 rounded mb-4 flex items-center justify-center">
                  <span className="text-gray-500 text-sm">Imagem do Curso</span>
                </div>
                
                {/* Course Info */}
                <div className="space-y-2">
                  <h3 className="text-lg font-semibold text-green-800">{course.name}</h3>
                  <p className="text-sm text-gray-600">
                    inscrição até {new Date(course.enrollmentEndDate).toLocaleDateString('pt-BR')}
                  </p>
                  <p className="text-sm text-gray-600">
                    {getStatusText(course.status)}
                  </p>
                </div>
                
                {/* Info Icon */}
                <div className="flex justify-end mt-4">
                  <div className="w-6 h-6 bg-green-600 rounded-full flex items-center justify-center">
                    <span className="text-white text-xs font-bold">i</span>
                  </div>
                </div>
              </div>
            ))}
          </div>

          {/* Empty State */}
          {courses.length === 0 && (
            <div className="text-center py-12">
              <BookOpen className="h-16 w-16 text-gray-400 mx-auto mb-4" />
              <h3 className="text-lg font-medium text-gray-900 mb-2">
                Nenhum curso encontrado
              </h3>
              <p className="text-gray-600 mb-6">
                Comece criando seu primeiro curso
              </p>
              <Button 
                className="bg-green-600 hover:bg-green-700"
                onClick={() => navigate('/courses/create')}
              >
                <Plus className="h-4 w-4 mr-2" />
                Criar Primeiro Curso
              </Button>
            </div>
          )}
        </div>
      </main>

      {/* Modal de Detalhes do Curso */}
      {selectedCourse && (
        <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50">
          <div className="bg-white rounded-lg border-4 border-green-600 p-6 max-w-2xl w-full mx-4">
            {/* Header do Modal */}
            <div className="flex items-center justify-between mb-4">
              <div>
                <h3 className="text-2xl font-bold text-green-800">{selectedCourse.name}</h3>
                <p className="text-sm text-gray-600 mt-1">Gerenciar curso</p>
              </div>
              <button 
                onClick={() => setSelectedCourse(null)}
                className="text-green-600 hover:text-green-800 text-2xl font-bold"
              >
                ×
              </button>
            </div>
            
            {/* Descrição */}
            <div className="mb-6">
              <p className="text-green-800 text-sm leading-relaxed">
                {selectedCourse.description}
              </p>
            </div>
            
            {/* Informações do Curso */}
            <div className="space-y-2 mb-6">
              <p className="text-green-800">
                <strong>Professor(a):</strong> {user?.name || 'Professor'}
              </p>
              <p className="text-green-800">
                <strong>Período:</strong> {new Date(selectedCourse.startDate).toLocaleDateString('pt-BR')} até {new Date(selectedCourse.endDate).toLocaleDateString('pt-BR')}
              </p>
              <p className="text-green-600">
                <strong>Quantidade de vagas:</strong> {selectedCourse.maxSlots}
              </p>
              <p className="text-green-800">
                <strong>Vagas internas:</strong> {Math.floor(selectedCourse.maxSlots / 2)}
              </p>
              <p className="text-green-800">
                <strong>Vagas externas:</strong> {Math.floor(selectedCourse.maxSlots / 2)}
              </p>
            </div>
            
            {/* Linha separadora */}
            <div className="border-t-2 border-green-600 mb-6"></div>
            
            {/* Botões de Ação para Professor */}
            <div className="space-y-3">
              <div className="flex space-x-4">
                <Button 
                  className="bg-green-600 hover:bg-green-700 flex-1"
                  onClick={() => {
                    navigate(`/courses/${selectedCourse.id}/edit`)
                    setSelectedCourse(null)
                  }}
                >
                  Editar Curso
                </Button>
                
                <Button 
                  variant="outline"
                  className="border-green-600 text-green-600 hover:bg-green-50 flex-1"
                  onClick={() => {
                    if (confirm('Tem certeza que deseja cancelar este curso?')) {
                      // Implementar cancelamento
                      setSelectedCourse(null)
                    }
                  }}
                >
                  Cancelar Curso
                </Button>
              </div>
              
              <div className="flex space-x-4">
                <Button 
                  className="bg-blue-600 hover:bg-blue-700 flex-1"
                  onClick={() => {
                    navigate(`/courses/${selectedCourse.id}/enrollments`)
                    setSelectedCourse(null)
                  }}
                >
                  Gerenciar Matrículas
                </Button>
                
                <Button 
                  variant="outline"
                  className="border-orange-600 text-orange-600 hover:bg-orange-50 flex-1"
                  onClick={() => {
                    if (confirm('Tem certeza que deseja encerrar as matrículas deste curso?')) {
                      // Implementar encerramento de matrículas
                      alert('Matrículas encerradas com sucesso!')
                      setSelectedCourse(null)
                    }
                  }}
                >
                  Encerrar Matrículas
                </Button>
              </div>
            </div>
          </div>
        </div>
      )}

      {/* Footer - Verde claro com bordas arredondadas */}
      <footer className="bg-green-600 text-white px-6 py-6 rounded-t-3xl">
        <div className="max-w-7xl mx-auto text-center">
          <h3 className="text-lg font-medium mb-2">O que é?</h3>
          <div className="w-24 h-px bg-white mx-auto"></div>
        </div>
      </footer>
    </div>
  )
}
