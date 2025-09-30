import { useState } from 'react'
import { useNavigate, useLocation } from 'react-router-dom'
import { ArrowLeft, ArrowRight } from 'lucide-react'
import { Logo } from '@/components/ui/Logo'
import { FileUpload } from '@/components/ui/FileUpload'
import { ValidatedInput } from '@/components/ui/ValidatedInput'
import { ValidatedSelect } from '@/components/ui/ValidatedSelect'
import { enrollmentService, type EnrollmentData } from '@/shared/services/enrollmentService'
import { useValidation } from '@/shared/hooks/useValidation'

interface Course {
  id: string
  name: string
  enrollmentEndDate: string
  status: string
  description: string
  startDate: string
  endDate: string
  vacancies: number
  schedule: string
  classTime: string
  requirements: string
}

interface StudentData {
  // Dados pessoais
  nome: string
  sobrenome: string
  dataNascimento: string
  sexo: string
  cpf: string
  identidade: string
  orgaoExpedidor: string
  naturalidade: string
  
  // Dados de contato
  email: string
  telefoneCelular: string
  telefoneResidencial: string
  telefoneComercial: string
  
  // Dados de endereço
  endereco: string
  numero: string
  complemento: string
  bairro: string
  cidade: string
  cep: string
  
  // Dados acadêmicos
  profissao: string
  numeroMatricula: string
  numeroInscricao: string
}

