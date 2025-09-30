import { useState } from 'react'
import { Link } from 'react-router-dom'
import { useForm } from 'react-hook-form'
import { zodResolver } from '@hookform/resolvers/zod'
import { z } from 'zod'
import { Logo } from '@/components/ui/Logo'
import { authService } from '@/shared/services/authService'

const registerSchema = z.object({
  name: z.string().min(2, 'Nome deve ter pelo menos 2 caracteres'),
  email: z.string().email('Email inválido'),
  cpf: z.string().min(11, 'CPF deve ter 11 dígitos'),
  phone: z.string().optional(),
  password: z.string().min(6, 'Senha deve ter pelo menos 6 caracteres'),
  confirmPassword: z.string(),
  isIFCEStudent: z.boolean().default(false),
}).refine((data) => data.password === data.confirmPassword, {
  message: "Senhas não coincidem",
  path: ["confirmPassword"],
})

type RegisterForm = z.infer<typeof registerSchema>

export function RegisterPage() {
  const [isLoading, setIsLoading] = useState(false)
  const [success, setSuccess] = useState(false)
  const [error, setError] = useState('')

  const {
    register,
    handleSubmit,
    formState: { errors },
  } = useForm<RegisterForm>({
    resolver: zodResolver(registerSchema),
  })

  const onSubmit = async (data: RegisterForm) => {
    setIsLoading(true)
    setError('')
    
    try {
      await authService.registerCandidate(data)
      setSuccess(true)
    } catch (error: any) {
      setError(error.response?.data?.message || 'Erro ao cadastrar candidato')
    } finally {
      setIsLoading(false)
    }
  }

  if (success) {
    return (
      <div className="min-h-screen bg-white flex items-center justify-center p-4">
        <div className="w-full max-w-md">
          <div className="border-2 border-green-800 rounded-lg p-8 bg-white text-center">
            <div className="w-16 h-16 bg-green-100 rounded-full flex items-center justify-center mx-auto mb-4">
              <svg className="w-8 h-8 text-green-600" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M5 13l4 4L19 7" />
              </svg>
            </div>
            <h2 className="text-2xl font-bold text-green-800 mb-4">Cadastro Realizado!</h2>
            <p className="text-gray-600 mb-6">
              Seu cadastro foi realizado com sucesso. Agora você pode fazer login.
            </p>
            <Link 
              to="/login" 
              className="bg-green-800 text-white py-2 px-4 rounded-md font-medium hover:bg-green-900 transition-colors"
            >
              Ir para Login
            </Link>
          </div>
        </div>
      </div>
    )
  }

  return (
    <div className="min-h-screen bg-white flex items-center justify-center p-4">
      <div className="w-full max-w-md">
        {/* Container principal com borda verde */}
        <div className="border-2 border-green-800 rounded-lg p-8 bg-white">
          {/* Título */}
          <h1 className="text-2xl font-bold text-green-800 text-center mb-6">
            Faça seu cadastro
          </h1>

          {/* Logo */}
          <div className="flex justify-center mb-8">
            <div className="w-16 h-16 border-2 border-green-800 rounded-full flex items-center justify-center bg-white">
              <Logo size="md" />
            </div>
          </div>

          {/* Mensagem de erro */}
          {error && (
            <div className="bg-red-50 border border-red-200 text-red-700 px-4 py-3 rounded mb-4">
              {error}
            </div>
          )}

          {/* Formulário */}
          <form onSubmit={handleSubmit(onSubmit)} className="space-y-4">
            {/* Nome */}
            <div>
              <input
                type="text"
                placeholder="Nome completo"
                className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-green-500 focus:border-transparent"
                {...register('name')}
              />
              {errors.name && (
                <p className="text-red-500 text-xs mt-1">{errors.name.message}</p>
              )}
            </div>

            {/* Email */}
            <div>
              <input
                type="email"
                placeholder="Email"
                className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-green-500 focus:border-transparent"
                {...register('email')}
              />
              {errors.email && (
                <p className="text-red-500 text-xs mt-1">{errors.email.message}</p>
              )}
            </div>

            {/* CPF */}
            <div>
              <input
                type="text"
                placeholder="CPF (apenas números)"
                className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-green-500 focus:border-transparent"
                {...register('cpf')}
              />
              {errors.cpf && (
                <p className="text-red-500 text-xs mt-1">{errors.cpf.message}</p>
              )}
            </div>

            {/* Telefone */}
            <div>
              <input
                type="tel"
                placeholder="Telefone (opcional)"
                className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-green-500 focus:border-transparent"
                {...register('phone')}
              />
              {errors.phone && (
                <p className="text-red-500 text-xs mt-1">{errors.phone.message}</p>
              )}
            </div>

            {/* Senha */}
            <div>
              <input
                type="password"
                placeholder="Senha"
                className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-green-500 focus:border-transparent"
                {...register('password')}
              />
              {errors.password && (
                <p className="text-red-500 text-xs mt-1">{errors.password.message}</p>
              )}
            </div>

            {/* Confirmar Senha */}
            <div>
              <input
                type="password"
                placeholder="Confirmar senha"
                className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-green-500 focus:border-transparent"
                {...register('confirmPassword')}
              />
              {errors.confirmPassword && (
                <p className="text-red-500 text-xs mt-1">{errors.confirmPassword.message}</p>
              )}
            </div>

            {/* Checkbox */}
            <div className="flex items-center space-x-2">
              <input
                type="checkbox"
                id="isIFCEStudent"
                className="w-4 h-4 text-green-600 border-gray-300 rounded focus:ring-green-500"
                {...register('isIFCEStudent')}
              />
              <label htmlFor="isIFCEStudent" className="text-sm text-gray-700">
                É aluno do IFCE?
              </label>
            </div>

            {/* Botão de confirmação */}
            <button
              type="submit"
              disabled={isLoading}
              className="w-full bg-green-800 text-white py-2 px-4 rounded-md font-medium hover:bg-green-900 transition-colors disabled:opacity-50"
            >
              {isLoading ? 'Cadastrando...' : 'Confirmar'}
            </button>
          </form>

          {/* Links */}
          <div className="mt-6 space-y-2 text-center">
            <p className="text-sm text-gray-600">
              Já tem uma conta?{' '}
              <Link to="/login" className="text-green-600 hover:text-green-700 font-medium">
                Entre aqui
              </Link>
            </p>
            <p className="text-sm text-gray-600">
              É professor?{' '}
              <Link to="/register/professor" className="text-green-600 hover:text-green-700 font-medium">
                Cadastre-se como professor
              </Link>
            </p>
          </div>
        </div>
      </div>
    </div>
  )
}
