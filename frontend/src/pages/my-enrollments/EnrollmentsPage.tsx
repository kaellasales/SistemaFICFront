import { useState, useEffect } from 'react'
import { FileText, Clock, CheckCircle, XCircle, Eye } from 'lucide-react'
import { useAuthStore } from '@/shared/stores/authStore'
import { enrollmentService, type EnrollmentResponse } from '@/shared/services/enrollmentService'

export function EnrollmentsPage() {
  const { user } = useAuthStore()
  const [searchTerm, setSearchTerm] = useState('')
  const [enrollments, setEnrollments] = useState<EnrollmentResponse[]>([])
  const [loading, setLoading] = useState(true)

  useEffect(() => {
    const loadEnrollments = async () => {
      try {
        const enrollmentsData = await enrollmentService.getMyEnrollments()
        setEnrollments(enrollmentsData)
      } catch (error) {
        console.error('Erro ao carregar inscrições:', error)
        // Em caso de erro, usar dados mockados
        setEnrollments(mockEnrollments)
      } finally {
        setLoading(false)
      }
    }
    
    loadEnrollments()
  }, [])

  // Mock data - em produção, viria da API
  const mockEnrollments: EnrollmentResponse[] = [
    {
      id: '1',
      course: { 
        id: '1',
        name: 'Programação Web com React',
        enrollmentEndDate: '15/03/2024',
        status: 'Disponível',
        description: 'Curso completo de programação web',
        startDate: '01/04/2024',
        endDate: '30/06/2024',
        vacancies: 30,
        schedule: 'Segunda a Quinta',
        classTime: '19:00 - 22:00',
        requirements: 'Conhecimento básico em programação'
      },
      student: { name: 'João Silva', email: 'joao@email.com' },
      status: 'pending' as const,
      createdAt: '2024-01-15',
      documents: 3,
    },
    {
      id: '2',
      course: { 
        id: '2',
        name: 'Design Gráfico Digital',
        enrollmentEndDate: '20/03/2024',
        status: 'Disponível',
        description: 'Curso de design gráfico digital',
        startDate: '01/04/2024',
        endDate: '30/06/2024',
        vacancies: 25,
        schedule: 'Terça e Quinta',
        classTime: '14:00 - 17:00',
        requirements: 'Conhecimento básico em informática'
      },
      student: { name: 'Maria Santos', email: 'maria@email.com' },
      status: 'under_review' as const,
      createdAt: '2024-01-14',
      documents: 2,
    },
    {
      id: '3',
      course: { 
        id: '3',
        name: 'Excel Avançado',
        enrollmentEndDate: '25/03/2024',
        status: 'Disponível',
        description: 'Curso de Excel avançado',
        startDate: '01/04/2024',
        endDate: '30/06/2024',
        vacancies: 20,
        schedule: 'Segunda e Quarta',
        classTime: '19:00 - 22:00',
        requirements: 'Conhecimento básico em Excel'
      },
      student: { name: 'Pedro Costa', email: 'pedro@email.com' },
      status: 'approved' as const,
      createdAt: '2024-01-10',
      documents: 4,
    },
    {
      id: '4',
      course: { 
        id: '4',
        name: 'Programação Web com React',
        enrollmentEndDate: '15/03/2024',
        status: 'Disponível',
        description: 'Curso completo de programação web',
        startDate: '01/04/2024',
        endDate: '30/06/2024',
        vacancies: 30,
        schedule: 'Segunda a Quinta',
        classTime: '19:00 - 22:00',
        requirements: 'Conhecimento básico em programação'
      },
      student: { name: 'Ana Lima', email: 'ana@email.com' },
      status: 'rejected' as const,
      createdAt: '2024-01-12',
      documents: 2,
      rejectionReason: 'Documentos incompletos',
    },
  ]

  const filteredEnrollments = enrollments.filter(enrollment =>
    enrollment.course.name.toLowerCase().includes(searchTerm.toLowerCase()) ||
    enrollment.student.name.toLowerCase().includes(searchTerm.toLowerCase()) ||
    enrollment.student.email.toLowerCase().includes(searchTerm.toLowerCase())
  )

  const getStatusColor = (status: string) => {
    switch (status) {
      case 'pending':
        return 'bg-yellow-100 text-yellow-800'
      case 'under_review':
        return 'bg-blue-100 text-blue-800'
      case 'approved':
        return 'bg-green-100 text-green-800'
      case 'rejected':
        return 'bg-red-100 text-red-800'
      default:
        return 'bg-gray-100 text-gray-800'
    }
  }

  const getStatusLabel = (status: string) => {
    switch (status) {
      case 'pending':
        return 'Pendente'
      case 'under_review':
        return 'Em Análise'
      case 'approved':
        return 'Aprovado'
      case 'rejected':
        return 'Reprovado'
      default:
        return status
    }
  }

  const getStatusIcon = (status: string) => {
    switch (status) {
      case 'pending':
        return <Clock className="h-4 w-4" />
      case 'under_review':
        return <FileText className="h-4 w-4" />
      case 'approved':
        return <CheckCircle className="h-4 w-4" />
      case 'rejected':
        return <XCircle className="h-4 w-4" />
      default:
        return <FileText className="h-4 w-4" />
    }
  }

  return (
    <div style={{ padding: '24px', backgroundColor: 'white', minHeight: '100vh' }}>
      <h1 style={{ fontSize: '24px', fontWeight: 'bold', marginBottom: '16px', color: 'black' }}>
        Inscrições
      </h1>
      <p style={{ color: '#666', marginBottom: '24px' }}>
        {user?.role === 'candidate' 
          ? 'Acompanhe o status das suas inscrições'
          : user?.role === 'professor'
          ? 'Gerencie as inscrições dos seus cursos'
          : 'Analise e gerencie todas as inscrições do sistema'
        }
      </p>

      {/* Campo de busca */}
      <div style={{ marginBottom: '24px' }}>
        <input
          type="text"
          placeholder="Buscar inscrições..."
          value={searchTerm}
          onChange={(e) => setSearchTerm(e.target.value)}
          style={{
            width: '100%',
            padding: '12px',
            border: '1px solid #ccc',
            borderRadius: '8px',
            fontSize: '16px'
          }}
        />
      </div>

      {/* Lista de inscrições */}
      {loading ? (
        <div style={{ textAlign: 'center', padding: '32px' }}>
          <p style={{ color: '#666' }}>Carregando inscrições...</p>
        </div>
      ) : (
        <div>
          {filteredEnrollments.map((enrollment) => (
          <div key={enrollment.id} style={{
            backgroundColor: 'white',
            border: '1px solid #e5e5e5',
            borderRadius: '8px',
            padding: '24px',
            marginBottom: '16px'
          }}>
              <div className="flex items-center justify-between">
                <div className="flex-1">
                  <div className="flex items-center space-x-3 mb-2">
                    {getStatusIcon(enrollment.status)}
                    <h3 className="text-lg font-semibold text-gray-900">
                      {enrollment.course.name}
                    </h3>
                    <span className={`px-2 py-1 rounded-full text-xs font-medium ${getStatusColor(enrollment.status)}`}>
                      {getStatusLabel(enrollment.status)}
                    </span>
                  </div>
                  
                  <div className="grid grid-cols-1 md:grid-cols-3 gap-4 text-sm text-gray-600">
                    <div>
                      <span className="font-medium">Candidato:</span> {enrollment.student.name}
                    </div>
                    <div>
                      <span className="font-medium">Email:</span> {enrollment.student.email}
                    </div>
                    <div>
                      <span className="font-medium">Data da Inscrição:</span> {new Date(enrollment.createdAt).toLocaleDateString('pt-BR')}
                    </div>
                  </div>
                  
                  {enrollment.rejectionReason && (
                    <div className="mt-2 p-2 bg-red-50 border border-red-200 rounded-md">
                      <p className="text-sm text-red-800">
                        <span className="font-medium">Motivo da reprovação:</span> {enrollment.rejectionReason}
                      </p>
                    </div>
                  )}
                </div>
                
                <div className="flex items-center space-x-2">
                  <div className="text-right text-sm text-gray-600">
                    <p>{enrollment.documents} documentos</p>
                  </div>
                  
                  <div className="flex space-x-2">
                    <button className="px-3 py-1 border border-gray-300 bg-white text-gray-700 rounded text-sm hover:bg-gray-50 transition-colors">
                      <Eye className="h-4 w-4 mr-1 inline" />
                      Ver
                    </button>
                    
                    {(user?.role === 'professor' || user?.role === 'admin') && enrollment.status === 'pending' && (
                      <>
                        <button className="px-3 py-1 bg-green-600 text-white rounded text-sm hover:bg-green-700 transition-colors">
                          <CheckCircle className="h-4 w-4 mr-1 inline" />
                          Aprovar
                        </button>
                        <button className="px-3 py-1 border border-red-300 text-red-600 rounded text-sm hover:bg-red-50 transition-colors">
                          <XCircle className="h-4 w-4 mr-1 inline" />
                          Reprovar
                        </button>
                      </>
                    )}
                  </div>
                </div>
              </div>
          </div>
          ))}
        </div>
      )}

      {filteredEnrollments.length === 0 && (
        <div className="text-center py-12">
          <FileText className="h-12 w-12 text-gray-400 mx-auto mb-4" />
          <h3 className="text-lg font-medium text-gray-900 mb-2">
            Nenhuma inscrição encontrada
          </h3>
          <p className="text-gray-600">
            {user?.role === 'candidate' 
              ? 'Você ainda não possui inscrições. Explore os cursos disponíveis!'
              : 'Não há inscrições que correspondam aos filtros aplicados.'
            }
          </p>
        </div>
      )}
    </div>
  )
}

