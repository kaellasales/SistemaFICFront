import { useState } from 'react'
import { useNavigate, useLocation, Link } from 'react-router-dom'
import { useForm } from 'react-hook-form'
import { zodResolver } from '@hookform/resolvers/zod'
import { z } from 'zod'
import { useAuthStore } from '@/shared/stores/authStore'
import { Logo } from '@/components/ui/Logo'

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

  const onSubmit = async (data: LoginForm) => {
    setIsLoading(true)
    try {
      // Simular login - em produção, isso seria uma chamada para a API
      await new Promise(resolve => setTimeout(resolve, 1000))
      
      // Determinar role baseado no email
      let role: 'candidate' | 'professor' | 'admin' = 'candidate'
      let name = 'Usuário Teste'
      
      if (data.email.includes('@ifce.edu.br')) {
        role = 'professor'
        // Extrair nome do email (parte antes do @)
        const emailName = data.email.split('@')[0]
        name = `Prof. ${emailName.charAt(0).toUpperCase() + emailName.slice(1)}`
      } else if (data.email.includes('admin')) {
        role = 'admin'
        name = 'Administrador'
      } else if (data.email === 'joao@ifce.edu.br') {
        role = 'professor'
        name = 'Prof. Joao'
      }
      
      // Mock de usuário - em produção, viria da API
      const mockUser = {
        id: '1',
        name: name,
        email: data.email,
        cpf: '123.456.789-00',
        phone: '(85) 99999-9999',
        role: role,
        createdAt: new Date().toISOString(),
        updatedAt: new Date().toISOString(),
      }
      
      const mockToken = 'mock-jwt-token'
      
      login(mockUser, mockToken)
      
      // Redirecionar para a página que o usuário tentou acessar ou dashboard
      const from = location.state?.from?.pathname || (role === 'professor' ? '/professor-dashboard' : '/dashboard')
      navigate(from, { replace: true })
    } catch (error) {
      console.error('Erro no login:', error)
    } finally {
      setIsLoading(false)
    }
  }


  return (
    <div className="min-h-screen bg-white flex">
      {/* Seção Esquerda - Imagem */}
      <div className="hidden lg:flex lg:w-3/5 relative bg-white border-t-4 border-r-4 border-b-4 border-green-800 rounded-r-2xl">
        {/* Imagem no cantinho */}
        <div className="absolute bottom-0 left-0 w-[28rem] h-[28rem]">
          <img 
            src="/tela.png" 
            alt="MatriFIC" 
            className="w-full h-full object-cover"
          />
        </div>
        
        {/* Texto centralizado */}
        <div className="w-full h-full flex items-center justify-center">
          <div className="text-center">
            <h1 className="text-6xl font-bold text-green-800 leading-tight">
              Seu app para<br />
              Cursos Fic!
            </h1>
          </div>
        </div>
      </div>

      {/* Seção Direita - Formulário de Login */}
      <div className="w-full lg:w-2/5 flex items-center justify-center p-12">
        <div className="w-full max-w-md">
          {/* Título */}
          <h2 className="text-2xl font-bold text-green-800 mb-8 text-center">
            Bem-Vindo ao MatriFIC!
          </h2>

          {/* Logo */}
          <div className="flex justify-center mb-8">
            <div className="w-20 h-20 border-4 border-green-800 rounded-full flex items-center justify-center bg-white">
              <Logo size="lg" />
            </div>
          </div>



          {/* Formulário */}
          <form onSubmit={handleSubmit(onSubmit)} className="space-y-4">
            <div>
              <input
                type="email"
                placeholder="Email"
                className="w-full px-4 py-3 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-green-500 focus:border-transparent"
                {...register('email')}
              />
              {errors.email && (
                <p className="text-red-500 text-sm mt-1">{errors.email.message}</p>
              )}
            </div>

            <div>
              <input
                type="password"
                placeholder="Senha"
                className="w-full px-4 py-3 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-green-500 focus:border-transparent"
                {...register('password')}
              />
              {errors.password && (
                <p className="text-red-500 text-sm mt-1">{errors.password.message}</p>
              )}
            </div>

            <button
              type="submit"
              disabled={isLoading}
              className="w-full bg-green-800 text-white py-3 px-6 rounded-lg font-medium hover:bg-green-900 transition-colors disabled:opacity-50"
            >
              {isLoading ? 'Entrando...' : 'Confirmar'}
            </button>
          </form>

          {/* Links */}
          <div className="mt-6 space-y-2 text-center">
            <a href="#" className="block text-green-400 hover:text-green-600 text-sm">
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
