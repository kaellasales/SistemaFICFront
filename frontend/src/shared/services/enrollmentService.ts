import api from './api'

export interface EnrollmentData {
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
  telefoneResidencial?: string
  telefoneComercial?: string
  
  // Dados de endereço
  endereco: string
  numero: string
  complemento?: string
  bairro: string
  cidade: string
  cep: string
  
  // Dados acadêmicos
  profissao?: string
  numeroMatricula?: string
}

export interface Course {
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

export interface EnrollmentResponse {
  id: string
  course: Course
  student: {
    name: string
    email: string
  }
  status: 'pending' | 'approved' | 'rejected'
  createdAt: string
  documents: number
}

class EnrollmentService {
  // Criar inscrição em um curso
  async createEnrollment(courseId: string, enrollmentData: EnrollmentData, files: File[]): Promise<EnrollmentResponse> {
    const formData = new FormData()
    
    // Adicionar dados do aluno
    formData.append('course_id', courseId)
    formData.append('nome', enrollmentData.nome)
    formData.append('sobrenome', enrollmentData.sobrenome)
    formData.append('data_nascimento', enrollmentData.dataNascimento)
    formData.append('sexo', enrollmentData.sexo)
    formData.append('cpf', enrollmentData.cpf)
    formData.append('numero_identidade', enrollmentData.identidade)
    formData.append('orgao_expedidor', enrollmentData.orgaoExpedidor)
    formData.append('naturalidade', enrollmentData.naturalidade)
    formData.append('email', enrollmentData.email)
    formData.append('telefone_celular', enrollmentData.telefoneCelular)
    
    if (enrollmentData.telefoneResidencial) {
      formData.append('telefone_residencial', enrollmentData.telefoneResidencial)
    }
    
    if (enrollmentData.telefoneComercial) {
      formData.append('telefone_comercial', enrollmentData.telefoneComercial)
    }
    
    formData.append('logradouro', enrollmentData.endereco)
    formData.append('numero_endereco', enrollmentData.numero)
    
    if (enrollmentData.complemento) {
      formData.append('complemento', enrollmentData.complemento)
    }
    
    formData.append('bairro', enrollmentData.bairro)
    formData.append('cidade', enrollmentData.cidade)
    formData.append('cep', enrollmentData.cep)
    
    if (enrollmentData.profissao) {
      formData.append('profissao', enrollmentData.profissao)
    }
    
    if (enrollmentData.numeroMatricula) {
      formData.append('numero_matricula', enrollmentData.numeroMatricula)
    }
    
    // Adicionar arquivos
    files.forEach((file, index) => {
      formData.append(`document_${index}`, file)
    })
    
    const response = await api.post('/enrollment/', formData, {
      headers: {
        'Content-Type': 'multipart/form-data',
      },
    })
    
    return response.data
  }
  
  // Listar inscrições do usuário
  async getMyEnrollments(): Promise<EnrollmentResponse[]> {
    const response = await api.get('/enrollment/my/')
    return response.data
  }
  
  // Obter detalhes de uma inscrição
  async getEnrollment(enrollmentId: string): Promise<EnrollmentResponse> {
    const response = await api.get(`/enrollment/${enrollmentId}/`)
    return response.data
  }
  
  // Cancelar inscrição
  async cancelEnrollment(enrollmentId: string): Promise<void> {
    await api.delete(`/enrollment/${enrollmentId}/`)
  }
  
  // Listar cursos disponíveis
  async getCourses(): Promise<Course[]> {
    const response = await api.get('/courses/')
    return response.data
  }
  
  // Obter detalhes de um curso
  async getCourse(courseId: string): Promise<Course> {
    const response = await api.get(`/courses/${courseId}/`)
    return response.data
  }
}

export const enrollmentService = new EnrollmentService()