export function EnrollmentPage() {
  const navigate = useNavigate()
  const location = useLocation()
  const course = location.state?.course as Course
  
  const [currentStep, setCurrentStep] = useState(1)
  const [uploadedFiles, setUploadedFiles] = useState<File[]>([])
  const [isSubmitting, setIsSubmitting] = useState(false)
  const { validateCurrentStep, getFieldError, clearErrors } = useValidation()
  const [studentData, setStudentData] = useState<StudentData>({
    nome: '',
    sobrenome: '',
    dataNascimento: '',
    sexo: '',
    cpf: '',
    identidade: '',
    orgaoExpedidor: '',
    naturalidade: '',
    email: '',
    telefoneCelular: '',
    telefoneResidencial: '',
    telefoneComercial: '',
    endereco: '',
    numero: '',
    complemento: '',
    bairro: '',
    cidade: '',
    cep: '',
    profissao: '',
    numeroMatricula: '',
    numeroInscricao: ''
  })

  const totalSteps = 5

  const handleInputChange = (field: keyof StudentData, value: string) => {
    setStudentData(prev => ({
      ...prev,
      [field]: value
    }))
  }

  const nextStep = () => {
    // Validar etapa atual antes de avançar
    const isValid = validateCurrentStep(currentStep, studentData, uploadedFiles)
    
    if (isValid && currentStep < totalSteps) {
      clearErrors()
      setCurrentStep(currentStep + 1)
    }
  }

  const prevStep = () => {
    if (currentStep > 1) {
      setCurrentStep(currentStep - 1)
    }
  }

  const handleSubmit = async () => {
    if (!course) return
    
    setIsSubmitting(true)
    
    try {
      // Converter dados para o formato da API
      const enrollmentData: EnrollmentData = {
        nome: studentData.nome,
        sobrenome: studentData.sobrenome,
        dataNascimento: studentData.dataNascimento,
        sexo: studentData.sexo,
        cpf: studentData.cpf,
        identidade: studentData.identidade,
        orgaoExpedidor: studentData.orgaoExpedidor,
        naturalidade: studentData.naturalidade,
        email: studentData.email,
        telefoneCelular: studentData.telefoneCelular,
        telefoneResidencial: studentData.telefoneResidencial,
        telefoneComercial: studentData.telefoneComercial,
        endereco: studentData.endereco,
        numero: studentData.numero,
        complemento: studentData.complemento,
        bairro: studentData.bairro,
        cidade: studentData.cidade,
        cep: studentData.cep,
        profissao: studentData.profissao,
        numeroMatricula: studentData.numeroMatricula
      }
      
      // Enviar dados para a API
      await enrollmentService.createEnrollment(course.id, enrollmentData, uploadedFiles)
      
      alert('Inscrição realizada com sucesso!')
      navigate('/my-enrollments')
    } catch (error) {
      console.error('Erro ao realizar inscrição:', error)
      alert('Erro ao realizar inscrição. Tente novamente.')
    } finally {
      setIsSubmitting(false)
    }
  }

  const renderStepContent = () => {
    switch (currentStep) {
      case 1:
        return (
          <div className="space-y-6">
            <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
              <ValidatedInput
                label="Nome"
                required
                value={studentData.nome}
                onChange={(e) => handleInputChange('nome', e.target.value)}
                placeholder="Digite seu nome"
                error={getFieldError('nome')}
              />
              
              <ValidatedInput
                label="Sobrenome"
                required
                value={studentData.sobrenome}
                onChange={(e) => handleInputChange('sobrenome', e.target.value)}
                placeholder="Digite seu sobrenome"
                error={getFieldError('sobrenome')}
              />
            </div>
            
            <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
              <ValidatedInput
                label="Data de nascimento"
                required
                type="date"
                value={studentData.dataNascimento}
                onChange={(e) => handleInputChange('dataNascimento', e.target.value)}
                error={getFieldError('dataNascimento')}
              />
              <ValidatedSelect
                label="Sexo"
                required
                value={studentData.sexo}
                onChange={(e) => handleInputChange('sexo', e.target.value)}
                placeholder="Selecione"
                error={getFieldError('sexo')}
                options={[
                  { value: 'masculino', label: 'Masculino' },
                  { value: 'feminino', label: 'Feminino' },
                  { value: 'outro', label: 'Outro' }
                ]}
              />
            </div>
            
            <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-2">
                  Identidade *
                </label>
                <input
                  type="text"
                  value={studentData.identidade}
                  onChange={(e) => handleInputChange('identidade', e.target.value)}
                  className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-green-500"
                  required
                />
              </div>
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-2">
                  Órgão expedidor *
                </label>
                <input
                  type="text"
                  value={studentData.orgaoExpedidor}
                  onChange={(e) => handleInputChange('orgaoExpedidor', e.target.value)}
                  className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-green-500"
                  required
                />
              </div>
            </div>
            
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-2">
                CPF *
              </label>
              <input
                type="text"
                value={studentData.cpf}
                onChange={(e) => handleInputChange('cpf', e.target.value)}
                className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-green-500"
                placeholder="000.000.000-00"
                required
              />
            </div>
          </div>
        )
      
      case 2:
        return (
          <div className="space-y-6">
            <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-2">
                  Endereço *
                </label>
                <input
                  type="text"
                  value={studentData.endereco}
                  onChange={(e) => handleInputChange('endereco', e.target.value)}
                  className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-green-500"
                  required
                />
              </div>
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-2">
                  Nº *
                </label>
                <input
                  type="text"
                  value={studentData.numero}
                  onChange={(e) => handleInputChange('numero', e.target.value)}
                  className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-green-500"
                  required
                />
              </div>
            </div>
            
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-2">
                Complemento
              </label>
              <input
                type="text"
                value={studentData.complemento}
                onChange={(e) => handleInputChange('complemento', e.target.value)}
                className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-green-500"
              />
            </div>
            
            <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-2">
                  Bairro *
                </label>
                <input
                  type="text"
                  value={studentData.bairro}
                  onChange={(e) => handleInputChange('bairro', e.target.value)}
                  className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-green-500"
                  required
                />
              </div>
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-2">
                  CEP *
                </label>
                <input
                  type="text"
                  value={studentData.cep}
                  onChange={(e) => handleInputChange('cep', e.target.value)}
                  className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-green-500"
                  placeholder="00000-000"
                  required
                />
              </div>
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-2">
                  Cidade *
                </label>
                <input
                  type="text"
                  value={studentData.cidade}
                  onChange={(e) => handleInputChange('cidade', e.target.value)}
                  className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-green-500"
                  required
                />
              </div>
            </div>
          </div>
        )
      
      case 3:
        return (
          <div className="space-y-6">
            <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-2">
                  Email *
                </label>
                <input
                  type="email"
                  value={studentData.email}
                  onChange={(e) => handleInputChange('email', e.target.value)}
                  className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-green-500"
                  required
                />
              </div>
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-2">
                  Telefone Celular *
                </label>
                <input
                  type="tel"
                  value={studentData.telefoneCelular}
                  onChange={(e) => handleInputChange('telefoneCelular', e.target.value)}
                  className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-green-500"
                  placeholder="(00) 00000-0000"
                  required
                />
              </div>
            </div>
            
            <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-2">
                  Telefone Residencial
                </label>
                <input
                  type="tel"
                  value={studentData.telefoneResidencial}
                  onChange={(e) => handleInputChange('telefoneResidencial', e.target.value)}
                  className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-green-500"
                  placeholder="(00) 0000-0000"
                />
              </div>
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-2">
                  Telefone Comercial
                </label>
                <input
                  type="tel"
                  value={studentData.telefoneComercial}
                  onChange={(e) => handleInputChange('telefoneComercial', e.target.value)}
                  className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-green-500"
                  placeholder="(00) 0000-0000"
                />
              </div>
            </div>
            
            <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-2">
                  Profissão
                </label>
                <input
                  type="text"
                  value={studentData.profissao}
                  onChange={(e) => handleInputChange('profissao', e.target.value)}
                  className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-green-500"
                />
              </div>
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-2">
                  Naturalidade *
                </label>
                <input
                  type="text"
                  value={studentData.naturalidade}
                  onChange={(e) => handleInputChange('naturalidade', e.target.value)}
                  className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-green-500"
                  required
                />
              </div>
            </div>
            
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-2">
                Nº de Matrícula
              </label>
              <input
                type="text"
                value={studentData.numeroMatricula}
                onChange={(e) => handleInputChange('numeroMatricula', e.target.value)}
                className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-green-500"
              />
            </div>
          </div>
        )
      
      case 4:
        return (
          <div className="space-y-6">
            <div className="text-center">
              <h3 className="text-lg font-medium text-gray-900 mb-4">
                Documentos Necessários
              </h3>
              <p className="text-gray-600 mb-6">
                Faça upload dos documentos obrigatórios para completar sua inscrição
              </p>
            </div>
            
            <FileUpload
              onFilesChange={setUploadedFiles}
              acceptedTypes=".pdf,.jpg,.jpeg,.png,.doc,.docx"
              maxFiles={5}
              maxSize={10}
            />
            
            <div className="space-y-3">
              <h4 className="font-medium text-gray-900">Documentos obrigatórios:</h4>
              <ul className="space-y-2 text-sm text-gray-600">
                <li>• Cópia do RG ou CNH</li>
                <li>• Cópia do CPF</li>
                <li>• Comprovante de residência</li>
                <li>• Foto 3x4 (opcional)</li>
              </ul>
            </div>
          </div>
        )
      
      case 5:
        return (
          <div className="space-y-6">
            <div className="text-center">
              <h3 className="text-lg font-medium text-gray-900 mb-4">
                Confirmação da Inscrição
              </h3>
              <p className="text-gray-600 mb-6">
                Revise os dados e confirme sua inscrição no curso
              </p>
            </div>
            
            <div className="bg-gray-50 rounded-lg p-6">
              <h4 className="font-medium text-gray-900 mb-4">Resumo da Inscrição:</h4>
              <div className="space-y-2 text-sm">
                <div className="flex justify-between">
                  <span className="text-gray-600">Curso:</span>
                  <span className="font-medium">{course?.name}</span>
                </div>
                <div className="flex justify-between">
                  <span className="text-gray-600">Aluno:</span>
                  <span className="font-medium">{studentData.nome} {studentData.sobrenome}</span>
                </div>
                <div className="flex justify-between">
                  <span className="text-gray-600">Email:</span>
                  <span className="font-medium">{studentData.email}</span>
                </div>
                <div className="flex justify-between">
                  <span className="text-gray-600">Telefone:</span>
                  <span className="font-medium">{studentData.telefoneCelular}</span>
                </div>
              </div>
            </div>
            
            <div className="bg-yellow-50 border border-yellow-200 rounded-lg p-4">
              <p className="text-sm text-yellow-800">
                <strong>Atenção:</strong> Após confirmar a inscrição, você receberá um email de confirmação. 
                Mantenha seus dados atualizados para receber informações importantes sobre o curso.
              </p>
            </div>
          </div>
        )
      
      default:
        return null
    }
  }

  if (!course) {
    return (
      <div className="min-h-screen bg-white flex items-center justify-center">
        <div className="text-center">
          <h1 className="text-2xl font-bold text-gray-900 mb-4">Curso não encontrado</h1>
          <button
            onClick={() => navigate('/courses')}
            className="bg-green-600 text-white px-6 py-2 rounded-lg hover:bg-green-700 transition-colors"
          >
            Voltar aos Cursos
          </button>
        </div>
      </div>
    )
  }

  return (
    <div className="min-h-screen bg-white">
      {/* Header */}
      <header className="bg-green-800 rounded-b-2xl px-6 py-4">
        <div className="max-w-7xl mx-auto flex items-center justify-between">
          <div className="flex items-center space-x-3">
            <div className="w-12 h-12 bg-white rounded-full flex items-center justify-center p-1">
              <Logo size="sm" />
            </div>
            <div className="text-white">
              <div className="text-sm font-medium">Instituto Federal de Educação</div>
              <div className="text-sm">Campus Ceará</div>
            </div>
          </div>
          
          <div className="flex items-center space-x-4">
            <button
              onClick={() => navigate('/courses')}
              className="bg-white text-green-800 px-4 py-2 rounded-lg text-sm font-medium hover:bg-green-50 transition-colors"
            >
              Voltar
            </button>
          </div>
        </div>
      </header>

      {/* Conteúdo principal */}
      <main className="px-6 py-8">
        <div className="max-w-4xl mx-auto">
          {/* Título */}
          <div className="text-center mb-8">
            <h1 className="text-2xl font-bold text-green-600 mb-2">
              Inscrição no Curso: {course.name}
            </h1>
            <p className="text-gray-600">
              Preencha os dados abaixo para se inscrever no curso
            </p>
          </div>

          {/* Formulário */}
          <div className="bg-white border-2 border-green-600 rounded-lg p-8">
            {renderStepContent()}
          </div>

          {/* Navegação */}
          <div className="flex items-center justify-between mt-8">
            <button
              onClick={prevStep}
              disabled={currentStep === 1}
              className="flex items-center space-x-2 px-4 py-2 text-green-600 hover:text-green-800 disabled:opacity-50 disabled:cursor-not-allowed"
            >
              <ArrowLeft className="w-4 h-4" />
              <span>Anterior</span>
            </button>

            {/* Indicador de progresso */}
            <div className="flex items-center space-x-2">
              {Array.from({ length: totalSteps }, (_, index) => (
                <div
                  key={index}
                  className={`w-3 h-3 rounded-full ${
                    index + 1 === currentStep
                      ? 'bg-red-500'
                      : index + 1 < currentStep
                      ? 'bg-green-500'
                      : 'bg-gray-300'
                  }`}
                />
              ))}
            </div>

            {currentStep < totalSteps ? (
              <button
                onClick={nextStep}
                className="flex items-center space-x-2 px-4 py-2 text-green-600 hover:text-green-800"
              >
                <span>Próximo</span>
                <ArrowRight className="w-4 h-4" />
              </button>
            ) : (
              <button
                onClick={handleSubmit}
                disabled={isSubmitting}
                className="bg-green-600 text-white px-6 py-2 rounded-lg hover:bg-green-700 transition-colors disabled:opacity-50 disabled:cursor-not-allowed"
              >
                {isSubmitting ? 'Enviando...' : 'Confirmar Inscrição'}
              </button>
            )}
          </div>
        </div>
      </main>
    </div>
  )
}
