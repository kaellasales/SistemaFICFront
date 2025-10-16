import { useNavigate } from 'react-router-dom';
import { useCoursesList } from '@/features/courses/hooks/useCoursesList';
import { Card, CardContent } from '@/components/ui/Card';
import { BookOpen, Users } from 'lucide-react';

export function AdminCoursesPage() {
  const navigate = useNavigate();
  // Reutilizamos o mesmo hook, pois o backend já sabe que, para o CCA, deve enviar todos os cursos.
  const { courses, loading } = useCoursesList();

  if (loading) {
    return (
        <div className="flex justify-center items-center h-[calc(100vh-80px)]">
            <div className="text-center">
                <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-green-600 mx-auto mb-4"></div>
                <p className="text-gray-600">Carregando cursos...</p>
            </div>
        </div>
    );
  }

  return (
    <div className="space-y-6">
      <h1 className="text-3xl font-bold text-secondary-900">Gerenciar Cursos e Inscrições</h1>
      <p className="text-secondary-600 mt-2">Selecione um curso para ver e analisar todas as suas inscrições.</p>

      {courses.length === 0 ? (
        <div className="text-center py-16 bg-white rounded-lg border">
            <BookOpen className="h-16 w-16 text-gray-300 mx-auto mb-4" />
            <h3 className="text-lg font-medium text-gray-900 mb-2">Nenhum curso cadastrado no sistema</h3>
            <p className="text-gray-600 max-w-md mx-auto">
                Quando os professores criarem novos cursos, eles aparecerão aqui para você gerenciar.
            </p>
        </div>
      ) : (
        <Card>
          <CardContent className="p-0">
            <div className="overflow-x-auto">
              <table className="min-w-full divide-y divide-gray-200">
                <thead className="bg-gray-50">
                  <tr>
                    <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Nome do Curso</th>
                    <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Professor Criador</th>
                    <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Status</th>
                    <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Vagas (Internas/Externas)</th>
                  </tr>
                </thead>
                <tbody className="bg-white divide-y divide-gray-200">
                  {courses.map((course) => (
                    <tr 
                      key={course.id} 
                      className="hover:bg-gray-50 cursor-pointer"
                      onClick={() => navigate(`/courses/${course.id}/enrollments`)}
                    >
                      <td className="px-6 py-4 whitespace-nowrap">
                        <div className="text-sm font-medium text-gray-900">{course.nome}</div>
                        <div className="text-sm text-gray-500">{course.descricaoCurta}</div>
                      </td>
                      <td className="px-6 py-4 whitespace-nowrap">
                        <div className="text-sm text-gray-900">
                            {course.criador.user.firstName} {course.criador.user.lastName}
                        </div>
                      </td>
                      <td className="px-6 py-4 whitespace-nowrap">
                        <span className={`px-2 inline-flex text-xs leading-5 font-semibold rounded-full ${
                            course.status === 'INSCRIÇÕES ABERTAS' ? 'bg-green-100 text-green-800' :
                            course.status === 'AGENDADO' ? 'bg-yellow-100 text-yellow-800' :
                            'bg-gray-100 text-gray-800'
                        }`}>
                          {course.status}
                        </span>
                      </td>
                      <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-500">
                        {course.vagasInternas} / {course.vagasExternas}
                      </td>
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>
          </CardContent>
        </Card>
      )}
    </div>
  );
}