import { useState, useEffect } from 'react'
import { useNavigate } from 'react-router-dom'
import { Info, X } from 'lucide-react'
import { Logo } from '@/components/ui/Logo'
import { enrollmentService, type Course } from '@/shared/services/enrollmentService'


export function CoursesPage() {
  const navigate = useNavigate()
  const [selectedCourse, setSelectedCourse] = useState<Course | null>(null)
  const [courses, setCourses] = useState<Course[]>([])
  const [loading, setLoading] = useState(true)

  useEffect(() => {
    const loadCourses = async () => {
      try {
        const coursesData = await enrollmentService.getCourses()
        setCourses(coursesData)
      } catch (error) {
        console.error('Erro ao carregar cursos:', error)
        // Em caso de erro, usar dados mockados
        setCourses(mockCourses)
      } finally {
        setLoading(false)
      }
    }
    
    loadCourses()
  }, [])

  const handleLogout = () => {
    // Implementar logout
    navigate('/login')
  }

  // Mock data - em produção, viria da API
  const mockCourses: Course[] = [
    {
      id: '1',
      name: 'Programação Web com React',
      enrollmentEndDate: '15/03/2024',
      status: 'Disponível',
      description: 'Descrição do curso vai ser o espaço usado pra descrever o curso e aonde o professor vai poder dizer o que vai precisar para a inscrição. Este curso aborda os fundamentos do desenvolvimento web moderno utilizando React.',
      startDate: '01/04/2024',
      endDate: '30/06/2024',
      vacancies: 30,
      schedule: 'Seg / Ter / Qua',
      classTime: '19:00 às 22:00',
      requirements: 'Conhecimento básico em programação'
    },
    {
      id: '2',
      name: 'Design Gráfico Digital',
      enrollmentEndDate: '20/03/2024',
      status: 'Disponível',
      description: 'Curso completo de design gráfico digital, abordando ferramentas como Photoshop, Illustrator e InDesign. Ideal para iniciantes e profissionais que desejam aprimorar suas habilidades.',
      startDate: '05/04/2024',
      endDate: '05/07/2024',
      vacancies: 25,
      schedule: 'Qua / Qui / Sex',
      classTime: '14:00 às 17:00',
      requirements: 'Conhecimento básico em informática'
    },
    {
      id: '3',
      name: 'Excel Avançado',
      enrollmentEndDate: '25/03/2024',
      status: 'Disponível',
      description: 'Aprenda Excel do básico ao avançado, incluindo fórmulas complexas, macros, dashboards e automação. Perfeito para profissionais que trabalham com planilhas.',
      startDate: '10/04/2024',
      endDate: '10/07/2024',
      vacancies: 35,
      schedule: 'Sáb',
      classTime: '08:00 às 12:00',
      requirements: 'Conhecimento básico em informática'
    },
  ]

  const handleCourseClick = (course: Course) => {
    setSelectedCourse(course)
  }

  const closeModal = () => {
    setSelectedCourse(null)
  }

  return (
    <div className="min-h-screen bg-white">
      {/* Header - Seção verde escura */}
      <header className="bg-green-800 rounded-b-2xl px-6 py-4">
        <div className="max-w-7xl mx-auto flex items-center justify-between">
          {/* Logo e texto do Instituto */}
          <div className="flex items-center space-x-3">
            <div className="w-12 h-12 bg-white rounded-full flex items-center justify-center p-1">
              <Logo size="sm" />
            </div>
            <div className="text-white">
              <div className="text-sm font-medium">Instituto Federal de Educação</div>
              <div className="text-sm">Campus Ceará</div>
            </div>
          </div>

          {/* Botões de navegação */}
          <div className="flex items-center space-x-4">
            <button 
              onClick={() => navigate('/dashboard')}
              className="bg-white text-green-800 px-4 py-2 rounded-lg text-sm font-medium hover:bg-green-50 transition-colors"
            >
              Inicio
            </button>
            <button 
              onClick={() => navigate('/results')}
              className="bg-white text-green-800 px-4 py-2 rounded-lg text-sm font-medium hover:bg-green-50 transition-colors"
            >
              Resultados
            </button>
            <button 
              onClick={() => navigate('/student-data')}
              className="bg-white text-green-800 px-4 py-2 rounded-lg text-sm font-medium hover:bg-green-50 transition-colors"
            >
              Dados do aluno
            </button>
            <button 
              onClick={handleLogout}
              className="bg-white text-green-800 px-4 py-2 rounded-lg text-sm font-medium hover:bg-green-50 transition-colors"
            >
              Sair
            </button>
          </div>
        </div>
      </header>

      {/* Conteúdo principal */}
      <main className="px-6 py-8">
        <div className="max-w-7xl mx-auto">
          {/* Título da seção */}
          <div className="flex items-center mb-8">
            <div className="w-2 h-2 bg-red-500 rounded-full mr-3"></div>
            <h1 className="text-2xl font-bold text-green-600">Cursos</h1>
          </div>

          {/* Cards de cursos */}
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
          {loading ? (
            <div className="col-span-full text-center py-8">
              <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-green-600 mx-auto"></div>
              <p className="mt-4 text-gray-600">Carregando cursos...</p>
            </div>
          ) : (
            courses.map((course) => (
              <div 
                key={course.id} 
                className="bg-white border border-green-200 rounded-lg shadow-sm hover:shadow-md transition-shadow cursor-pointer"
                onClick={() => handleCourseClick(course)}
              >
                {/* Área superior vazia (para imagem/banner) */}
                <div className="h-32 bg-white rounded-t-lg"></div>
                
                {/* Conteúdo do card */}
                <div className="p-4 relative">
                  <h3 className="text-lg font-medium text-green-600 mb-2">{course.name}</h3>
                  
                  <div className="space-y-1 text-sm text-gray-700">
                    <p>inscrição até {course.enrollmentEndDate}</p>
                    <p>{course.status}</p>
                  </div>
                  
                  {/* Ícone de informação */}
                  <div className="absolute bottom-4 right-4 w-6 h-6 bg-green-600 rounded-full flex items-center justify-center hover:bg-green-700 transition-colors">
                    <Info className="w-3 h-3 text-white" />
                  </div>
                </div>
              </div>
            ))
          )}
        </div>
        </div>
      </main>

      {/* Modal de detalhes do curso */}
      {selectedCourse && (
        <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50 p-4">
          <div className="bg-white rounded-lg border-2 border-green-600 max-w-2xl w-full max-h-[90vh] overflow-y-auto">
            {/* Header do modal */}
            <div className="flex items-center justify-between p-6 border-b border-gray-200">
              <h2 className="text-2xl font-bold text-green-600">{selectedCourse.name}</h2>
              <button 
                onClick={closeModal}
                className="text-green-600 hover:text-green-800 transition-colors"
              >
                <X className="w-6 h-6" />
              </button>
            </div>

            {/* Conteúdo do modal */}
            <div className="p-6 space-y-6">
              {/* Descrição */}
              <div>
                <p className="text-gray-700 leading-relaxed">
                  {selectedCourse.description}
                </p>
              </div>

              {/* Informações do curso */}
              <div className="space-y-3">
                <div className="flex items-center text-sm">
                  <span className="font-medium text-gray-600 w-32">Período:</span>
                  <span className="text-gray-800">{selectedCourse.startDate} até {selectedCourse.endDate}</span>
                </div>
                
                <div className="flex items-center text-sm">
                  <span className="font-medium text-gray-600 w-32">Vagas:</span>
                  <span className="text-gray-800">{selectedCourse.vacancies}</span>
                </div>
                
                <div className="flex items-center text-sm">
                  <span className="font-medium text-gray-600 w-32">Dias:</span>
                  <span className="text-gray-800">{selectedCourse.schedule}</span>
                </div>
                
                <div className="flex items-center text-sm">
                  <span className="font-medium text-gray-600 w-32">Horário:</span>
                  <span className="text-gray-800">{selectedCourse.classTime}</span>
                </div>
                
                <div className="flex items-center text-sm">
                  <span className="font-medium text-gray-600 w-32">Inscrições até:</span>
                  <span className="text-gray-800">{selectedCourse.enrollmentEndDate}</span>
                </div>
                
                <div className="flex items-start text-sm">
                  <span className="font-medium text-gray-600 w-32">Requisitos:</span>
                  <span className="text-gray-800">{selectedCourse.requirements}</span>
                </div>
              </div>
            </div>

            {/* Footer do modal */}
            <div className="p-6 border-t border-gray-200">
              <button 
                className="w-full bg-green-600 text-white py-3 px-6 rounded-lg font-medium hover:bg-green-700 transition-colors"
                onClick={() => {
                  navigate('/enrollment', { state: { course: selectedCourse } })
                  closeModal()
                }}
              >
                Matricule-se
              </button>
            </div>
          </div>
        </div>
      )}
    </div>
  )
}

