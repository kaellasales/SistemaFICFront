import { useNavigate } from 'react-router-dom';
import { useEnrollmentForm } from '@/features/enrollments/hooks/useEnrollmentForm';
import { Button } from '@/components/ui/Button';
import { ValidatedInput } from '@/components/ui/ValidatedInput';
import { FileUpload } from '@/components/ui/FileUpload';
import { ArrowLeft, ArrowRight } from 'lucide-react';
import { Card, CardContent } from '@/components/ui/Card';

export function EnrollmentPage() {
  const {
    course, currentStep, totalSteps, formData, loading, isSubmitting,
    uploadedFiles, setUploadedFiles, // Ela já pedia isso!
    handleInputChange, nextStep, prevStep, handleSubmit
  } = useEnrollmentForm();

  const renderStepContent = () => {
    if (loading) {
      return (
        <div className="text-center py-8">
          <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-green-600 mx-auto"></div>
          <p className="mt-4 text-gray-600">Carregando seus dados...</p>
        </div>
      );
    }
    
    switch (currentStep) {
      // --- PASSO 1: TODOS OS DADOS E TIPO DE VAGA ---
      case 1:
        return (
          <div className="space-y-8">
            <div>
              <h3 className="text-xl font-semibold text-green-800">Confirme seus Dados</h3>
              <p className="text-gray-600 mt-1">Seus dados de perfil foram preenchidos automaticamente. Se precisar alterar, vá para a página de perfil.</p>
              
              <div className="mt-4 space-y-4 p-4 border rounded-md bg-gray-50">
                <h4 className="font-semibold text-gray-700">Dados Pessoais</h4>
                <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                    <ValidatedInput label="Nome" value={`${formData.user?.firstName || ''} ${formData.user?.lastName || ''}`} readOnly />
                    <ValidatedInput label="CPF" value={formData.cpf || ''} readOnly />
                    <ValidatedInput label="Email" value={formData.user?.email || ''} readOnly />
                    <ValidatedInput label="Celular" value={formData.telefoneCelular || ''} readOnly />
                </div>
                <h4 className="font-semibold text-gray-700 pt-4 border-t">Endereço</h4>
                <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                    <ValidatedInput label="Logradouro" value={`${formData.logradouro || ''}, ${formData.numeroEndereco || 'S/N'}`} readOnly />
                    <ValidatedInput label="Bairro" value={formData.bairro || ''} readOnly />
                    <ValidatedInput label="Cidade/UF" value={`${formData.cidade?.nome || ''} - ${formData.cidade?.estado?.uf || ''}`} readOnly />
                    <ValidatedInput label="CEP" value={formData.cep || ''} readOnly />
                </div>
              </div>
            </div>

            <div className="border-t pt-6">
              <h4 className="text-md font-medium text-gray-900">Selecione o Tipo de Vaga</h4>
              <div className="flex flex-col space-y-3 mt-2">
                  <label className={`flex items-center p-3 border rounded-lg cursor-pointer ${formData.tipoVaga === 'INTERNO' ? 'border-green-600 bg-green-50' : 'border-gray-300'}`}>
                      <input type="radio" name="tipoVaga" value="INTERNO" checked={formData.tipoVaga === 'INTERNO'} onChange={(e) => handleInputChange('tipoVaga', e.target.value)} className="h-4 w-4"/>
                      <span className="ml-3 text-sm font-medium">Vaga Interna (Aluno ou Servidor IFCE)</span>
                  </label>
                  <label className={`flex items-center p-3 border rounded-lg cursor-pointer ${formData.tipoVaga === 'EXTERNO' ? 'border-green-600 bg-green-50' : 'border-gray-300'}`}>
                      <input type="radio" name="tipoVaga" value="EXTERNO" checked={formData.tipoVaga === 'EXTERNO'} onChange={(e) => handleInputChange('tipoVaga', e.target.value)} className="h-4 w-4"/>
                      <span className="ml-3 text-sm font-medium">Vaga Externa (Comunidade em Geral)</span>
                  </label>
              </div>
            </div>

            <div className="border-t pt-6">
              <ValidatedInput 
                label="Matrícula / SIAPE"
                value={formData.matricula || ''}
                onChange={(e) => handleInputChange('matricula', e.target.value)}
                placeholder="Obrigatório para Vaga Interna"
                disabled={formData.tipoVaga !== 'INTERNO'}
              />
            </div>
          </div>
        );
        
      // --- PASSO 2: DOCUMENTOS (PARA TODOS) ---
      case 2:
        return (
            <div className="space-y-6">
                <h3 className="text-xl font-semibold text-green-800">Envio de Documentos</h3>
                {formData.tipoVaga === 'INTERNO' ? (
                    <p className="text-gray-600">Anexe um comprovante de matrícula ou de vínculo como servidor.</p>
                ) : (
                    <p className="text-gray-600">Por favor, faça o upload dos documentos obrigatórios.</p>
                )}
               <FileUpload

                        onFilesChange={(files) => handleInputChange('uploadedFiles', files)}
                        acceptedTypes=".pdf,.jpg,.jpeg,.png" maxFiles={5} maxSize={10}
                    />
                <ul className="list-disc list-inside text-sm text-gray-600 space-y-1 pt-2">
                    {formData.tipoVaga === 'INTERNO' ? (
                        <li>Comprovante de Matrícula ou Vínculo</li>
                    ) : (
                        <>
                            <li>Cópia do RG e CPF</li>
                            <li>Cópia do Comprovante de endereço</li>
                            <li>Se os <b>requisitos</b> do curso exigir algum certificado anexe-o aqui também</li>
                        </>
                    )}
                </ul>
            </div>
        );
        
      // --- PASSO 3: CONFIRMAÇÃO FINAL ---
      case 3:
        return (
          <div className="space-y-6">
            <div className="text-center"><h3 className="text-lg font-medium">Confirmação da Inscrição</h3></div>
            <div className="bg-gray-50 rounded-lg p-6">
              <h4 className="font-medium text-gray-900 mb-4">Resumo:</h4>
              <div className="space-y-2 text-sm">
                <div className="flex justify-between"><span>Curso:</span><span className="font-medium">{course?.nome}</span></div>
                <div className="flex justify-between"><span>Aluno:</span><span className="font-medium">{formData.user?.firstName} {formData.user?.lastName}</span></div>
                <div className="flex justify-between"><span>Tipo de Vaga:</span><span className="font-medium">{formData.tipoVaga}</span></div>
                {formData.matricula && <div className="flex justify-between"><span>Matrícula/SIAPE:</span><span className="font-medium">{formData.matricula}</span></div>}
                {formData.tipoVaga === 'EXTERNO' && <div className="flex justify-between"><span>Documentos:</span><span className="font-medium">{formData.uploadedFiles?.length || 0} arquivo(s)</span></div>}
              </div>
            </div>
            <div className="bg-yellow-50 border ..."><p className="text-sm ..."><strong>Atenção:</strong> Sua inscrição será enviada para análise.</p></div>
          </div>
        );
      
      default:
        return null;
    }
  };

  if (!course && !loading) { return <div>Curso não encontrado...</div>; }

  return (
    <div className="min-h-screen bg-white">
      <header className="bg-green-800 rounded-b-2xl px-6 py-4">
        {/* ... seu header aqui ... */}
      </header>
      <main className="px-6 py-8">
        <div className="max-w-4xl mx-auto">
          <div className="text-center mb-8">
            <h1 className="text-2xl font-bold text-green-600">Inscrição no Curso: {course?.nome}</h1>
            <p className="text-gray-600">Siga os passos para completar sua inscrição.</p>
          </div>
          <Card><CardContent className="p-8">{renderStepContent()}</CardContent></Card>
          <div className="flex items-center justify-between mt-8">
            <Button onClick={prevStep} disabled={currentStep === 1 || isSubmitting} variant="outline"><ArrowLeft className="w-4 h-4 mr-2"/> Anterior</Button>
            <div className="flex items-center space-x-2">
              {Array.from({ length: totalSteps }, (_, i) => (<div key={i} className={`w-3 h-3 rounded-full ${i + 1 === currentStep ? 'bg-red-500' : i + 1 < currentStep ? 'bg-green-500' : 'bg-gray-300'}`} />))}
            </div>
            {currentStep < totalSteps ? (
              <Button onClick={nextStep} disabled={isSubmitting} className="bg-green-600 hover:bg-green-700">Próximo <ArrowRight className="w-4 h-4 ml-2"/></Button>
            ) : (
              <Button onClick={handleSubmit} disabled={isSubmitting} className="bg-green-600 hover:bg-green-700">{isSubmitting ? 'Enviando...' : 'Confirmar Inscrição'}</Button>
            )}
          </div>
        </div>
      </main>
    </div>
  );
}