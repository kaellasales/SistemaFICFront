import { useState, useEffect } from 'react';
import { Button } from '@/components/ui/Button';
import { CardHeader, CardTitle, CardDescription, CardContent } from '@/components/ui/Card';
import { 
  User, 
  FileText, 
  Paperclip, 
  CheckCircle, 
  XCircle,
  Home, // Ícone para endereço
  MapPin, // Ícone para naturalidade
  CreditCard // Ícone para documento
} from 'lucide-react';
import { Enrollment } from '../types/enrollment.types';
import { useAlunoStore } from '@/features/alunos/stores/useAlunoStore';
import { Aluno } from '@/features/alunos/types/aluno.types';
import toast from 'react-hot-toast';

interface Props {
  enrollment: Enrollment;
  onClose: () => void;
  onStatusChange: (enrollmentId: number, isApproved: boolean, reason?: string) => void;
  canAnalyze: boolean;
}

export function EnrollmentDossierModal({ enrollment, onClose, onStatusChange, canAnalyze}: Props) {
  const { fetchAlunoById } = useAlunoStore();
  const [detailedProfile, setDetailedProfile] = useState<Aluno | null>(null);
  const [isLoading, setIsLoading] = useState(true);
  const [rejectionReason, setRejectionReason] = useState('');
  const [showRejectionInput, setShowRejectionInput] = useState(false);


  useEffect(() => {
    if (enrollment?.aluno?.id) {
        setIsLoading(true);
        fetchAlunoById(enrollment.aluno.id)
            .then(setDetailedProfile)
            .catch(() => toast.error("Não foi possível carregar os detalhes do aluno."))
            .finally(() => setIsLoading(false));
    }
  }, [enrollment, fetchAlunoById]);

  const handleApprove = () => {
    onStatusChange(enrollment.id, true);
    onClose(); // Fecha o modal
  };
  const handleReject = () => {
    if (!rejectionReason.trim()) {
      toast.error("Por favor, informe o motivo da recusa.");
      return;
    }
    onStatusChange(enrollment.id, false, rejectionReason);
    onClose(); // Fecha o modal
  };


  return (
    <div className="fixed inset-0 bg-black bg-opacity-60 flex items-center justify-center z-50 p-4" onClick={onClose}>
      {/* <<< MUDANÇA 1: Aumentamos a largura do modal >>> */}
      <div className="bg-white rounded-lg shadow-xl max-w-4xl w-full" onClick={(e) => e.stopPropagation()}>
        <CardHeader>
          <div className="flex justify-between items-start">
            <div>
              <CardTitle>Dossiê do Candidato</CardTitle>
              <CardDescription>Análise da inscrição para o curso "{enrollment.curso.nome}"</CardDescription>
            </div>
            <button onClick={onClose} className="text-gray-400 hover:text-gray-600 text-2xl">&times;</button>
          </div>
        </CardHeader>
        <CardContent className="space-y-4 max-h-[75vh] overflow-y-auto">
          {isLoading ? <p>Carregando detalhes completos do aluno...</p> : (
            <>
              {/* <<< MUDANÇA 2: Seção de Dados Pessoais expandida >>> */}
              <div className="border rounded-lg p-4">
                <h3 className="font-semibold text-gray-800 mb-3 flex items-center"><User className="h-5 w-5 mr-2 text-gray-500"/> Dados Pessoais</h3>
                <div className="grid grid-cols-1 md:grid-cols-3 gap-x-6 gap-y-2 text-sm">
                  <div><strong>Nome:</strong> {detailedProfile?.user.firstName} {detailedProfile?.user.lastName}</div>
                  <div><strong>Email:</strong> {detailedProfile?.user.email}</div>
                  <div><strong>Celular:</strong> {detailedProfile?.telefoneCelular || 'Não informado'}</div>
                  <div><strong>Data de Nasc.:</strong> {detailedProfile?.dataNascimento ? new Date(detailedProfile.dataNascimento).toLocaleDateString('pt-BR') : 'Não informada'}</div>
                  <div><strong>Sexo:</strong> {detailedProfile?.sexo || 'Não informado'}</div>
                </div>
              </div>

              {/* <<< MUDANÇA 3: Nova seção para Documentos >>> */}
              <div className="border rounded-lg p-4">
                <h3 className="font-semibold text-gray-800 mb-3 flex items-center"><CreditCard className="h-5 w-5 mr-2 text-gray-500"/> Documentação</h3>
                <div className="grid grid-cols-1 md:grid-cols-3 gap-x-6 gap-y-2 text-sm">
                  <div><strong>CPF:</strong> {detailedProfile?.cpf || 'Não informado'}</div>
                  <div><strong>RG:</strong> {detailedProfile?.numeroIdentidade || 'Não informado'}</div>
                  <div><strong>Órgão Expedidor:</strong> {detailedProfile?.orgaoExpedidor || 'Não informado'} / {detailedProfile?.ufExpedidor?.uf || ''}</div>
                </div>
              </div>
              
              {/* <<< MUDANÇA 4: Nova seção para Endereço e Origem >>> */}
               <div className="border rounded-lg p-4">
                <h3 className="font-semibold text-gray-800 mb-3 flex items-center"><Home className="h-5 w-5 mr-2 text-gray-500"/> Endereço e Naturalidade</h3>
                <div className="grid grid-cols-1 md:grid-cols-2 gap-x-6 gap-y-2 text-sm">
                  <div><strong>Endereço:</strong> {`${detailedProfile?.logradouro || ''}, ${detailedProfile?.numeroEndereco || 'S/N'} - ${detailedProfile?.bairro || ''}`}</div>
                  <div><strong>CEP:</strong> {detailedProfile?.cep || 'Não informado'}</div>
                  <div><strong>Cidade/UF:</strong> {detailedProfile?.cidade?.nome || 'Não informado'} / {detailedProfile?.cidade?.estado?.uf || ''}</div>
                  <div><strong>Naturalidade:</strong> {detailedProfile?.naturalidade?.nome || 'Não informado'} / {detailedProfile?.naturalidade?.estado?.uf || ''}</div>
                </div>
              </div>

              {/* Seção de Documentos Enviados */}
              <div className="border rounded-lg p-4">
                <h3 className="font-semibold text-gray-800 mb-3 flex items-center"><FileText className="h-5 w-5 mr-2 text-gray-500"/> Documentos Anexados</h3>
                {enrollment.documentos?.length > 0 ? (
                  <ul className="space-y-2 text-sm">
                    {enrollment.documentos.map(doc => (
                      <li key={doc.id}>
                        <a href={doc.arquivo} target="_blank" rel="noopener noreferrer" className="text-blue-600 hover:underline flex items-center">
                          <Paperclip className="h-4 w-4 mr-2" />
                          {doc.nomeOriginal}
                        </a>
                      </li>
                    ))}
                  </ul>
                ) : <p className="text-sm text-gray-500">Nenhum documento foi enviado nesta inscrição.</p>}
              </div>
              
 {showRejectionInput && (
                <div className="border-t pt-4">
                  <label htmlFor="rejectionReason" className="block text-sm font-medium text-gray-700">Motivo da Recusa (Obrigatório)</label>
                  <textarea
                    id="rejectionReason"
                    value={rejectionReason}
                    onChange={(e) => setRejectionReason(e.target.value)}
                    className="mt-1 block w-full border border-gray-300 rounded-md p-2 focus:ring-green-500 focus:border-green-500"
                    rows={3}
                    placeholder="Ex: Documentação incompleta (RG ilegível)."
                  />
                  <p className="text-xs text-gray-500 mt-1">Este motivo poderá ser visualizado pelo aluno.</p>
                </div>
              )}
            </>
          )}
        </CardContent>
  {enrollment.status === 'AGUARDANDO_VALIDACAO' && !isLoading && (
            <div className="p-4 bg-gray-50 border-t flex justify-end space-x-3">
              {!showRejectionInput ? (
                  <>
                      <Button variant="destructive" onClick={() => setShowRejectionInput(true)} disabled={!canAnalyze} title={!canAnalyze ? 'A análise só está disponível após o fim das inscrições.' : 'Recusar inscrição'}>
                          <XCircle className="h-4 w-4 mr-2"/> Recusar
                      </Button>
                      <Button className="bg-green-600 text-white hover:bg-green-700" onClick={handleApprove} disabled={!canAnalyze} title={!canAnalyze ? 'A análise só está disponível após o fim das inscrições.' : 'Aprovar inscrição'}>
                          <CheckCircle className="h-4 w-4 mr-2"/> Aprovar
                      </Button>
                  </>
              ) : (
                  <>
                      <Button variant="outline" onClick={() => setShowRejectionInput(false)}>Cancelar</Button>
                      <Button variant="destructive" onClick={handleReject}>Confirmar Recusa</Button>
                  </>
              )}
            </div>
          )}
        </div>
      </div>
    );
}