import { useState } from 'react'
import { useNavigate, useLocation, Link } from 'react-router-dom'
import { useForm } from 'react-hook-form'
import { zodResolver } from '@hookform/resolvers/zod'
import { z } from 'zod'
import { useAuthStore } from '@/shared/stores/authStore'
import { Logo } from '@/components/ui/Logo'
import api from "@/shared/services/api"

const loginSchema = z.object({
  email: z.string().email('Email inválido'),
  password: z.string().min(6, 'Senha deve ter pelo menos 6 caracteres'),
})

type LoginForm = z.infer<typeof loginSchema>

export function LoginPage() {
  const [isLoading, setIsLoading] = useState(false)
  const navigate = useNavigate()
  const location = useLocation()
  const { login } = useAuthStore()

  const {
    register,
    handleSubmit,
    formState: { errors },
  } = useForm<LoginForm>({
    resolver: zodResolver(loginSchema),
  })
  
  const [loginError, setLoginError] = useState<string | null>(null)
  
  const onSubmit = async (data: LoginForm) => {
    setIsLoading(true)
    setLoginError(null)

    try {
      // 1. pega access e refresh
      const tokenResponse = await api.post("/token/", {
        email: data.email,
        password: data.password,
      })

      const { access, refresh } = tokenResponse.data

      // 2. busca os dados do usuário em /me
      const meResponse = await api.get("/me", {
        headers: {
          Authorization: `Bearer ${access}`,
        },
      })

      const user = meResponse.data

      // 3. salva no store
      login(user, access, refresh)

      // 4. decide rota
      const from =
        location.state?.from?.pathname ||
        (user.roles?.includes("PROFESSOR") ? "/professor-dashboard" : "/dashboard")

      navigate(from, { replace: true })

    } catch (error: any) {
      if (error.response?.status === 401) {
        setLoginError("Usuário ou senha inválidos")
      } else {
        setLoginError("Erro ao conectar com o servidor")
      }
    } finally {
      setIsLoading(false)
    }
  }

  const handleInputChange = () => {
    if (loginError) setLoginError(null)
  }

  return (
    <div className="min-h-screen bg-white flex">
      {/* Esquerda */}
      <div className="hidden lg:flex lg:w-3/5 relative bg-white border-t-4 border-r-4 border-b-4 border-green-800 rounded-r-2xl">
        <div className="absolute bottom-0 left-0 w-[28rem] h-[28rem]">
          <img src="/tela.png" alt="MatriFIC" className="w-full h-full object-cover"/>
        </div>
        <div className="w-full h-full flex items-center justify-center">
          <div className="text-center">
            <h1 className="text-6xl font-bold text-green-800 leading-tight">
              Seu app para<br />Cursos Fic!
            </h1>
          </div>
        </div>
      </div>

      {/* Direita */}
      <div className="w-full lg:w-2/5 flex items-center justify-center p-12">
        <div className="w-full max-w-md">
          <h2 className="text-2xl font-bold text-green-800 mb-8 text-center">
            Bem-Vindo ao MatriFIC!
          </h2>

          <div className="flex justify-center mb-8">
            <div className="w-20 h-20 border-4 border-green-800 rounded-full flex items-center justify-center bg-white">
              <Logo size="lg" />
            </div>
          </div>

          <form onSubmit={handleSubmit(onSubmit)} className="space-y-4">
            <div>
              <input
                type="email"
                placeholder="Email"
                className={`w-full px-4 py-3 border rounded-lg focus:outline-none focus:ring-2 focus:ring-green-500 focus:border-transparent ${
                  errors.email ? 'border-red-500' : 'border-gray-300'
                }`}
                {...register('email', { onChange: handleInputChange })}
              />
              {errors.email && (
                <p className="text-red-500 text-sm mt-1">{errors.email.message}</p>
              )}
            </div>

            <div>
              <input
                type="password"
                placeholder="Senha"
                className={`w-full px-4 py-3 border rounded-lg focus:outline-none focus:ring-2 focus:ring-green-500 focus:border-transparent ${
                  errors.password ? 'border-red-500' : 'border-gray-300'
                }`}
                {...register('password', { onChange: handleInputChange })}
              />
              {errors.password && (
                <p className="text-red-500 text-sm mt-1">{errors.password.message}</p>
              )}
            </div>
            
            {loginError && (
              <p className="text-red-500 text-sm mb-2 text-center">
                {loginError}
              </p>
            )}

            <button
              type="submit"
              disabled={isLoading}
              className="w-full bg-green-800 text-white py-3 px-6 rounded-lg font-medium hover:bg-green-900 transition-colors disabled:opacity-50"
            >
              {isLoading ? 'Entrando...' : 'Confirmar'}
            </button>
          </form>

          <div className="mt-6 space-y-2 text-center">
            <a
              href="#"
              onClick={(e) => e.preventDefault()}
              className="block text-green-400 hover:text-green-600 text-sm"
            >
              Esqueci minha senha
            </a>
            <Link to="/register" className="block text-green-400 hover:text-green-600 text-sm">
              Ainda não tem conta? Cadastra-se
            </Link>
          </div>
        </div>
      </div>
    </div>
  )
}
