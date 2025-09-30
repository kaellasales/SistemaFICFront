import api from './api'
import { User, UserRole, RegisterForm } from '@/shared/types'

export interface AdminRegisterForm {
  name: string
  email: string
  cpf: string
  phone?: string
  password: string
  confirmPassword: string
  adminCode: string // Código especial para criar admin
}

export interface ProfessorRegisterForm {
  name: string
  email: string
  cpf: string
  phone?: string
  password: string
  confirmPassword: string
  adminApproval?: boolean // Se precisa de aprovação de admin
}

export interface CandidateRegisterForm {
  name: string
  email: string
  cpf: string
  phone?: string
  password: string
  confirmPassword: string
  isIFCEStudent: boolean
}

class AuthService {
  // Cadastro de candidatos (público)
  async registerCandidate(data: CandidateRegisterForm) {
    const response = await api.post('/auth/register/candidate', {
      ...data,
      role: 'candidate'
    })
    return response.data
  }

  // Cadastro de professores (pode ser público ou requer aprovação)
  async registerProfessor(data: ProfessorRegisterForm) {
    // Validação adicional: verificar se o email institucional é válido
    if (!data.email.endsWith('@ifce.edu.br')) {
      throw new Error('Email deve ser institucional do IFCE (@ifce.edu.br)')
    }
    
    const response = await api.post('/auth/register/professor', {
      ...data,
      role: 'professor'
    })
    return response.data
  }

  // Cadastro de administradores (apenas por outros admins)
  async registerAdmin(data: AdminRegisterForm, adminToken: string) {
    const response = await api.post('/auth/register/admin', {
      ...data,
      role: 'admin'
    }, {
      headers: {
        Authorization: `Bearer ${adminToken}`
      }
    })
    return response.data
  }

  // Login para qualquer tipo de usuário
  async login(email: string, password: string) {
    const response = await api.post('/auth/login', { email, password })
    return response.data
  }

  // Verificar se email já existe
  async checkEmailExists(email: string) {
    const response = await api.get(`/auth/check-email/${email}`)
    return response.data
  }

  // Verificar se CPF já existe
  async checkCpfExists(cpf: string) {
    const response = await api.get(`/auth/check-cpf/${cpf}`)
    return response.data
  }

  // Solicitar aprovação de professor (se necessário)
  async requestProfessorApproval(professorId: string) {
    const response = await api.post(`/auth/request-professor-approval/${professorId}`)
    return response.data
  }

  // Aprovar professor (apenas admins)
  async approveProfessor(professorId: string, adminToken: string) {
    const response = await api.post(`/auth/approve-professor/${professorId}`, {}, {
      headers: {
        Authorization: `Bearer ${adminToken}`
      }
    })
    return response.data
  }

  // Listar professores pendentes (apenas admins)
  async getPendingProfessors(adminToken: string) {
    const response = await api.get('/auth/pending-professors', {
      headers: {
        Authorization: `Bearer ${adminToken}`
      }
    })
    return response.data
  }

  // Listar todos os usuários (apenas admins)
  async getAllUsers(adminToken: string, filters?: {
    role?: UserRole
    status?: 'active' | 'pending' | 'inactive'
    search?: string
  }) {
    const response = await api.get('/auth/users', {
      headers: {
        Authorization: `Bearer ${adminToken}`
      },
      params: filters
    })
    return response.data
  }

  // Atualizar role de usuário (apenas admins)
  async updateUserRole(userId: string, newRole: UserRole, adminToken: string) {
    const response = await api.patch(`/auth/users/${userId}/role`, {
      role: newRole
    }, {
      headers: {
        Authorization: `Bearer ${adminToken}`
      }
    })
    return response.data
  }

  // Desativar/ativar usuário (apenas admins)
  async toggleUserStatus(userId: string, adminToken: string) {
    const response = await api.patch(`/auth/users/${userId}/toggle-status`, {}, {
      headers: {
        Authorization: `Bearer ${adminToken}`
      }
    })
    return response.data
  }
}

export const authService = new AuthService()
