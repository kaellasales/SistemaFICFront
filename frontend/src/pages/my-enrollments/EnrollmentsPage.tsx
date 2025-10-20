import { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { useMyEnrollments } from '@/features/enrollments/hooks/useMyEnrollments';
import { Card, CardContent, CardHeader, CardTitle, CardDescription } from '@/components/ui/Card';
import { Button } from '@/components/ui/Button';
import { 
  FileText, 
  Clock, 
  CheckCircle, 
  XCircle, 
  Eye,
  Search,
  BookOpen,
  Users,
  Paperclip,
  AlertTriangle
} from 'lucide-react';
import { Enrollment } from '@/features/enrollments/types/enrollment.types';

export function EnrollmentsPage() {
  const navigate = useNavigate();
  
  // --- TODA A LÓGICA E DADOS VÊM DO HOOK ---
  const { 
    enrollments, 
    loading, 
    searchTerm, 
    setSearchTerm 
  } = useMyEnrollments();
  
  // O estado do modal continua sendo local da página
  const [viewingEnrollment, setViewingEnrollment] = useState<Enrollment | null>(null);

  const getStatusInfo = (status: string) => {
    const statusMap: { [key: string]: { text: string; icon: React.ElementType; color: string } } = {
      'AGUARDANDO_VALIDACAO': { text: 'Aguardando Validação', icon: Clock, color: 'bg-yellow-100 text-yellow-800' },
      'CONFIRMADA': { text: 'Inscrição Confirmada', icon: CheckCircle, color: 'bg-green-100 text-green-800' },
      'CANCELADA': { text: 'Rejeitada', icon: XCircle, color: 'bg-red-100 text-red-800' },
      'LISTA_ESPERA': { text: 'Lista de Espera', icon: Users, color: 'bg-blue-100 text-blue-800' },
    };
    return statusMap[status] || { text: status, icon: FileText, color: 'bg-gray-100 text-gray-800' };
  };

  if (loading) {
    return (
      <div className="flex justify-center items-center h-[calc(100vh-80px)]">
        <div className="text-center">
          <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-green-600 mx-auto mb-4"></div>
          <p className="text-gray-600">Carregando suas inscrições...</p>
        </div>
      </div>
    );
  }

  return (
    <div className="space-y-6">
      <div>
        <h1 className="text-3xl font-bold text-secondary-900">Minhas Inscrições</h1>
        <p className="text-secondary-600 mt-2">Acompanhe o status de todas as suas solicitações de matrícula.</p>
      </div>

      <Card>
        <CardContent className="p-4">
          <div className="relative">
            <Search className="absolute left-3 top-1/2 -translate-y-1/2 h-5 w-5 text-gray-400" />
            <input
              type="text"
              placeholder="Buscar por nome do curso..."
              value={searchTerm}
              onChange={(e) => setSearchTerm(e.target.value)}
              className="w-full pl-10 pr-4 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-green-500"
            />
          </div>
        </CardContent>
      </Card>

      {enrollments.length > 0 ? (
        <div className="space-y-4">
          {enrollments.map((enrollment) => {
            const statusInfo = getStatusInfo(enrollment.status);
            return (
              <Card key={enrollment.id} className="overflow-hidden">
                <CardContent className="p-4 flex flex-col sm:flex-row items-start sm:items-center justify-between gap-4">
                  <div className="flex items-center space-x-4 flex-1">
                    <div className="w-12 h-12 bg-gray-100 rounded-md flex-shrink-0 flex items-center justify-center">
                      <BookOpen className="h-6 w-6 text-gray-500" />
                    </div>
                    <div className="min-w-0">
                      <p className="font-semibold text-gray-800 truncate">{enrollment.curso.nome}</p>
                      <p className="text-xs text-gray-500">
                        Inscrição em: {new Date(enrollment.dataInscricao).toLocaleDateString('pt-BR')}
                      </p>
                    </div>
                  </div>
                  <div className="flex items-center space-x-4 w-full sm:w-auto justify-between mt-2 sm:mt-0">
                    <span className={`px-2.5 py-0.5 inline-flex text-xs leading-5 font-semibold rounded-full ${statusInfo.color}`}>
                      {statusInfo.text}
                    </span>
                    <Button variant="outline" size="sm" onClick={() => setViewingEnrollment(enrollment)}>
                      <Eye className="h-4 w-4 mr-1"/> Ver Dossiê
                    </Button>
                  </div>
                </CardContent>
              </Card>
            );
          })}
        </div>
      ) : (
        <div className="text-center py-16 bg-white rounded-lg border">
          <FileText className="h-16 w-16 text-gray-300 mx-auto mb-4" />
          <h3 className="text-lg font-medium text-gray-900 mb-2">Nenhuma inscrição encontrada</h3>
          <p className="text-gray-600 max-w-md mx-auto">
            {searchTerm 
              ? 'Não encontramos inscrições com os termos da sua busca.'
              : 'Você ainda não possui inscrições. Explore os cursos disponíveis!'
            }
          </p>
        </div>
      )}
      
      {/* Modal de Dossiê para o Aluno (AGORA COM O MOTIVO DA RECUSA) */}
      {viewingEnrollment && (
        <div className="fixed inset-0 bg-black bg-opacity-60 flex items-center justify-center z-50 p-4" onClick={() => setViewingEnrollment(null)}>
          <div className="bg-white rounded-lg shadow-xl max-w-lg w-full" onClick={(e) => e.stopPropagation()}>
            <CardHeader>
              <div className="flex justify-between items-start">
                <div>
                  <CardTitle>Dossiê da Inscrição</CardTitle>
                  <CardDescription>Curso: {viewingEnrollment.curso.nome}</CardDescription>
                </div>
                <button onClick={() => setViewingEnrollment(null)} className="text-gray-400 hover:text-gray-600 text-2xl">&times;</button>
              </div>
            </CardHeader>
            <CardContent className="space-y-4">
              <div>
                <p className="text-sm text-gray-500">Status da sua Inscrição</p>
                <p className={`font-semibold ${getStatusInfo(viewingEnrollment.status).color.replace('bg-', 'text-')}`}>{getStatusInfo(viewingEnrollment.status).text}</p>
              </div>

              {/* --- A MÁGICA ESTÁ AQUI --- */}
              {/* Mostra o motivo da recusa SE a inscrição foi cancelada */}
              {viewingEnrollment.status === 'CANCELADA' && viewingEnrollment.motivoRecusa && (
                <div className="p-3 bg-red-50 border border-red-200 text-red-800 rounded-lg">
                  <h4 className="font-semibold flex items-center text-sm">
                    <AlertTriangle className="h-4 w-4 mr-2" />
                    Motivo da Recusa
                  </h4>
                  <p className="text-sm mt-1">{viewingEnrollment.motivoRecusa}</p>
                </div>
              )}
              <div className="border-t pt-4">
                <h3 className="font-semibold text-gray-800 mb-2">Documentos Enviados</h3>
                {viewingEnrollment.documentos && viewingEnrollment.documentos.length > 0 ? (
                  <ul className="list-none pl-0 space-y-2 text-sm">
                    {viewingEnrollment.documentos.map(doc => (
                      <li key={doc.id}>
                        <a href={doc.arquivo} target="_blank" rel="noopener noreferrer" className="text-blue-600 hover:underline flex items-center">
                          <Paperclip className="h-4 w-4 mr-2" />
                          {doc.nomeOriginal}
                        </a>
                      </li>
                    ))}
                  </ul>
                ) : (
                  <p className="text-sm text-gray-500">Nenhum documento foi enviado nesta inscrição.</p>
                )}
              </div>
            </CardContent>
            <div className="p-4 bg-gray-50 border-t flex justify-end">
              <Button variant="outline" onClick={() => setViewingEnrollment(null)}>Fechar</Button>
            </div>
          </div>
        </div>
      )}
    </div>
  );
}