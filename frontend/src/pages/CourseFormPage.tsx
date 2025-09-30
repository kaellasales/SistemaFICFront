import { useState, useEffect } from 'react'
import { useNavigate, useParams } from 'react-router-dom'
import { 
  ArrowLeft, 
  Save, 
  Calendar,
  Users,
  Clock,
  FileText
} from 'lucide-react'
import { Button } from '@/components/ui/Button'
import { ValidatedInput } from '@/components/ui/ValidatedInput'
import { ValidatedSelect } from '@/components/ui/ValidatedSelect'
import { useAuthStore } from '@/shared/stores/authStore'
import { Logo } from '@/components/ui/Logo'

interface CourseFormData {
  name: string
  description: string
  shortDescription: string
  workload: number
  maxSlots: number
  enrollmentStartDate: string
  enrollmentEndDate: string
  courseStartDate: string
  courseEndDate: string
  requirements: string
  content: string
  status: 'draft' | 'published' | 'cancelled'
}

export function CourseFormPage() {
  const { id } = useParams()
  const { user, logout } = useAuthStore()
  const navigate = useNavigate()
  const isEditing = Boolean(id)
  
  const [formData, setFormData] = useState<CourseFormData>({
    name: '',
    description: '',
    shortDescription: '',
    workload: 0,
    maxSlots: 0,
    enrollmentStartDate: '',
    enrollmentEndDate: '',
    courseStartDate: '',
    courseEndDate: '',
    requirements: '',
    content: '',
    status: 'draft'
  })
  
  const [loading, setLoading] = useState(false)
  const [saving, setSaving] = useState(false)

  useEffect(() => {
    if (isEditing) {
      loadCourse()
    }
  }, [id])

  const loadCourse = async () => {
    setLoading(true)
    try {
      // Simular carregamento - em produção, viria da API
      await new Promise(resolve => setTimeout(resolve, 1000))
      
      // Mock data para edição
      setFormData({
        name: 'Programação Web com React',
        description: 'Curso completo de programação web moderna usando React, Node.js e banco de dados.',
        shortDescription: 'Aprenda desenvolvimento web com React',
        workload: 40,
        maxSlots: 30,
        enrollmentStartDate: '2024-03-01',
        enrollmentEndDate: '2024-03-15',
        courseStartDate: '2024-04-01',
        courseEndDate: '2024-06-30',
        requirements: 'Conhecimento básico em programação e HTML/CSS',
        content: 'Módulo 1: Introdução ao React\nMódulo 2: Componentes e Props\nMódulo 3: Estado e Ciclo de Vida\nMódulo 4: Hooks\nMódulo 5: Roteamento\nMódulo 6: Integração com API',
        status: 'published'
      })
    } catch (error) {
      console.error('Erro ao carregar curso:', error)
    } finally {
      setLoading(false)
    }
  }

  const handleInputChange = (field: keyof CourseFormData, value: string | number) => {
    setFormData(prev => ({
      ...prev,
      [field]: value
    }))
  }

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault()
    setSaving(true)
    
    try {
      // Simular salvamento - em produção, seria uma chamada para a API
      await new Promise(resolve => setTimeout(resolve, 2000))
      
      alert(isEditing ? 'Curso atualizado com sucesso!' : 'Curso criado com sucesso!')
      navigate('/my-courses')
    } catch (error) {
      console.error('Erro ao salvar curso:', error)
      alert('Erro ao salvar curso. Tente novamente.')
    } finally {
      setSaving(false)
    }
  }

  const handleLogout = () => {
    logout()
    navigate('/login')
  }

  if (loading) {
    return (
      <div className="min-h-screen bg-white flex items-center justify-center">
        <div className="text-center">
          <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-green-600 mx-auto mb-4"></div>
          <p className="text-gray-600">Carregando curso...</p>
        </div>
      </div>
    )
  }

  return (
    <div className="min-h-screen bg-white">
      {/* Header */}
      <header className="bg-green-800 text-white px-6 py-6 rounded-b-3xl">
        <div className="max-w-7xl mx-auto flex items-center justify-between">
          <div className="flex items-center space-x-4">
            <div className="w-12 h-12 bg-white rounded-full flex items-center justify-center">
              <Logo className="h-8 w-8" />
            </div>
            <div>
              <h1 className="text-xl font-bold">Instituto Federal de Educação</h1>
              <p className="text-green-200 text-sm">Campus Ceará</p>
            </div>
          </div>
          
          <nav className="flex items-center space-x-2">
            <button 
              className="px-4 py-2 text-green-600 bg-white border border-white rounded-lg hover:bg-green-50 transition-colors"
              onClick={() => navigate('/professor-dashboard')}
            >
              Inicio
            </button>
            <button 
              className="px-4 py-2 text-green-600 bg-white border border-white rounded-lg hover:bg-green-50 transition-colors"
              onClick={() => navigate('/my-courses')}
            >
              Meus cursos
            </button>
            <button 
              className="px-4 py-2 text-green-600 bg-white border border-white rounded-lg hover:bg-green-50 transition-colors"
              onClick={() => navigate('/courses')}
            >
              Cursos
            </button>
            <button 
              className="px-4 py-2 text-green-600 bg-white border border-white rounded-lg hover:bg-green-50 transition-colors"
              onClick={handleLogout}
            >
              Sair
            </button>
          </nav>
        </div>
      </header>

      {/* Main Content */}
      <main className="max-w-4xl mx-auto px-6 py-8">
        {/* Header */}
        <div className="flex items-center space-x-4 mb-8">
          <Button 
            variant="outline" 
            onClick={() => navigate('/my-courses')}
            className="flex items-center space-x-2"
          >
            <ArrowLeft className="h-4 w-4" />
            <span>Voltar</span>
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

        {/* Form */}
        <form onSubmit={handleSubmit} className="space-y-8">
          {/* Informações Básicas */}
          <div className="bg-white border border-gray-200 rounded-lg p-6">
            <h3 className="text-lg font-semibold text-gray-900 mb-4 flex items-center">
              <FileText className="h-5 w-5 mr-2" />
              Informações Básicas
            </h3>
            
            <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
              <div className="md:col-span-2">
                <ValidatedInput
                  label="Nome do Curso"
                  required
                  value={formData.name}
                  onChange={(e) => handleInputChange('name', e.target.value)}
                  placeholder="Digite o nome do curso"
                />
              </div>
              
              <div className="md:col-span-2">
                <label className="block text-sm font-medium text-gray-700 mb-1">
                  Descrição Curta
                </label>
                <textarea
                  value={formData.shortDescription}
                  onChange={(e) => handleInputChange('shortDescription', e.target.value)}
                  placeholder="Descrição resumida do curso"
                  className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-green-500"
                  rows={2}
                />
              </div>
              
              <div className="md:col-span-2">
                <label className="block text-sm font-medium text-gray-700 mb-1">
                  Descrição Completa
                </label>
                <textarea
                  value={formData.description}
                  onChange={(e) => handleInputChange('description', e.target.value)}
                  placeholder="Descrição detalhada do curso"
                  className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-green-500"
                  rows={4}
                />
              </div>
            </div>
          </div>

          {/* Configurações do Curso */}
          <div className="bg-white border border-gray-200 rounded-lg p-6">
            <h3 className="text-lg font-semibold text-gray-900 mb-4 flex items-center">
              <Clock className="h-5 w-5 mr-2" />
              Configurações do Curso
            </h3>
            
            <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
              <ValidatedInput
                label="Carga Horária (horas)"
                required
                type="number"
                value={formData.workload}
                onChange={(e) => handleInputChange('workload', parseInt(e.target.value) || 0)}
                placeholder="40"
              />
              
              <ValidatedInput
                label="Número de Vagas"
                required
                type="number"
                value={formData.maxSlots}
                onChange={(e) => handleInputChange('maxSlots', parseInt(e.target.value) || 0)}
                placeholder="30"
              />
              
              <ValidatedSelect
                label="Status"
                required
                value={formData.status}
                onChange={(e) => handleInputChange('status', e.target.value as any)}
                options={[
                  { value: 'draft', label: 'Rascunho' },
                  { value: 'published', label: 'Publicado' },
                  { value: 'cancelled', label: 'Cancelado' }
                ]}
              />
            </div>
          </div>

          {/* Datas */}
          <div className="bg-white border border-gray-200 rounded-lg p-6">
            <h3 className="text-lg font-semibold text-gray-900 mb-4 flex items-center">
              <Calendar className="h-5 w-5 mr-2" />
              Datas
            </h3>
            
            <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
              <ValidatedInput
                label="Início das Inscrições"
                required
                type="date"
                value={formData.enrollmentStartDate}
                onChange={(e) => handleInputChange('enrollmentStartDate', e.target.value)}
              />
              
              <ValidatedInput
                label="Fim das Inscrições"
                required
                type="date"
                value={formData.enrollmentEndDate}
                onChange={(e) => handleInputChange('enrollmentEndDate', e.target.value)}
              />
              
              <ValidatedInput
                label="Início do Curso"
                required
                type="date"
                value={formData.courseStartDate}
                onChange={(e) => handleInputChange('courseStartDate', e.target.value)}
              />
              
              <ValidatedInput
                label="Fim do Curso"
                required
                type="date"
                value={formData.courseEndDate}
                onChange={(e) => handleInputChange('courseEndDate', e.target.value)}
              />
            </div>
          </div>

          {/* Conteúdo e Requisitos */}
          <div className="bg-white border border-gray-200 rounded-lg p-6">
            <h3 className="text-lg font-semibold text-gray-900 mb-4 flex items-center">
              <Users className="h-5 w-5 mr-2" />
              Conteúdo e Requisitos
            </h3>
            
            <div className="space-y-6">
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-1">
                  Requisitos
                </label>
                <textarea
                  value={formData.requirements}
                  onChange={(e) => handleInputChange('requirements', e.target.value)}
                  placeholder="Liste os pré-requisitos para o curso"
                  className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-green-500"
                  rows={3}
                />
              </div>
              
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-1">
                  Conteúdo Programático
                </label>
                <textarea
                  value={formData.content}
                  onChange={(e) => handleInputChange('content', e.target.value)}
                  placeholder="Descreva o conteúdo do curso"
                  className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-green-500"
                  rows={6}
                />
              </div>
            </div>
          </div>

          {/* Actions */}
          <div className="flex items-center justify-end space-x-4">
            <Button 
              type="button" 
              variant="outline"
              onClick={() => navigate('/my-courses')}
            >
              Cancelar
            </Button>
            <Button 
              type="submit" 
              className="bg-green-600 hover:bg-green-700"
              disabled={saving}
            >
              {saving ? (
                <>
                  <div className="animate-spin rounded-full h-4 w-4 border-b-2 border-white mr-2"></div>
                  Salvando...
                </>
              ) : (
                <>
                  <Save className="h-4 w-4 mr-2" />
                  {isEditing ? 'Atualizar Curso' : 'Criar Curso'}
                </>
              )}
            </Button>
          </div>
        </form>
      </main>

      {/* Footer */}
      <footer className="bg-green-600 text-white px-6 py-6 rounded-t-3xl">
        <div className="max-w-7xl mx-auto text-center">
          <h3 className="text-lg font-medium mb-2">O que é?</h3>
          <div className="w-24 h-px bg-white mx-auto"></div>
        </div>
      </footer>
    </div>
  )
}
