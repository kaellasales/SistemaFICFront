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
  adminCode: string 
}

export interface AlunoPayload {
  user: {
    first_name: string;
    last_name: string;
    email: string;
    password: string;
  };
}

export interface ProfessorPayload {
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

class AuthService {
  async registerAluno(data: AlunoPayload) { //EM UTILIZAÇÃO
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


async me() {
    // Esta rota no seu backend deve ser protegida e retornar 
    // os dados do usuário autenticado (com base no token).
    const response = await api.get('/me/');
    return response.data;
  }

async login(email: string, password: string) {
  const response = await api.post('/token/', { email, password });
  const { access, refresh } = response.data;

  useAuthStore.getState().setTokens(access, refresh);

  // Atualiza o header manualmente antes de chamar `me()`
  api.defaults.headers.Authorization = `Bearer ${access}`;

  const user = await this.me();

  useAuthStore.getState().setUser(user);
  
  return { user, access, refresh };
}

async logout() {
  const refreshToken = localStorage.getItem('refresh_token')
  if (!refreshToken) {
    // Importante: também limpar headers mesmo sem refreshToken
    delete api.defaults.headers.Authorization
    useAuthStore.getState().logout()
    return
  }

  try {
    await api.post('/logout/', { refresh: refreshToken }, {
      headers: {
        Authorization: `Bearer ${localStorage.getItem('access_token')}`
      }
    })
  } catch {
    // mesmo que falhe, limpamos tudo
  } finally {
    localStorage.removeItem('access_token')
    localStorage.removeItem('refresh_token')

    // Aqui está o truque
    delete api.defaults.headers.Authorization

    // E limpa o Zustand + persist imediatamente
    useAuthStore.getState().logout()
    localStorage.removeItem('auth-storage')
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
