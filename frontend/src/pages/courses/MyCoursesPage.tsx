import { useNavigate } from 'react-router-dom';
import { useMyCourses } from '@/features/courses/hooks/useMyCourses';
import { useAuthStore } from '@/shared/stores/authStore';

// Imports de UI e Ícones
import { Button } from '@/components/ui/Button';
import { Logo } from '@/components/ui/Logo';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/shared/components/ui/Card';
import { 
  Plus, 
  BookOpen, 
  Clock, 
  CheckCircle, 
  XCircle,
  Users,
  Calendar,
  Edit,
  Trash2
} from 'lucide-react';
import toast from 'react-hot-toast';

export function MyCoursesPage() {
  const navigate = useNavigate();
  const { user, logout } = useAuthStore();
  
  // --- TODA A LÓGICA VEM DO NOSSO HOOK ---
  const { 
    courses, 
    loading, 
    selectedCourse, 
    setSelectedCourse 
  } = useMyCourses();

  // --- FUNÇÕES AUXILIARES DE UI ---

  const handleLogout = () => {
    logout();
    navigate('/login');
  };

  const getStatusText = (status: string) => {
    const statusMap: { [key: string]: string } = {
      'AGENDADO': 'Agendado',
      'INSCRIÇÕES ABERTAS': 'Inscrições Abertas',
      'EM ANDAMENTO': 'Em Andamento',
      'FINALIZADO': 'Finalizado',
      'CANCELADO': 'Cancelado',
    };
    return statusMap[status] || status;
  };

  const getStatusIcon = (status: string) => {
    switch (status) {
      case 'INSCRIÇÕES ABERTAS':
      case 'FINALIZADO':
        return <CheckCircle className="h-4 w-4 text-green-600" />;
      case 'AGENDADO':
        return <Clock className="h-4 w-4 text-yellow-600" />;
      case 'CANCELADO':
        return <XCircle className="h-4 w-4 text-red-600" />;
      default: // EM ANDAMENTO ou outros
        return <BookOpen className="h-4 w-4 text-blue-600" />;
    }
  };
  
  // --- RENDERIZAÇÃO ---

  if (loading) {
    return (
      <div className="min-h-screen bg-gray-50 flex items-center justify-center">
        <div className="text-center">
          <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-green-600 mx-auto mb-4"></div>
          <p className="text-gray-600">Carregando seus cursos...</p>
        </div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-gray-100">
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
            <button className="px-4 py-2 text-green-600 bg-white border border-white rounded-lg hover:bg-green-50 transition-colors" onClick={() => navigate('/professor-dashboard')}>Inicio</button>
            <button className="px-4 py-2 text-green-600 bg-white border border-white rounded-lg hover:bg-green-50 transition-colors" onClick={() => navigate('/my-courses')}>Meus cursos</button>
            <button className="px-4 py-2 text-green-600 bg-white border border-white rounded-lg hover:bg-green-50 transition-colors" onClick={handleLogout}>Sair</button>
          </nav>
        </div>
      </header>

      {/* Main Content */}
      <main className="bg-gray-100 min-h-screen px-6 py-8">
        <div className="max-w-7xl mx-auto">
          <div className="flex items-center justify-between mb-8">
            <div className="flex items-center space-x-2">
              <div className="w-2 h-2 bg-red-500 rounded-full"></div>
              <h2 className="text-2xl font-bold text-green-800">Seus Cursos</h2>
            </div>
            <Button className="bg-green-600 hover:bg-green-700 w-16 h-16 rounded-full flex items-center justify-center" onClick={() => navigate('/courses/create')}>
              <Plus className="h-8 w-8 text-white" />
            </Button>
          </div>

          {/* Grid de Cursos */}
          {courses.length > 0 ? (
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
              {courses.map((course) => (
                <div key={course.id} className="bg-white border-2 border-green-600 rounded-lg p-4 cursor-pointer hover:shadow-lg transition-shadow" onClick={() => setSelectedCourse(course)}>
                  <div className="w-full h-32 bg-gray-200 border border-green-600 rounded mb-4 flex items-center justify-center"><span className="text-gray-500 text-sm">Imagem do Curso</span></div>
                  <div className="space-y-2">
                    <h3 className="text-lg font-semibold text-green-800 truncate">{course.nome}</h3>
                    <p className="text-sm text-gray-600">Inscrições até: {new Date(course.dataFimInscricoes).toLocaleDateString('pt-BR')}</p>
                    <div className="flex items-center space-x-2">
                      {getStatusIcon(course.status)}
                      <span className="text-sm font-medium">{getStatusText(course.status)}</span>
                    </div>
                  </div>
                  <div className="flex justify-end mt-4"><div className="w-6 h-6 bg-green-600 rounded-full flex items-center justify-center text-white font-bold text-xs">i</div></div>
                </div>
              ))}
            </div>
          ) : (
            <div className="text-center py-12 bg-white rounded-lg border">
              <BookOpen className="h-16 w-16 text-gray-400 mx-auto mb-4" />
              <h3 className="text-lg font-medium text-gray-900 mb-2">Nenhum curso encontrado</h3>
              <p className="text-gray-600 mb-6">Parece que você ainda não criou nenhum curso.</p>
              <Button className="bg-green-600 hover:bg-green-700" onClick={() => navigate('/courses/create')}><Plus className="h-4 w-4 mr-2" />Criar Primeiro Curso</Button>
            </div>
          )}
        </div>
      </main>

      {/* Modal de Detalhes do Curso (Completo) */}
      {selectedCourse && (
        <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50" onClick={() => setSelectedCourse(null)}>
          <div className="bg-white rounded-lg border-4 border-green-600 p-6 max-w-2xl w-full mx-4" onClick={(e) => e.stopPropagation()}>
            <div className="flex justify-between items-start mb-4">
              <div>
                <h3 className="text-2xl font-bold text-green-800">{selectedCourse.nome}</h3>
                <p className="text-sm text-gray-600 mt-1">Gerenciar curso</p>
              </div>
              <button onClick={() => setSelectedCourse(null)} className="text-2xl font-bold text-green-600 hover:text-green-800">&times;</button>
            </div>
            <div className="mb-6"><p className="text-gray-700 text-sm leading-relaxed">{selectedCourse.descricao}</p></div>
            <div className="space-y-2 mb-6 text-green-800">
              <p><strong>Professor(a):</strong> {selectedCourse.criador.user.firstName} {selectedCourse.criador.user.lastName}</p>
              <p><strong>Período do Curso:</strong> {new Date(selectedCourse.dataInicioCurso).toLocaleDateString('pt-BR')} até {new Date(selectedCourse.dataFimCurso).toLocaleDateString('pt-BR')}</p>
              <p><strong>Vagas Internas:</strong> {selectedCourse.vagasInternas}</p>
              <p><strong>Vagas Externas:</strong> {selectedCourse.vagasExternas}</p>
            </div>
            <div className="border-t-2 border-green-600 mb-6" />
            <div className="space-y-3">
              <div className="flex space-x-4">
                <Button className="bg-green-600 hover:bg-green-700 flex-1" onClick={() => navigate(`/courses/${selectedCourse.id}/edit`)}>
                  <Edit className="h-4 w-4 mr-2" /> Editar Curso
                </Button>
                <Button variant="outline" className="border-red-600 text-red-600 hover:bg-red-50 flex-1" onClick={() => {
                  if (confirm('Tem certeza que deseja cancelar este curso? Esta ação não pode ser desfeita.')) {
                    // TODO: Chamar a store/service para deletar/cancelar o curso
                    toast.success('Curso cancelado!');
                    setSelectedCourse(null);
                  }
                }}>
                  <Trash2 className="h-4 w-4 mr-2" /> Cancelar Curso
                </Button>
              </div>
              <div className="flex space-x-4">
                <Button className="bg-blue-600 hover:bg-blue-700 flex-1" onClick={() => navigate(`/courses/${selectedCourse.id}/enrollments`)}>
                  <Users className="h-4 w-4 mr-2" /> Gerenciar Inscrições
                </Button>
              </div>
            </div>
          </div>
        </div>
      )}

      {/* Footer */}
      <footer className="bg-green-600 text-white px-6 py-6 rounded-t-3xl">
        <div className="max-w-7xl mx-auto text-center">
          <h3 className="text-lg font-medium mb-2">O que é?</h3>
          <div className="w-24 h-px bg-white mx-auto"></div>
        </div>
      </footer>
    </div>
  );
}