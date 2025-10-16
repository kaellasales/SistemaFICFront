import { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { Info, X, Check } from 'lucide-react';
import { Logo } from '@/components/ui/Logo';
import { Button } from '@/components/ui/Button';
import { useCoursesList, EnrichedCourse } from '@/features/courses/hooks/useCoursesList';
import { useAuthStore } from '@/shared/stores/authStore';

export function CoursesPage() {
  const navigate = useNavigate();
  const { logout } = useAuthStore();
  
  const { courses, loading } = useCoursesList();

  const [selectedCourse, setSelectedCourse] = useState<EnrichedCourse | null>(null);

  const handleLogout = () => {
    logout();
    navigate('/login');
  };

  const handleCourseClick = (course: EnrichedCourse) => {
    setSelectedCourse(course);
  };

  const closeModal = () => {
    setSelectedCourse(null);
  };

  return (
    <div className="min-h-screen bg-white">

      {/* Conteúdo principal */}
      <main className="px-6 py-8">
        <div className="max-w-7xl mx-auto">
          <div className="flex items-center mb-8">
            <div className="w-2 h-2 bg-red-500 rounded-full mr-3"></div>
            <h1 className="text-2xl font-bold text-green-600">Cursos Disponíveis</h1>
          </div>

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
                  className="bg-white border border-green-200 rounded-lg shadow-sm hover:shadow-md transition-shadow cursor-pointer relative"
                  onClick={() => handleCourseClick(course)}
                >
                  {/* --- O SELO DE "INSCRITO" --- */}
                  {course.isEnrolled && (
                    <div className="absolute top-3 right-3 bg-blue-100 text-blue-800 text-xs font-bold px-2 py-1 rounded-full flex items-center z-10">
                      <Check className="h-4 w-4 mr-1" />
                      Inscrito
                    </div>
                  )}
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

      {/* Modal de detalhes do curso (inteligente) */}
      {selectedCourse && (
        <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50 p-4" onClick={closeModal}>
          <div className="bg-white rounded-lg border-2 border-green-600 max-w-2xl w-full max-h-[90vh] overflow-y-auto" onClick={(e) => e.stopPropagation()}>
            <div className="flex items-center justify-between p-6 border-b border-gray-200">
              <h2 className="text-2xl font-bold text-green-600">{selectedCourse.nome}</h2>
              <button onClick={closeModal} className="text-green-600 hover:text-green-800 transition-colors">
                <X className="w-6 h-6" />
              </button>
            </div>
            <div className="p-6 space-y-6">
              <div><p className="text-gray-700 leading-relaxed">{selectedCourse.descricao}</p></div>
              <div className="space-y-3">
                <div className="flex text-sm"><span className="font-medium text-gray-600 w-32">Período:</span><span className="text-gray-800">{new Date(selectedCourse.dataInicioCurso).toLocaleDateString('pt-BR')} até {new Date(selectedCourse.dataFimCurso).toLocaleDateString('pt-BR')}</span></div>
                <div className="flex text-sm"><span className="font-medium text-gray-600 w-32">Vagas Totais:</span><span className="text-gray-800">{selectedCourse.vagasInternas + selectedCourse.vagasExternas}</span></div>
                <div className="flex text-sm"><span className="font-medium text-gray-600 w-32">Carga Horária:</span><span className="text-gray-800">{selectedCourse.cargaHoraria} horas</span></div>
                <div className="flex text-sm"><span className="font-medium text-gray-600 w-32">Inscrições até:</span><span className="text-gray-800">{new Date(selectedCourse.dataFimInscricoes).toLocaleDateString('pt-BR')}</span></div>
                <div className="flex items-start text-sm"><span className="font-medium text-gray-600 w-32 shrink-0">Requisitos:</span><span className="text-gray-800">{selectedCourse.requisitos}</span></div>
              </div>
            </div>
            <div className="p-6 border-t border-gray-200">
              {/* --- O BOTÃO INTELIGENTE --- */}
              <Button 
                className="w-full"
                disabled={selectedCourse.isEnrolled}
                onClick={() => {
                  navigate('/enrollment', { state: { course: selectedCourse } });
                  closeModal();
                }}
              >
                {selectedCourse.isEnrolled ? 'Você já está inscrito' : 'Matricule-se'}
              </Button>
            </div>
          </div>
        </div>
      )}
    </div>
  );
}