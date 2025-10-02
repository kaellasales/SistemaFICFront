import api from './api'
import { User, UserRole, RegisterForm } from '@/shared/types'
import { useAuthStore } from '../stores/authStore'
import { console } from 'inspector'

export interface AdminRegisterForm {
  name: string
  email: string
  cpf: string
  phone?: string
  password: string
  confirmPassword: string
  adminCode: string // Código especial para criar admin
}

export interface ProfessorPayload { //EM UTILIZAÇÃO
  user:{
    first_name: string;
    last_name: string;
    email: string;
    password: string;
  };
  cpf: string;
  siape: string;
  data_nascimento: string | null;
}

export interface AlunoRegisterForm { //EM UTILIZAÇÃO
    first_name: string;
    last_name: string;
    email: string;
    password: string;
}

class AuthService {
  async registerAluno(data: AlunoRegisterForm) { //EM UTILIZAÇÃO
    const response = await api.post('/registro/aluno/', data);
    return response.data;
  }

  async registerProfessor(data: ProfessorPayload) { //EM UTILIZAÇÃO
    const response = await api.post('/professor/', data);
    return response.data;
  }


  // Cadastro de administradores (apenas por outros admins)(NAO ESTAMOS UTILIZANDO)
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


  async login(email: string, password: string) {
    const response = await api.post('/token/', { email, password })
    const { access_token, refresh_token } = response.data

    // obter dados do usuário logado
    const user = await this.me()

    // atualizar o Zustand store
    useAuthStore.getState().login(user, access_token, refresh_token)

      return { user, access_token, refresh_token }
    }

  async logout() {
    const refreshToken = localStorage.getItem('refresh_token')
    if (!refreshToken) return

    try {
      await api.post('/logout/', { refresh: refreshToken }, {
        headers: {
          Authorization: `Bearer ${localStorage.getItem('access_token')}`
        }
      })
    } catch {
      // mesmo que falhe, removemos tokens
    } finally {
      localStorage.removeItem('access_token')
      localStorage.removeItem('refresh_token')
      useAuthStore.getState().logout() // limpa Zustand store
    }
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
