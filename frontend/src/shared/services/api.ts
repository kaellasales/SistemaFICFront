import axios from 'axios'
import { useAuthStore } from '@/shared/stores/authStore'

// Cria a instância do Axios
const api = axios.create({
  baseURL: (import.meta as any).env.VITE_API_URL || 'http://localhost:8080',
})

// Interceptor de requisição: adiciona token se existir
api.interceptors.request.use(
  (config) => {
    const token = useAuthStore.getState().accessToken
    if (token) {
      config.headers.Authorization = `Bearer ${token}`
    }
    return config
  },
  (error) => Promise.reject(error)
)

// Interceptor de resposta: trata erros globais
api.interceptors.response.use(
  (response) => response,
  (error) => {
    const originalRequest = error.config

    // Garantindo que originalRequest e URL existam
    if (
      error.response?.status === 401 &&
      originalRequest?.url &&
      !originalRequest.url.endsWith('/token/')
    ) {
      console.warn(
        "Interceptor: Token expirado ou inválido em rota protegida. Deslogando..."
      )

      // Limpa o estado global do usuário
      useAuthStore.getState().logout()

      // Redireciona para login
      window.location.href = '/login'
    }

    // Para qualquer outro erro (incluindo falha no /token/), apenas rejeita
    return Promise.reject(error)
  }
)

export default api
