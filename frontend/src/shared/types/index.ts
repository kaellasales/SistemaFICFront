// Tipos de usuário
export type UserRole = 'candidate' | 'professor' | 'admin'

export interface User {
  id: string
  name: string
  email: string
  cpf: string
  phone?: string
  role: UserRole
  createdAt: string
  updatedAt: string
}

// Tipos de curso
export interface Course {
  id: string
  name: string
  description: string
  shortDescription: string
  workload: number
  maxSlots: number
  availableSlots: number
  enrollmentStartDate: string
  enrollmentEndDate: string
  courseStartDate: string
  courseEndDate: string
  professorId: string
  professor: User
  status: 'draft' | 'published' | 'cancelled' | 'completed'
  requirements: string[]
  content: string
  createdAt: string
  updatedAt: string
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

