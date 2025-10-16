import { useNavigate } from 'react-router-dom';
import { useProfessorsList } from '@/features/professores/hooks/useProfessorList';
import { Button } from '@/components/ui/Button';
import { Card, CardContent } from '@/components/ui/Card';
import { Plus, Users } from 'lucide-react';

export function ProfessoresPage() {
  const navigate = useNavigate();
  const { professors, loading } = useProfessorsList();

  if (loading) {
    return <div>Carregando professores...</div>;
  }

  return (
    <div className="space-y-6">
      <div className="flex items-center justify-between">
        <h1 className="text-3xl font-bold text-secondary-900">Professores</h1>
        <Button onClick={() => navigate('/professores/cadastrar')} className="flex items-center space-x-2">
          <Plus className="h-4 w-4" />
          <span>Cadastrar Professor</span>
        </Button>
      </div>

      {professors.length === 0 ? (
        <p>Nenhum professor cadastrado ainda.</p>
      ) : (
        <Card>
          <CardContent className="p-0">
            <div className="overflow-x-auto">
              <table className="min-w-full divide-y divide-gray-200">
                <thead className="bg-gray-50">
                  <tr>
                    <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Nome</th>
                    <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Email</th>
                    <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Cursos Ministrados</th>
                  </tr>
                </thead>
                <tbody className="bg-white divide-y divide-gray-200">
                  {professors.map((prof) => (
                    <tr 
                      key={prof.id} 
                      className="hover:bg-gray-50 cursor-pointer"
                      onClick={() => navigate(`/professores/${prof.id}`)}
                    >
                      <td className="px-6 py-4 whitespace-nowrap">
                        <div className="text-sm font-medium text-gray-900">
                          {prof.user.firstName} {prof.user.lastName}
                        </div>
                      </td>
                      <td className="px-6 py-4 whitespace-nowrap">
                        <div className="text-sm text-gray-500">{prof.user.email}</div>
                      </td>
                      <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-500">
                        {prof.totalCourses}
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