// src/pages/CourseFormPage.tsx

import { useState, useEffect } from 'react'
import { useNavigate, useParams } from 'react-router-dom'
import toast from 'react-hot-toast'
import { ArrowLeft, Save, Calendar, Clock, FileText } from 'lucide-react'
import { Button } from '@/components/ui/Button'
import { ValidatedInput } from '@/components/ui/ValidatedInput'
import { Logo } from '@/components/ui/Logo'
import { useAuthStore } from '@/shared/stores/authStore'
import api from '@/shared/services/api' // Seu serviço de API (axios)

// --- INTERFACE ATUALIZADA (com camelCase e vagas separadas) ---
interface CourseFormData {
  nome: string
  descricao: string
  descricaoCurta: string
  cargaHoraria: number
  vagasInternas: number
  vagasExternas: number
  dataInicioInscricoes: string
  dataFimInscricoes: string
  dataInicioCurso: string
  dataFimCurso: string
  requisitos: string
}

// --- UTILITÁRIO PARA CONVERSÃO (importante para o Django) ---
// Converte um objeto de camelCase para snake_case antes de enviar para a API
const toSnakeCase = (obj: any) => {
    const newObj: any = {};
    for (const key in obj) {
        const newKey = key.replace(/[A-Z]/g, letter => `_${letter.toLowerCase()}`);
        newObj[newKey] = obj[key];
    }
    return newObj;
};

