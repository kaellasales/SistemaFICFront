import { useState, useEffect } from 'react'
import { useNavigate, useParams } from 'react-router-dom'
import { 
  ArrowLeft, 
  CheckCircle, 
  XCircle, 
  Clock,
  User,
  Mail,
  Phone,
  FileText,
  Download,
  Eye
} from 'lucide-react'
import { Button } from '@/components/ui/Button'
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/Card'
import { useAuthStore } from '@/shared/stores/authStore'
import { Logo } from '@/components/ui/Logo'

interface Enrollment {
  id: string
  student: {
    name: string
    email: string
    phone: string
    cpf: string
  }
  status: 'pending' | 'under_review' | 'approved' | 'rejected'
  createdAt: string
  documents: number
  rejectionReason?: string
}

interface Course {
  id: string
  name: string
  description: string
  maxSlots: number
  enrollmentCount: number
}

export function CourseEnrollmentsPage() {
  const { courseId } = useParams()
  const { user, logout } = useAuthStore()
  const navigate = useNavigate()
  
  const [course, setCourse] = useState<Course | null>(null)
  const [enrollments, setEnrollments] = useState<Enrollment[]>([])
  const [loading, setLoading] = useState(true)
  const [filter, setFilter] = useState<'all' | 'pending' | 'approved' | 'rejected'>('all')

  useEffect(() => {
    loadData()
  }, [courseId])

  const loadData = async () => {
    setLoading(true)
    try {
      // Simular carregamento - em produção, viria da API
      await new Promise(resolve => setTimeout(resolve, 1000))
      
      // Mock data
      setCourse({
        id: courseId || '1',
        name: 'Programação Web com React',
        description: 'Curso completo de programação web moderna',
        maxSlots: 30,
        enrollmentCount: 25
      })
      
      setEnrollments([
        {
          id: '1',
          student: {
            name: 'João Silva',
            email: 'joao@email.com',
            phone: '(85) 99999-9999',
            cpf: '123.456.789-00'
          },
          status: 'pending',
          createdAt: '2024-01-15',
          documents: 3
        },
        {
          id: '2',
          student: {
            name: 'Maria Santos',
            email: 'maria@email.com',
            phone: '(85) 88888-8888',
            cpf: '987.654.321-00'
          },
          status: 'approved',
          createdAt: '2024-01-14',
          documents: 4
        },
        {
          id: '3',
          student: {
            name: 'Pedro Costa',
            email: 'pedro@email.com',
            phone: '(85) 77777-7777',
            cpf: '456.789.123-00'
          },
          status: 'rejected',
          createdAt: '2024-01-13',
          documents: 2,
          rejectionReason: 'Documentos incompletos'
        }
      ])
    } catch (error) {
      console.error('Erro ao carregar dados:', error)
    } finally {
      setLoading(false)
    }
  }

  const handleStatusChange = async (enrollmentId: string, newStatus: 'approved' | 'rejected') => {
    try {
      // Simular atualização - em produção, seria uma chamada para a API
      await new Promise(resolve => setTimeout(resolve, 1000))
      
      setEnrollments(prev => 
        prev.map(enrollment => 
          enrollment.id === enrollmentId 
            ? { ...enrollment, status: newStatus }
            : enrollment
        )
      )
      
      alert(`Inscrição ${newStatus === 'approved' ? 'aprovada' : 'rejeitada'} com sucesso!`)
    } catch (error) {
      console.error('Erro ao atualizar status:', error)
      alert('Erro ao atualizar status. Tente novamente.')
    }
  }

  const handleLogout = () => {
    logout()
    navigate('/login')
  }

  const getStatusIcon = (status: string) => {
    switch (status) {
      case 'approved':
        return <CheckCircle className="h-4 w-4 text-green-600" />
      case 'rejected':
        return <XCircle className="h-4 w-4 text-red-600" />
      case 'pending':
        return <Clock className="h-4 w-4 text-yellow-600" />
      default:
        return <Clock className="h-4 w-4 text-gray-600" />
    }
  }

  const getStatusText = (status: string) => {
    switch (status) {
      case 'approved':
        return 'Aprovado'
      case 'rejected':
        return 'Rejeitado'
      case 'pending':
        return 'Pendente'
      case 'under_review':
        return 'Em Análise'
      default:
        return 'Desconhecido'
    }
  }

  const getStatusColor = (status: string) => {
    switch (status) {
      case 'approved':
        return 'text-green-600 bg-green-100'
      case 'rejected':
        return 'text-red-600 bg-red-100'
      case 'pending':
        return 'text-yellow-600 bg-yellow-100'
      case 'under_review':
        return 'text-blue-600 bg-blue-100'
      default:
        return 'text-gray-600 bg-gray-100'
    }
  }

  const filteredEnrollments = enrollments.filter(enrollment => {
    if (filter === 'all') return true
    return enrollment.status === filter
  })

  if (loading) {
    return (
      <div className="min-h-screen bg-white flex items-center justify-center">
        <div className="text-center">
          <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-green-600 mx-auto mb-4"></div>
          <p className="text-gray-600">Carregando inscrições...</p>
        </div>
      </div>
    )
  }

  return (
    <div className="min-h-screen bg-white">
      {/* Header */}
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
            <Button 
              variant="outline" 
              size="sm"
              className="text-white border-white hover:bg-white hover:text-green-800 rounded-lg"
              onClick={() => navigate('/professor-dashboard')}
            >
              Inicio
            </Button>
            <Button 
              variant="outline" 
              size="sm"
              className="text-white border-white hover:bg-white hover:text-green-800 rounded-lg"
              onClick={() => navigate('/my-courses')}
            >
              Meus cursos
            </Button>
            <Button 
              variant="outline" 
              size="sm"
              className="text-white border-white hover:bg-white hover:text-green-800 rounded-lg"
              onClick={() => navigate('/courses')}
            >
              Cursos
            </Button>
            <Button 
              variant="outline" 
              size="sm"
              className="text-white border-white hover:bg-white hover:text-green-800 rounded-lg"
              onClick={handleLogout}
            >
              Sair
            </Button>
          </nav>
        </div>
      </header>

      {/* Main Content */}
      <main className="max-w-7xl mx-auto px-6 py-8">
        {/* Header */}
        <div className="flex items-center space-x-4 mb-8">
          <Button 
            variant="outline" 
            onClick={() => navigate('/my-courses')}
            className="flex items-center space-x-2"
          >
            <ArrowLeft className="h-4 w-4" />
            <span>Voltar</span>
          </Button>
          <div>
            <h2 className="text-3xl font-bold text-gray-900">
              Inscrições - {course?.name}
            </h2>
            <p className="text-gray-600 mt-1">
              Gerencie as inscrições do curso
            </p>
          </div>
        </div>

        {/* Course Info */}
        {course && (
          <div className="bg-green-50 border border-green-200 rounded-lg p-6 mb-8">
            <div className="flex items-center justify-between">
              <div>
                <h3 className="text-lg font-semibold text-green-800">{course.name}</h3>
                <p className="text-green-600 mt-1">{course.description}</p>
              </div>
              <div className="text-right">
                <p className="text-sm text-green-600">Vagas ocupadas</p>
                <p className="text-2xl font-bold text-green-800">
                  {course.enrollmentCount}/{course.maxSlots}
                </p>
              </div>
            </div>
          </div>
        )}

        {/* Filters */}
        <div className="flex items-center space-x-4 mb-6">
          <span className="text-sm font-medium text-gray-700">Filtrar por status:</span>
          <div className="flex space-x-2">
            {[
              { value: 'all', label: 'Todas' },
              { value: 'pending', label: 'Pendentes' },
              { value: 'approved', label: 'Aprovadas' },
              { value: 'rejected', label: 'Rejeitadas' }
            ].map((filterOption) => (
              <Button
                key={filterOption.value}
                variant={filter === filterOption.value ? 'default' : 'outline'}
                size="sm"
                onClick={() => setFilter(filterOption.value as any)}
                className={filter === filterOption.value ? 'bg-green-600' : ''}
              >
                {filterOption.label}
              </Button>
            ))}
          </div>
        </div>

        {/* Enrollments List */}
        <div className="space-y-4">
          {filteredEnrollments.map((enrollment) => (
            <Card key={enrollment.id}>
              <CardHeader>
                <div className="flex items-center justify-between">
                  <div className="flex items-center space-x-3">
                    {getStatusIcon(enrollment.status)}
                    <div>
                      <CardTitle className="text-lg">{enrollment.student.name}</CardTitle>
                      <p className="text-sm text-gray-600">
                        Inscrito em {new Date(enrollment.createdAt).toLocaleDateString('pt-BR')}
                      </p>
                    </div>
                  </div>
                  <span className={`px-3 py-1 rounded-full text-sm font-medium ${getStatusColor(enrollment.status)}`}>
                    {getStatusText(enrollment.status)}
                  </span>
                </div>
              </CardHeader>
              
              <CardContent>
                <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                  {/* Student Info */}
                  <div className="space-y-3">
                    <h4 className="font-medium text-gray-900">Informações do Aluno</h4>
                    <div className="space-y-2">
                      <div className="flex items-center space-x-2">
                        <Mail className="h-4 w-4 text-gray-500" />
                        <span className="text-sm">{enrollment.student.email}</span>
                      </div>
                      <div className="flex items-center space-x-2">
                        <Phone className="h-4 w-4 text-gray-500" />
                        <span className="text-sm">{enrollment.student.phone}</span>
                      </div>
                      <div className="flex items-center space-x-2">
                        <User className="h-4 w-4 text-gray-500" />
                        <span className="text-sm">CPF: {enrollment.student.cpf}</span>
                      </div>
                    </div>
                  </div>

                  {/* Actions */}
                  <div className="space-y-3">
                    <h4 className="font-medium text-gray-900">Ações</h4>
                    <div className="flex flex-wrap gap-2">
                      <Button
                        size="sm"
                        variant="outline"
                        className="flex items-center space-x-1"
                      >
                        <Eye className="h-3 w-3" />
                        <span>Ver Documentos</span>
                      </Button>
                      
                      <Button
                        size="sm"
                        variant="outline"
                        className="flex items-center space-x-1"
                      >
                        <Download className="h-3 w-3" />
                        <span>Baixar</span>
                      </Button>
                    </div>
                    
                    {enrollment.status === 'pending' && (
                      <div className="flex space-x-2 pt-2">
                        <Button
                          size="sm"
                          className="bg-green-600 hover:bg-green-700"
                          onClick={() => handleStatusChange(enrollment.id, 'approved')}
                        >
                          <CheckCircle className="h-3 w-3 mr-1" />
                          Aprovar
                        </Button>
                        <Button
                          size="sm"
                          variant="outline"
                          className="text-red-600 border-red-600 hover:bg-red-50"
                          onClick={() => handleStatusChange(enrollment.id, 'rejected')}
                        >
                          <XCircle className="h-3 w-3 mr-1" />
                          Rejeitar
                        </Button>
                      </div>
                    )}
                    
                    {enrollment.rejectionReason && (
                      <div className="mt-2 p-2 bg-red-50 border border-red-200 rounded">
                        <p className="text-sm text-red-800">
                          <strong>Motivo da rejeição:</strong> {enrollment.rejectionReason}
                        </p>
                      </div>
                    )}
                  </div>
                </div>
              </CardContent>
            </Card>
          ))}
        </div>

        {/* Empty State */}
        {filteredEnrollments.length === 0 && (
          <div className="text-center py-12">
            <FileText className="h-16 w-16 text-gray-400 mx-auto mb-4" />
            <h3 className="text-lg font-medium text-gray-900 mb-2">
              Nenhuma inscrição encontrada
            </h3>
            <p className="text-gray-600">
              {filter === 'all' 
                ? 'Este curso ainda não possui inscrições'
                : `Nenhuma inscrição com status "${filter}" encontrada`
              }
            </p>
          </div>
        )}
      </main>

      {/* Footer */}
      <footer className="bg-green-600 text-white px-6 py-6 rounded-t-3xl">
        <div className="max-w-7xl mx-auto text-center">
          <h3 className="text-lg font-medium mb-2">O que é?</h3>
          <div className="w-24 h-px bg-white mx-auto"></div>
        </div>
      </footer>
    </div>
  )
}
