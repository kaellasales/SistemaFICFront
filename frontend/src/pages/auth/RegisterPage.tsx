import { useState } from 'react'
import { useNavigate, useLocation, Link } from 'react-router-dom'
import { useForm } from 'react-hook-form'
import { zodResolver } from '@hookform/resolvers/zod'
import { z } from 'zod'
import { Logo } from '@/components/ui/Logo'
import { authService } from '@/shared/services/authService'
import toast from 'react-hot-toast'

const registerSchema = z
  .object({
    first_name: z.string().min(2, 'Primeiro nome deve ter pelo menos 2 caracteres'),
    last_name: z.string().min(2, 'Sobrenome deve ter pelo menos 2 caracteres'),
    email: z.string().email('Email inválido'),
    password: z
      .string()
      .min(6, 'Senha deve ter pelo menos 6 caracteres')
      .regex(/^(?=.*[A-Za-z0-9]).*$/, 'Senha deve conter letras e números'),
    confirmPassword: z.string(),
  })
  .refine((data) => data.password === data.confirmPassword, {
    message: 'Senhas não coincidem',
    path: ['confirmPassword'],
  })

type RegisterForm = z.infer<typeof registerSchema>

export function RegisterPage() {
  const [isLoading, setIsLoading] = useState(false)
  const [success, setSuccess] = useState(false)
  const [emailError, setEmailError] = useState('')
  const [error, setError] = useState('')
  const navigate = useNavigate()

  const {
    register,
    handleSubmit,
    formState: { errors },
    watch,
    reset, // <- adiciona isso
  } = useForm<RegisterForm>({
    resolver: zodResolver(registerSchema),
  })

  // Reatividade: limpa erros globais e de email ao digitar
  const handleInputChange = (field?: string) => {
    if (error && !field) setError('')
    if (field === 'email' && emailError) setEmailError('')
  }

  const onSubmit = async (data: RegisterForm) => {
    setIsLoading(true)
    setError('')
    setEmailError('')

    const payload = {
        first_name: data.first_name,
        last_name: data.last_name,
        email: data.email,
        password: data.password,
    }

    try {
      await authService.registerAluno(payload)
      toast.success('Cadastro realizado com sucesso!')
      reset()
      setTimeout(() => navigate('/login'), 2000)

    }catch (err: any) {
      const msg = err.response?.data?.message || 'Erro ao cadastrar usuário'

      
      if (msg.toLowerCase().includes('email')) {
        setEmailError('Este email já está cadastrado') 
      } else {
        setError(msg)
      }
    }finally {
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
        <div className="border-2 border-green-800 rounded-lg p-8 bg-white">
          <h1 className="text-2xl font-bold text-green-800 text-center mb-6">
            Faça seu cadastro
          </h1>

          <div className="flex justify-center mb-8">
            <div className="w-16 h-16 border-2 border-green-800 rounded-full flex items-center justify-center bg-white">
              <Logo size="md" />
            </div>
          </div>

          {error && (
            <div className="bg-red-50 border border-red-200 text-red-700 px-4 py-3 rounded mb-4">
              {error}
            </div>
          )}

          <form onSubmit={handleSubmit(onSubmit)} className="space-y-4">
            {/* Primeiro Nome */}
            <div>
              <input
                type="text"
                placeholder="Primeiro nome"
                className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-green-500 focus:border-transparent"
                {...register('first_name', { onChange: () => handleInputChange() })}
              />
              {errors.first_name && (
                <p className="text-red-500 text-xs mt-1">{errors.first_name.message}</p>
              )}
            </div>

            {/* Sobrenome */}
            <div>
              <input
                type="text"
                placeholder="Sobrenome"
                className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-green-500 focus:border-transparent"
                {...register('last_name', { onChange: () => handleInputChange() })}
              />
              {errors.last_name && (
                <p className="text-red-500 text-xs mt-1">{errors.last_name.message}</p>
              )}
            </div>

            {/* Email */}
            <div>
              <input
                type="email"
                placeholder="Email"
                className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-green-500 focus:border-transparent"
                {...register('email', { onChange: () => handleInputChange('email') })}
              />
              {(errors.email || emailError) && (
                <p className="text-red-500 text-xs mt-1">{errors.email?.message || emailError}</p>
              )}
            </div>

            {/* Senha */}
            <div>
              <input
                type="password"
                placeholder="Senha"
                className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-green-500 focus:border-transparent"
                {...register('password', { onChange: () => handleInputChange() })}
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
                {...register('confirmPassword', { onChange: () => handleInputChange() })}
              />
              {errors.confirmPassword && (
                <p className="text-red-500 text-xs mt-1">{errors.confirmPassword.message}</p>
              )}
            </div>

            <button
              type="submit"
              disabled={isLoading}
              className="w-full bg-green-800 text-white py-2 px-4 rounded-md font-medium hover:bg-green-900 transition-colors disabled:opacity-50"
            >
              {isLoading ? 'Cadastrando...' : 'Confirmar'}
            </button>
          </form>

          <div className="mt-6 space-y-2 text-center">
            <p className="text-sm text-gray-600">
              Já tem uma conta?{' '}
              <Link to="/login" className="text-green-600 hover:text-green-700 font-medium">
                Entre aqui
              </Link>
            </p>
          </div>
        </div>
      </div>
    </div>
  )
}