export function CourseFormPage() {
  const { id } = useParams<{id: string}>()
  const { logout } = useAuthStore()
  const navigate = useNavigate()
  const isEditing = Boolean(id)
  
  // --- ESTADO INICIAL ATUALIZADO ---
  const [formData, setFormData] = useState<CourseFormData>({
    nome: '',
    descricao: '',
    descricaoCurta: '',
    cargaHoraria: 40,
    vagasInternas: 20,
    vagasExternas: 10,
    dataInicioInscricoes: '',
    dataFimInscricoes: '',
    dataInicioCurso: '',
    dataFimCurso: '',
    requisitos: '',
  })
  
  const [loading, setLoading] = useState(isEditing)
  const [saving, setSaving] = useState(false)

  useEffect(() => {
    if (isEditing && id) {
      // A função de carregar os dados do curso para edição
      // loadCourse(id);
    }
  }, [id, isEditing])

  // --- FUNÇÃO DE HANDLE GENÉRICA ---
  // Uma única função para atualizar todos os campos do formulário
  const handleChange = (e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement>) => {
    const { name, value, type } = e.target;
    setFormData(prev => ({
      ...prev,
      // Se o input for do tipo 'number', converte o valor para inteiro
      [name]: type === 'number' ? parseInt(value) || 0 : value,
    }));
  };

  // --- LÓGICA DE SALVAMENTO UNIFICADA ---
  // Chamada pelos botões, recebe o status desejado
  const handleSave = async (status: 'RASCUNHO' | 'PUBLICADO') => {
    setSaving(true)
    
    const payload = {
        ...toSnakeCase(formData),
        status: status,
    };
    
    try {
      if (isEditing) {
        toast.promise(
          api.put(`/api/cursos/${id}/`, payload),
          {
            loading: 'Atualizando curso...',
            success: 'Curso atualizado com sucesso!',
            error: 'Erro ao atualizar o curso.',
          }
        );
      } else {
        toast.promise(
          api.post('/api/cursos/', payload),
          {
            loading: 'Salvando curso...',
            success: `Curso salvo como ${status.toLowerCase()}!`,
            error: 'Erro ao salvar o curso.',
          }
        );
      }
      // Simulação de tempo de espera da API
      await new Promise(resolve => setTimeout(resolve, 1500));
      navigate('/my-courses');
    } catch (error) {
      console.error('Erro ao salvar curso:', error);
      // O toast.promise já lida com a mensagem de erro
    } finally {
      setSaving(false);
    }
  }

  const handleLogout = () => {
    logout();
    navigate('/login');
  }

  if (loading) {
    return <div>Carregando formulário...</div>;
  }

  return (
    <div className="min-h-screen bg-gray-50">
      {/* Header */}
      <header className="bg-green-800 text-white px-6 py-6 rounded-b-3xl">
        <div className="max-w-7xl mx-auto flex items-center justify-between">
            {/* ... (código do seu header, não precisa mudar) ... */}
        </div>
      </header>

      {/* Main Content */}
      <main className="max-w-4xl mx-auto px-6 py-8">
        {/* Header da Página */}
        <div className="flex items-center space-x-4 mb-8">
          <Button variant="outline" onClick={() => navigate('/my-courses')}>
            <ArrowLeft className="h-4 w-4 mr-2" />
            Voltar
          </Button>
          <div>
            <h2 className="text-3xl font-bold text-gray-900">
              {isEditing ? 'Editar Curso' : 'Novo Curso'}
            </h2>
            <p className="text-gray-600 mt-1">
              {isEditing ? 'Atualize as informações do curso' : 'Preencha as informações para criar um novo curso'}
            </p>
          </div>
        </div>

        {/* Formulário */}
        <form onSubmit={(e) => e.preventDefault()} className="space-y-8">
          
          {/* Informações Básicas */}
          <div className="bg-white border border-gray-200 rounded-lg p-6">
            <h3 className="text-lg font-semibold text-gray-900 mb-4 flex items-center">
              <FileText className="h-5 w-5 mr-2" />
              Informações Básicas
            </h3>
            <div className="space-y-6">
              <ValidatedInput
                label="Nome do Curso"
                name="nome"
                required
                value={formData.nome}
                onChange={handleChange}
              />
              <textarea
                name="descricaoCurta"
                value={formData.descricaoCurta}
                onChange={handleChange}
                placeholder="Descrição resumida do curso (aparecerá nos cards)"
                className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-green-500"
                rows={2}
              />
              <textarea
                name="descricao"
                value={formData.descricao}
                onChange={handleChange}
                placeholder="Descrição detalhada do curso"
                className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-green-500"
                rows={4}
              />
            </div>
          </div>

          {/* Configurações do Curso */}
          <div className="bg-white border border-gray-200 rounded-lg p-6">
            <h3 className="text-lg font-semibold text-gray-900 mb-4 flex items-center">
              <Clock className="h-5 w-5 mr-2" />
              Configurações
            </h3>
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
              <ValidatedInput
                label="Vagas Internas"
                name="vagasInternas"
                required type="number"
                min="0"
                value={formData.vagasInternas}
                onChange={handleChange}
              />
              <ValidatedInput
                label="Vagas Externas"
                name="vagasExternas"
                required type="number"
                min="0"
                value={formData.vagasExternas}
                onChange={handleChange}
              />
              <ValidatedInput
                label="Carga Horária (horas)"
                name="cargaHoraria"
                required type="number"
                min="0"
                value={formData.cargaHoraria}
                onChange={handleChange}
              />
            </div>
          </div>

          {/* Datas */}
          <div className="bg-white border border-gray-200 rounded-lg p-6">
            <h3 className="text-lg font-semibold text-gray-900 mb-4 flex items-center">
              <Calendar className="h-5 w-5 mr-2" />
              Datas Importantes
            </h3>
            <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
              <ValidatedInput label="Início das Inscrições" name="dataInicioInscricoes" required type="date" value={formData.dataInicioInscricoes} onChange={handleChange} />
              <ValidatedInput label="Fim das Inscrições" name="dataFimInscricoes" required type="date" value={formData.dataFimInscricoes} onChange={handleChange} />
              <ValidatedInput label="Início do Curso" name="dataInicioCurso" required type="date" value={formData.dataInicioCurso} onChange={handleChange} />
              <ValidatedInput label="Fim do Curso" name="dataFimCurso" required type="date" value={formData.dataFimCurso} onChange={handleChange} />
            </div>
          </div>
          
          {/* Requisitos */}
          <div className="bg-white border border-gray-200 rounded-lg p-6">
            <h3 className="text-lg font-semibold text-gray-900 mb-4">Requisitos</h3>
             <textarea
                name="requisitos"
                value={formData.requisitos}
                onChange={handleChange}
                placeholder="Liste os pré-requisitos para o curso"
                className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-green-500"
                rows={3}
              />
          </div>

          {/* Botões de Ação */}
          <div className="flex items-center justify-end space-x-4 pt-4 border-t">
            <Button type="button" variant="outline" onClick={() => navigate('/my-courses')} disabled={saving}>
              Cancelar
            </Button>
            <Button
              type="button"
              variant="secondary"
              onClick={() => handleSave('RASCUNHO')}
              disabled={saving}
            >
              <Save className="h-4 w-4 mr-2" />
              {saving ? 'Salvando...' : 'Salvar como Rascunho'}
            </Button>
            <Button
              type="button"
              className="bg-green-600 hover:bg-green-700"
              onClick={() => handleSave('PUBLICADO')}
              disabled={saving}
            >
              {saving ? 'Publicando...' : (isEditing ? 'Atualizar e Publicar' : 'Publicar Curso')}
            </Button>
          </div>
        </form>
      </main>
    </div>
  )
}