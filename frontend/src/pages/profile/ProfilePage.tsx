import { useNavigate } from 'react-router-dom';
import { useUserProfile } from '@/features/users/hooks/useUserProfile';
import { Button } from '@/components/ui/Button';
import { Card, CardContent, CardHeader, CardTitle, CardDescription } from '@/components/ui/Card';
import { Avatar, AvatarFallback, AvatarImage } from '@/components/ui/Avatar';
import { 
  Edit, User, Mail, Home, GraduationCap, ArrowLeft, Hash, Info
} from 'lucide-react';
export function ProfilePage() {
  const navigate = useNavigate();
  const { profileData, loading, userGroups } = useUserProfile();

  const getInitials = (firstName = '', lastName = '') => `${firstName[0] || ''}${lastName[0] || ''}`.toUpperCase();

  if (loading) {
    return (
        <div className="flex justify-center items-center h-[calc(100vh-80px)]">
            {/* ... Seu componente de loading ... */}
        </div>
    );
  }

  if (!profileData) {
    return (
        <div className="text-center p-8">
            <h1 className="text-xl font-bold">Não foi possível carregar o perfil.</h1>
            <Button onClick={() => navigate('/dashboard')} className="mt-4">Voltar para a Dashboard</Button>
        </div>
    );
  }

  const { user } = profileData;

  return (
    <div className="max-w-5xl mx-auto py-8"> 
      {/* --- BOTÃO DE VOLTAR ADICIONADO --- */}
      <Button variant="outline" onClick={() => navigate('/dashboard')} className="mb-6">
        <ArrowLeft className="h-4 w-4 mr-2" />
        Voltar para a Dashboard
      </Button>

      <div className="space-y-6">
        {/* --- CABEÇALHO DO PERFIL --- */}
        <div className="flex flex-col sm:flex-row items-center justify-between gap-4">
          <div className="flex items-center space-x-4">
            <Avatar className="h-24 w-24 border-2 border-green-600">
              <AvatarFallback className="text-3xl">{getInitials(user.firstName, user.lastName)}</AvatarFallback>
            </Avatar>
            <div>
              <h1 className="text-3xl font-bold text-gray-900">{user.firstName} {user.lastName}</h1>
              <p className="text-gray-600 flex items-center space-x-2 mt-1">
                <Mail className="h-4 w-4 text-gray-500" />
                <span>{user.email}</span>
              </p>
            </div>
          </div>
          {/* Botão de Editar (inteligente) */}
          {userGroups.includes('ALUNO') && <Button onClick={() => navigate('/aluno/complete-profile')}><Edit className="mr-2 h-4 w-4"/> Editar Perfil</Button>}
        </div>
        {/* --- RENDERIZAÇÃO CONDICIONAL DOS CARDS --- */}

        {/* --- Visão do ALUNO --- */}
        {userGroups.includes('ALUNO') && (
          <div className="space-y-6">
              <Card>
                  <CardHeader><CardTitle className="flex items-center"><User /> Dados Pessoais</CardTitle></CardHeader>
                  <CardContent className="grid grid-cols-1 md:grid-cols-2 gap-4 text-sm">
                      <p><strong>CPF:</strong> {profileData.cpf || 'Não informado'}</p>
                      <p><strong>RG:</strong> {profileData.numeroIdentidade || 'Não informado'}</p>
                      <p><strong>Data de Nasc.:</strong> {profileData.dataNascimento ? new Date(profileData.dataNascimento).toLocaleDateString('pt-BR') : 'Não informada'}</p>
                      <p><strong>Celular:</strong> {profileData.telefoneCelular || 'Não informado'}</p>
                  </CardContent>
              </Card>
              <Card>
                  <CardHeader><CardTitle className="flex items-center"><Home /> Endereço e Naturalidade</CardTitle></CardHeader>
                  <CardContent className="grid grid-cols-1 md:grid-cols-2 gap-4 text-sm">
                      <p><strong>Endereço:</strong> {`${profileData.logradouro || ''}, ${profileData.numeroEndereco || 'S/N'}`}</p>
                      <p><strong>Bairro:</strong> {profileData.bairro || 'Não informado'}</p>
                      <p><strong>Cidade/UF:</strong> {`${profileData.cidade?.nome || ''} - ${profileData.cidade?.estado?.uf || ''}`}</p>
                      <p><strong>CEP:</strong> {profileData.cep || 'Não informado'}</p>
                      <p><strong>Naturalidade:</strong> {`${profileData.naturalidade?.nome || ''} - ${profileData.naturalidade?.estado?.uf || ''}`}</p>
                  </CardContent>
              </Card>
          </div>
        )}

  {/* --- Visão do PROFESSOR --- */}
          {userGroups.includes('PROFESSOR') && (
            <Card>
              <CardHeader>
                <CardTitle className="flex items-center"><GraduationCap className="mr-2 h-5 w-5 text-green-700"/> Informações do Professor</CardTitle>
              </CardHeader>
              <CardContent className="space-y-4">
                <div className="grid grid-cols-1 md:grid-cols-2 gap-4 text-sm">
                  <p><strong>SIAPE:</strong> {profileData.siape || 'Não informado'}</p>
                  <p><strong>CPF:</strong> {profileData.cpf || 'Não informado'}</p>
                </div>
                
                <div className="p-4 bg-blue-50 border border-blue-200 text-blue-800 rounded-lg text-sm flex items-start space-x-3">
                  <Info className="h-5 w-5 flex-shrink-0 mt-0.5" />
                  <p><strong>Nota:</strong> Se houver alguma inconsistência nos seus dados (Nome, CPF, SIAPE), por favor, informe o CCA para que a correção seja feita.</p>
                </div>
              </CardContent>
            </Card>
          )}

        {/* --- Visão do CCA --- */}
        {userGroups.includes('CCA') && (
          <Card className="bg-gray-50">
            <CardHeader><CardTitle>Perfil de Coordenador (CCA)</CardTitle></CardHeader>
            <CardContent>
              <p className="text-sm text-gray-600">Você está logado como Coordenador. Suas informações de usuário são gerenciadas pelo administrador do sistema.</p>
            </CardContent>
          </Card>
        )}

      </div>
    </div>
  );
}