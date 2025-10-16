import { useNavigate } from 'react-router-dom';
import { useProfessorDetail } from '@/features/professores/hooks/useProfessorDetail';
import { Card, CardContent, CardHeader, CardTitle, CardDescription } from '@/components/ui/Card';
import { Button } from '@/components/ui/Button';
import { BookOpen, Edit, ArrowLeft, CheckCircle, Clock } from 'lucide-react';

export function ProfessorDetailPage() {
  const navigate = useNavigate();
  const { professor, loading } = useProfessorDetail();

  // Função auxiliar para os ícones de status dos cursos
  const getStatusIcon = (status: string) => {
    switch (status) {
      case 'FINALIZADO':
        return <CheckCircle className="h-4 w-4 text-green-600" />;
      case 'AGENDADO':
        return <Clock className="h-4 w-4 text-yellow-600" />;
      default: // EM ANDAMENTO, INSCRIÇÕES ABERTAS
        return <BookOpen className="h-4 w-4 text-blue-600" />;
    }
  };

  if (loading) {
    return <div className="flex items-center justify-center min-h-screen">Carregando...</div>;
  }

  if (!professor) {
    return (
      <div className="p-6 text-center">
        <p>Professor não encontrado.</p>
        <Button onClick={() => navigate('/professores')} className="mt-4">Voltar para Lista</Button>
      </div>
    );
  }

  return (
    <div className="space-y-6">
      {/* --- O NOVO CABEÇALHO UNIFICADO --- */}
      <div className="flex items-center justify-between">
        <div className="flex items-center space-x-4">
        <Button variant="outline" onClick={() => navigate(-1)}>
          <ArrowLeft className="h-4 w-4 mr-2" />
          Voltar
        </Button>
          <div>
            <h1 className="text-3xl font-bold text-gray-900">Detalhes do Professor</h1>
            <p className="text-gray-600 mt-1">Visualize e gerencie as informações e cursos do professor.</p>
          </div>
        </div>
<Button onClick={() => {
    // <<< O ESPIÃO DO CLIQUE >>>
    console.log(`[DetailPage] Clicou para editar. ID do professor: ${professor.id}`);
    navigate(`/professores/${professor.id}/edit`);
}} className="bg-green-600 hover:bg-green-700">
    <Edit className="h-4 w-4 mr-2" />
    Editar Professor
</Button>
      </div>

      {/* --- Card de Informações do Professor (sem mudanças) --- */}
      <Card>
        <CardHeader>
          <CardTitle>{professor.user.firstName} {professor.user.lastName}</CardTitle>
          <CardDescription>{professor.user.email}</CardDescription>
        </CardHeader>
        <CardContent>
            <p className="text-sm text-gray-600"><strong>SIAPE:</strong> {professor.siape}</p>
            <p className="text-sm text-gray-600"><strong>CPF:</strong> {professor.cpf}</p>
        </CardContent>
      </Card>

      {/* --- Seção de Cursos Ministrados (sem mudanças na estrutura) --- */}
      <h2 className="text-2xl font-bold text-secondary-900 pt-4 border-t">Cursos Ministrados</h2>
      {professor.cursosCriados.length === 0 ? (
        <p>Este professor ainda não possui cursos cadastrados.</p>
      ) : (
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
          {professor.cursosCriados.map((curso) => (
            <Card key={curso.id}>
              <CardHeader>
                <CardTitle>{curso.nome}</CardTitle>
              </CardHeader>
              <CardContent className="flex items-center space-x-2">
                {getStatusIcon(curso.status)}
                <span className="font-medium text-sm">{curso.status.replace('_', ' ')}</span>
              </CardContent>
            </Card>
          ))}
        </div>
      )}
    </div>
  );
}