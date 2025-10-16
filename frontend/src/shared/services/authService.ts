import api from './api'
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


async me() {
    const response = await api.get('/me/');
    return response.data;
  }

  async login(email: string, password: string) {
    const response = await api.post('/token/', { email, password });
    const { access, refresh } = response.data;
    
    // A store é quem guarda o token. O interceptor vai ler daqui.
    useAuthStore.getState().setTokens(access, refresh);

    // Agora que o token está na store, a chamada 'me()' vai ser autenticada pelo interceptor.
    const user = await this.me();
    
    // Atualiza a store com todos os dados.
    useAuthStore.getState().setUser(user);
    
    return { user, access, refresh };
  }
  
async logout() {
  const refreshToken = localStorage.getItem('refresh_token')
  if (!refreshToken) {
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
  } finally {
    localStorage.removeItem('access_token')
    localStorage.removeItem('refresh_token')

    delete api.defaults.headers.Authorization

    useAuthStore.getState().logout()
    localStorage.removeItem('auth-storage')
  }
}

}



export const authService = new AuthService()
