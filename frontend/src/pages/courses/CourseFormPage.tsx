import { useNavigate } from 'react-router-dom';
import { useCourseForm } from '@/features/courses/hooks/useCourseForm';
import { Button } from '@/components/ui/Button';
import { ValidatedInput } from '@/components/ui/ValidatedInput';
import { Card, CardContent, CardHeader, CardTitle, CardDescription } from '@/components/ui/Card';
import { ArrowLeft, Save } from 'lucide-react';
import { Textarea } from '@/components/ui/Textarea'; // A gente vai precisar deste componente

export function CourseFormPage() {
  const navigate = useNavigate();
  const { form, isLoading, isEditing, onSubmit } = useCourseForm();
  const { register, formState: { errors } } = form;

  // A condição de loading agora é mais simples e robusta
  if (isEditing && form.formState.isLoading) {
    return (
      <div className="flex justify-center items-center h-[calc(100vh-80px)]">
        <div className="text-center">
          <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-green-600 mx-auto mb-4"></div>
          <p className="text-gray-600">Carregando dados do curso...</p>
        </div>
      </div>
    );
  }

  return (
    <div className="space-y-6 max-w-4xl mx-auto py-8">
      <div className="flex items-center space-x-4">
        <Button variant="outline" onClick={() => navigate(-1)}>
          <ArrowLeft className="h-4 w-4 mr-2" />
          Voltar
        </Button>
        <div>
          <h1 className="text-3xl font-bold text-gray-900">
            {isEditing ? 'Editar Curso' : 'Criar Novo Curso'}
          </h1>
          <p className="text-gray-600 mt-1">
            {isEditing ? 'Atualize as informações do curso.' : 'Preencha os dados para criar um novo curso.'}
          </p>
        </div>
      </div>

      <Card>
        <CardContent className="p-6">
            <form onSubmit={onSubmit} className="space-y-8">
              
              {/* --- SEÇÃO DE INFORMAÇÕES BÁSICAS --- */}
              <div className="space-y-6">
                <ValidatedInput label="Nome do Curso" error={errors.nome} {...register('nome')} />
                
                <div className="space-y-1">
                  <label className="block text-sm font-medium text-gray-700">Descrição Curta (para os cards)</label>
                  <Textarea error={errors.descricaoCurta} {...register('descricaoCurta')} rows={2} />
                  {errors.descricaoCurta && <p className="text-red-500 text-xs mt-1">{errors.descricaoCurta.message as string}</p>}
                </div>
                
                <div className="space-y-1">
                  <label className="block text-sm font-medium text-gray-700">Descrição Completa</label>
                  <Textarea error={errors.descricao} {...register('descricao')} rows={5} />
                  {errors.descricao && <p className="text-red-500 text-xs mt-1">{errors.descricao.message as string}</p>}
                </div>
              </div>
              
              {/* --- SEÇÃO DE CONFIGURAÇÕES --- */}
              <div className="border-t pt-6 space-y-6">
                 <h3 className="text-lg font-medium text-gray-800">Configurações do Curso</h3>
                 <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
                    <ValidatedInput label="Carga Horária (horas)" type="number" error={errors.cargaHoraria} {...register('cargaHoraria')} />
                    <ValidatedInput label="Vagas Internas" type="number" error={errors.vagasInternas} {...register('vagasInternas')} />
                    <ValidatedInput label="Vagas Externas" type="number" error={errors.vagasExternas} {...register('vagasExternas')} />
                 </div>
              </div>
              
              {/* --- SEÇÃO DE DATAS --- */}
              <div className="border-t pt-6 space-y-6">
                <h3 className="text-lg font-medium text-gray-800">Datas Importantes</h3>
                <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                  <ValidatedInput label="Início das Inscrições" type="date" error={errors.dataInicioInscricoes} {...register('dataInicioInscricoes')} />
                  <ValidatedInput label="Fim das Inscrições" type="date" error={errors.dataFimInscricoes} {...register('dataFimInscricoes')} />
                  <ValidatedInput label="Início das Aulas" type="date" error={errors.dataInicioCurso} {...register('dataInicioCurso')} />
                  <ValidatedInput label="Fim das Aulas" type="date" error={errors.dataFimCurso} {...register('dataFimCurso')} />
                </div>
              </div>

              {/* --- SEÇÃO DE REQUISITOS --- */}
              <div className="border-t pt-6">
                 <label className="block text-sm font-medium text-gray-700">Requisitos (Opcional)</label>
                 <Textarea error={errors.requisitos} {...register('requisitos')} rows={3} placeholder="Ex: Conhecimento básico em lógica de programação."/>
                 {errors.requisitos && <p className="text-red-500 text-xs mt-1">{errors.requisitos.message as string}</p>}
              </div>
              
              <div className="flex justify-end pt-6 border-t">
                <Button type="submit" disabled={isLoading} className="bg-green-600 hover:bg-green-700">
                  <Save className="h-4 w-4 mr-2" />
                  {isLoading ? 'Salvando...' : (isEditing ? 'Salvar Alterações' : 'Criar Curso')}
                </Button>
              </div>
            </form>
        </CardContent>
      </Card>
    </div>
  );
}