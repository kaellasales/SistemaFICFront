import { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { useCourseEnrollments } from '@/features/enrollments/hooks/useCourseEnrollments';
import { Button } from '@/components/ui/Button';
import { Card, CardContent, CardHeader, CardTitle, CardDescription } from '@/components/ui/Card';
import { 
  ArrowLeft, CheckCircle, XCircle, Clock, User, FileText, Paperclip, Users 
} from 'lucide-react';
import { Enrollment } from '@/features/enrollments/types/enrollment.types';
import { EnrollmentDossierModal } from '@/features/enrollments/components/EnrollmentDossierModal';

// --- Componente Auxiliar para a Tabela (para não repetir código) ---
const EnrollmentTable = ({ title, enrollments, onAnalyzeClick }: { title: string, enrollments: Enrollment[], onAnalyzeClick: (e: Enrollment) => void }) => {
  const getStatusInfo = (status: string) => {
    const statusMap: { [key: string]: { text: string; color: string } } = {
        'CONFIRMADA': { text: 'Aprovado', color: 'bg-green-100 text-green-800' },
        'CANCELADA': { text: 'Rejeitado', color: 'bg-red-100 text-red-800' },
        'AGUARDANDO_VALIDACAO': { text: 'Pendente', color: 'bg-yellow-100 text-yellow-800' },
        'LISTA_ESPERA': { text: 'Lista de Espera', color: 'bg-blue-100 text-blue-800' },
    };
    return statusMap[status] || { text: status, color: 'bg-gray-100 text-gray-800' };
  };

  if (enrollments.length === 0) {
    return (
        <div className="p-4 border rounded-md text-center text-gray-500">
            <p>Nenhuma inscrição para {title.toLowerCase()}.</p>
        </div>
    );
  }

  return (
    <Card>
      <CardHeader>
        <CardTitle className="flex items-center">
          <Users className="h-5 w-5 mr-3 text-gray-500" />
          {title} ({enrollments.length})
        </CardTitle>
      </CardHeader>
      <CardContent className="p-0">
        <div className="overflow-x-auto">
          <table className="min-w-full divide-y divide-gray-200">
            <thead className="bg-gray-50">
              <tr>
                <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase">Aluno</th>
                <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase">Data</th>
                <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase">Status</th>
                <th className="px-6 py-3 text-right text-xs font-medium text-gray-500 uppercase">Ações</th>
              </tr>
            </thead>
            <tbody className="bg-white divide-y divide-gray-200">
              {enrollments.map((enrollment) => (
                <tr key={enrollment.id}>
                  <td className="px-6 py-4 whitespace-nowrap">
                    <div className="font-medium text-gray-900">{enrollment.aluno.user.firstName} {enrollment.aluno.user.lastName}</div>
                    <div className="text-sm text-gray-500">{enrollment.aluno.user.email}</div>
                  </td>
                  <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-500">{new Date(enrollment.dataInscricao).toLocaleDateString('pt-BR')}</td>
                  <td className="px-6 py-4 whitespace-nowrap">
                    <span className={`px-2 inline-flex text-xs leading-5 font-semibold rounded-full ${getStatusInfo(enrollment.status).color}`}>
                      {getStatusInfo(enrollment.status).text}
                    </span>
                  </td>
                  <td className="px-6 py-4 whitespace-nowrap text-right text-sm font-medium">
                    <Button variant="outline" size="sm" onClick={() => onAnalyzeClick(enrollment)}>
                      Analisar Dossiê
                    </Button>
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      </CardContent>
    </Card>
  );
};


export function CourseEnrollmentsPage() {
  const navigate = useNavigate();
  const {
    course,
    enrollments, // A lista já filtrada pelo hook
    courseEnrollments, // A lista original para as contagens
    loading,
    statusFilter,
    setStatusFilter,
    vagaFilter,
    setVagaFilter,
    handleStatusChange,
  } = useCourseEnrollments();
  
  const [viewingEnrollment, setViewingEnrollment] = useState<Enrollment | null>(null);

  if (loading || !course) {
    return (
        <div className="flex justify-center items-center h-[calc(100vh-80px)]">
            <div className="text-center">
                <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-green-600 mx-auto mb-4"></div>
                <p className="text-gray-600">Carregando inscrições...</p>
            </div>
        </div>
    );
  }
  
  const countAll = courseEnrollments.length;
  const countInternal = courseEnrollments.filter(e => e.tipoVaga === 'INTERNO').length;
  const countExternal = courseEnrollments.filter(e => e.tipoVaga === 'EXTERNO').length;
  const countPending = courseEnrollments.filter(e => e.status === 'AGUARDANDO_VALIDACAO').length;

  return (
    <div className="space-y-6">
      <div className="flex items-center space-x-4">
        <Button variant="outline" onClick={() => navigate(-1)}>
          <ArrowLeft className="h-4 w-4 mr-2" />
          Voltar
        </Button>
        <div>
            <h1 className="text-3xl font-bold text-gray-900">Análise de Inscrições</h1>
            <p className="text-gray-600 mt-1">Curso: {course.nome}</p>
        </div>
      </div>

      <Card>
        <CardContent className="p-4 flex flex-col md:flex-row gap-4 items-center">
            <div className="flex items-center space-x-3">
                <span className="text-sm font-medium text-gray-700">Filtrar por Vaga:</span>
                <div className="flex space-x-2">
                    <Button size="sm" variant={vagaFilter === 'all' ? 'default' : 'outline'} onClick={() => setVagaFilter('all')} className={vagaFilter === 'all' ? 'bg-green-600' : ''}>Todas ({countAll})</Button>
                    <Button size="sm" variant={vagaFilter === 'INTERNO' ? 'default' : 'outline'} onClick={() => setVagaFilter('INTERNO')} className={vagaFilter === 'INTERNO' ? 'bg-green-600' : ''}>Internas ({countInternal})</Button>
                    <Button size="sm" variant={vagaFilter === 'EXTERNO' ? 'default' : 'outline'} onClick={() => setVagaFilter('EXTERNO')} className={vagaFilter === 'EXTERNO' ? 'bg-green-600' : ''}>Externas ({countExternal})</Button>
                </div>
            </div>
            <div className="border-l h-6 hidden md:block"></div>
            <div className="flex items-center space-x-3">
                <span className="text-sm font-medium text-gray-700">Filtrar por Status:</span>
                <div className="flex space-x-2">
                    <Button size="sm" variant={statusFilter === 'all' ? 'default' : 'outline'} onClick={() => setStatusFilter('all')} className={statusFilter === 'all' ? 'bg-green-600' : ''}>Todos</Button>
                    <Button size="sm" variant={statusFilter === 'AGUARDANDO_VALIDACAO' ? 'default' : 'outline'} onClick={() => setStatusFilter('AGUARDANDO_VALIDACAO')} className={statusFilter === 'AGUARDANDO_VALIDACAO' ? 'bg-green-600' : ''}>Pendentes ({countPending})</Button>
                </div>
            </div>
        </CardContent>
      </Card>
      
      {enrollments.length === 0 ? (
        <div className="text-center text-gray-500 py-10 bg-white border rounded-lg">
            <FileText className="h-12 w-12 mx-auto text-gray-300 mb-4" />
            <h3 className="text-lg font-semibold">Nenhuma inscrição encontrada</h3>
            <p>Não há inscrições que correspondam aos filtros selecionados.</p>
        </div>
      ) : (
        <EnrollmentTable title="Inscrições Filtradas" enrollments={enrollments} onAnalyzeClick={setViewingEnrollment} />
      )}

      {viewingEnrollment && (
        <EnrollmentDossierModal 
          enrollment={viewingEnrollment}
          onClose={() => setViewingEnrollment(null)}
          onStatusChange={handleStatusChange}
        />
      )}
    </div>
  );
}