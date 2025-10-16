import { useNavigate } from 'react-router-dom';
import { useProfessorForm } from '@/features/professores/hooks/useProfessorForm';
import { Button } from '@/components/ui/Button';
import { ValidatedInput } from '@/components/ui/ValidatedInput';
import { Card, CardContent, CardHeader, CardTitle, CardDescription } from '@/components/ui/Card';
import { ArrowLeft, Save } from 'lucide-react';

export function ProfessorFormPage() {
  const navigate = useNavigate();
  // --- TODA A LÓGICA VEM DO NOSSO HOOK INTELIGENTE ---
  const { form, loading, isEditing, onSubmit } = useProfessorForm();
  // Pega as ferramentas do react-hook-form que o hook nos entrega
  const { register, formState: { errors, isSubmitting } } = form;

  // --- A CONDIÇÃO DE LOADING SIMPLIFICADA ---
  // A página mostra "carregando" apenas se o hook disser que está buscando dados.
  if (loading) {
    return (
        <div className="flex justify-center items-center h-[calc(100vh-80px)]">
            <div className="text-center">
                <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-green-600 mx-auto mb-4"></div>
                <p className="text-gray-600">Carregando dados do professor...</p>
            </div>
        </div>
    );
  }

  return (
    <div className="space-y-6">
      {/* --- Cabeçalho da Página --- */}
      <div className="flex items-center justify-between">
        <div className="flex items-center space-x-4">
          <Button variant="outline" onClick={() => navigate(-1)}>
            <ArrowLeft className="h-4 w-4 mr-2" />
            Voltar
          </Button>
          <div>
            <h1 className="text-3xl font-bold text-gray-900">
              {isEditing ? 'Editar Professor' : 'Cadastrar Novo Professor'}
            </h1>
            <p className="text-gray-600 mt-1">
              {isEditing ? 'Atualize os dados do professor.' : 'Preencha os dados para criar um novo acesso.'}
            </p>
          </div>
        </div>
      </div>

      {/* --- Formulário --- */}
      <Card>
        <CardContent className="p-6">
            <form onSubmit={onSubmit} className="space-y-6">
              <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                <ValidatedInput 
                    label="Nome" 
                    error={errors.firstName} 
                    {...register('firstName')} 
                />
                <ValidatedInput 
                    label="Sobrenome" 
                    error={errors.lastName} 
                    {...register('lastName')} 
                />
              </div>
              <ValidatedInput 
                  label="Email Institucional" 
                  type="email" 
                  error={errors.email} 
                  {...register('email')} 
              />
              <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                <ValidatedInput 
                    label="CPF" 
                    error={errors.cpf} 
                    {...register('cpf')} 
                    placeholder="000.000.000-00"
                />
                <ValidatedInput 
                    label="SIAPE" 
                    error={errors.siape} 
                    {...register('siape')} 
                />
              </div>
              <ValidatedInput 
                  label="Data de Nascimento (Opcional)" 
                  type="date" 
                  error={errors.dataNascimento} 
                  {...register('dataNascimento')} 
              />
              
              {/* Mostra os campos de senha APENAS se estiver no modo de criação */}
              {!isEditing && (
                <div className="border-t pt-6 space-y-6">
                    <p className="text-sm font-medium text-gray-700">Definir Senha Provisória</p>
                    <ValidatedInput 
                        label="Senha" 
                        type="password" 
                        error={errors.password} 
                        {...register('password')} 
                    />
                    <ValidatedInput 
                        label="Confirmar Senha" 
                        type="password" 
                        error={errors.confirmPassword} 
                        {...register('confirmPassword')} 
                    />
                </div>
              )}
              
              <div className="flex justify-end pt-6 border-t">
                <Button type="submit" disabled={isSubmitting} className="bg-green-600 hover:bg-green-700">
                  <Save className="h-4 w-4 mr-2" />
                  {isSubmitting ? 'Salvando...' : (isEditing ? 'Salvar Alterações' : 'Cadastrar Professor')}
                </Button>
              </div>
            </form>
        </CardContent>
      </Card>
    </div>
  );
}