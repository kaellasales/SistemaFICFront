import { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { Info, X } from 'lucide-react';
import { Logo } from '@/components/ui/Logo';
import { Button } from '@/components/ui/Button';

// Nossos "cérebros" e "gerentes"
import { useCoursesList } from '@/features/courses/hooks/useCoursesList';
import { Course } from '@/features/courses/types/course.types';
import { useAuthStore } from '@/shared/stores/authStore';

export function CoursesPage() {
  const navigate = useNavigate();
  const { logout } = useAuthStore();
  
  // --- TODA A LÓGICA DE DADOS (cursos, loading) VEM DO HOOK ---
  const { courses, loading } = useCoursesList();

  // O estado do modal continua sendo local da página, o que está perfeito
  const [selectedCourse, setSelectedCourse] = useState<Course | null>(null);

  const handleLogout = () => {
    logout();
    navigate('/login');
  };

  const handleCourseClick = (course: Course) => {
    setSelectedCourse(course);
  };

  const closeModal = () => {
    setSelectedCourse(null);
  };

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
                <div className="h-32 bg-gray-100 rounded-t-lg"></div>
                
                <div className="p-4 relative">
                  <h3 className="text-lg font-medium text-green-600 mb-2 truncate">{course.nome}</h3>
                  
                  <div className="space-y-1 text-sm text-gray-700">
                    <p>Inscrições até {new Date(course.dataFimInscricoes).toLocaleDateString('pt-BR')}</p>
                    <p className="font-semibold">{course.status}</p>
                  </div>
                  
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
              <h2 className="text-2xl font-bold text-green-600">{selectedCourse.nome}</h2>
              <button 
                onClick={closeModal}
                className="text-green-600 hover:text-green-800 transition-colors"
              >
                <X className="w-6 h-6" />
              </button>
            </div>

            {/* Conteúdo do modal */}
            <div className="p-6 space-y-6">
              <div>
                <p className="text-gray-700 leading-relaxed">
                  {selectedCourse.descricao}
                </p>
              </div>

              <div className="space-y-3">
                <div className="flex items-center text-sm"><span className="font-medium text-gray-600 w-32">Período:</span><span className="text-gray-800">{new Date(selectedCourse.dataInicioCurso).toLocaleDateString('pt-BR')} até {new Date(selectedCourse.dataFimCurso).toLocaleDateString('pt-BR')}</span></div>
                <div className="flex items-center text-sm"><span className="font-medium text-gray-600 w-32">Vagas Totais:</span><span className="text-gray-800">{selectedCourse.vagasInternas + selectedCourse.vagasExternas}</span></div>
                <div className="flex items-center text-sm"><span className="font-medium text-gray-600 w-32">Carga Horária:</span><span className="text-gray-800">{selectedCourse.cargaHoraria} horas</span></div>
                <div className="flex items-center text-sm"><span className="font-medium text-gray-600 w-32">Inscrições até:</span><span className="text-gray-800">{new Date(selectedCourse.dataFimInscricoes).toLocaleDateString('pt-BR')}</span></div>
                <div className="flex items-start text-sm"><span className="font-medium text-gray-600 w-32 shrink-0">Requisitos:</span><span className="text-gray-800">{selectedCourse.requisitos}</span></div>
              </div>
            </div>

            {/* Footer do modal */}
            <div className="p-6 border-t border-gray-200">
              <Button 
                className="w-full bg-green-600 text-white hover:bg-green-700"
                onClick={() => {
                  navigate('/enrollment', { state: { course: selectedCourse } });
                  closeModal();
                }}
              >
                Matricule-se
              </Button>
            </div>
          </div>
        </div>
      )}
    </div>
  );
}