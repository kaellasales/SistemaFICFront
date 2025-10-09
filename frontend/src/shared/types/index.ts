// Tipos de usuário
export type UserGroup = 'ALUNO' | 'PROFESSOR' | 'CCA';

export interface User {
  id: number;
  email: string;
  first_name: string;
  last_name: string;
  groups: UserGroup[]; // Um array de strings, ex: ["ALUNO"]
}

export interface Professor {
  id: number;
  user: User; 
  siape: string;
  cpf: string;
  data_nascimento: string;
}

// Tipos de curso
export interface Course {
  id: number;
  nome: string;
  descricao: string;
  carga_horaria: number;
  vagas_internas: number;
  vagas_externas: number;
  data_inicio_inscricoes: string;
  data_fim_inscricoes: string;
  data_inicio_curso: string;
  data_fim_curso: string;
  status: string;
  criador: Professor; // Um curso é criado por um Professor
}

// Tipos de inscrição
export type EnrollmentStatus = 'pending' | 'under_review' | 'approved' | 'rejected'

export interface Enrollment {
  id: string
  courseId: string
  course: Course
  candidateId: string
  candidate: User
  status: EnrollmentStatus
  documents: Document[]
  rejectionReason?: string
  approvedAt?: string
  rejectedAt?: string
  createdAt: string
  updatedAt: string
}

// Tipos de documento
export interface Document {
  id: string
  enrollmentId: string
  name: string
  type: string
  url: string
  size: number
  mimeType: string
  status: 'pending' | 'approved' | 'rejected'
  rejectionReason?: string
  uploadedAt: string
}

// Tipos de certificado
export interface Certificate {
  id: string
  enrollmentId: string
  enrollment: Enrollment
  certificateNumber: string
  issuedAt: string
  downloadUrl: string
}

// Tipos de API
export interface ApiResponse<T> {
  data: T
  message: string
  success: boolean
}

export interface PaginatedResponse<T> {
  data: T[]
  total: number
  page: number
  limit: number
  totalPages: number
}

// Tipos de formulário
export interface LoginForm {
  email: string
  password: string
}

export interface RegisterForm {
  name: string
  email: string
  cpf: string
  phone?: string
  password: string
  confirmPassword: string
}

export interface CourseForm {
  name: string
  description: string
  shortDescription: string
  workload: number
  maxSlots: number
  enrollmentStartDate: string
  enrollmentEndDate: string
  courseStartDate: string
  courseEndDate: string
  requirements: string[]
  content: string
}

// Tipos de filtros
export interface CourseFilters {
  search?: string
  status?: Course['status']
  professorId?: string
  dateFrom?: string
  dateTo?: string
}

export interface EnrollmentFilters {
  search?: string
  status?: EnrollmentStatus
  courseId?: string
  dateFrom?: string
  dateTo?: string
}

// Tipos de notificação
export interface Notification {
  id: string
  userId: string
  title: string
  message: string
  type: 'info' | 'success' | 'warning' | 'error'
  read: boolean
  createdAt: string
}

