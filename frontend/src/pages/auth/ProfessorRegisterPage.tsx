import { useState } from 'react'
import { Link, useNavigate } from 'react-router-dom'
import { useForm } from 'react-hook-form'
import { zodResolver } from '@hookform/resolvers/zod'
import { z } from 'zod'
import { Logo } from '@/components/ui/Logo'
import { authService } from '@/shared/services/authService'
import toast from 'react-hot-toast'

// Schema do Zod para validação do formulário
const professorRegisterSchema = z.object({
  first_name: z.string().min(2, 'Nome deve ter pelo menos 2 caracteres'),
  last_name: z.string().min(2, 'Sobrenome deve ter pelo menos 2 caracteres'),
  email: z.string()
    .email('Email inválido')
    .refine((email) => email.endsWith('@ifce.edu.br'), {
      message: 'Email deve ser institucional (@ifce.edu.br)'
    }),
  cpf: z.string().min(11, 'CPF deve ter pelo menos 11 dígitos'),
  siape: z.string().min(1, 'SIAPE é obrigatório'),
  data_nascimento: z.string().optional(), // input type="date"
  password: z.string().min(6, 'Senha deve ter pelo menos 6 caracteres'),
  confirmPassword: z.string(),
}).refine((data) => data.password === data.confirmPassword, {
  message: "As senhas não coincidem",
  path: ["confirmPassword"],
})

type ProfessorRegisterForm = z.infer<typeof professorRegisterSchema>

export function ProfessorRegisterPage() {
  const navigate = useNavigate()
  const [isLoading, setIsLoading] = useState(false)

  const { register, handleSubmit, formState: { errors } } = useForm<ProfessorRegisterForm>({
    resolver: zodResolver(professorRegisterSchema),
  })

  const onSubmit = async (data: ProfessorRegisterForm) => {
    setIsLoading(true)

    // Monta o payload aninhado conforme a API espera
    const payload = {
      user: {
        first_name: data.first_name,
        last_name: data.last_name,
        email: data.email,
        password: data.password,
      },
      siape: data.siape,
      cpf: data.cpf,
      data_nascimento: data.data_nascimento,
    }

    try {
      await authService.registerProfessor(payload)
      toast.success('Professor cadastrado com sucesso! Redirecionando...')
      setTimeout(() => navigate('/dashboard'), 2000)
    } catch (error: any) {
      const errorData = error.response?.data
      if (errorData) {
        Object.values(errorData).forEach((messages: any) => {
          if (Array.isArray(messages)) {
            messages.forEach((message: string) => toast.error(message))
          } else {
            toast.error(String(messages))
          }
        })
      } else {
        toast.error('Ocorreu um erro desconhecido ao cadastrar o professor.')
      }
    } finally {
      setIsLoading(false)
    }
  }

  return (
    <div className="min-h-screen bg-white flex items-center justify-center p-4">
      <div className="w-full max-w-md">
        <div className="border-2 border-green-800 rounded-lg p-8 bg-white">
          <h1 className="text-2xl font-bold text-green-800 text-center mb-2">
            Cadastro de Professor
          </h1>
          <p className="text-sm text-gray-600 text-center mb-6">
            Preencha os dados para criar um novo acesso de professor.
          </p>

          <div className="flex justify-center mb-8">
            <div className="w-16 h-16 border-2 border-green-800 rounded-full flex items-center justify-center bg-white">
              <Logo size="md" />
            </div>
          </div>

          <form onSubmit={handleSubmit(onSubmit)} className="space-y-4">
            {/* Nome e Sobrenome */}
            <div className="flex flex-col sm:flex-row sm:space-x-4 space-y-4 sm:space-y-0">
              <div className="w-full sm:w-1/2">
                <input
                  type="text"
                  placeholder="Nome"
                  className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-green-500"
                  {...register('first_name')}
                />
                {errors.first_name && <p className="text-red-500 text-xs mt-1">{errors.first_name.message}</p>}
              </div>
              <div className="w-full sm:w-1/2">
                <input
                  type="text"
                  placeholder="Sobrenome"
                  className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-green-500"
                  {...register('last_name')}
                />
                {errors.last_name && <p className="text-red-500 text-xs mt-1">{errors.last_name.message}</p>}
              </div>
            </div>

            {/* Email */}
            <div>
              <input
                type="email"
                placeholder="Email institucional (@ifce.edu.br)"
                className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-green-500"
                {...register('email')}
              />
              {errors.email && <p className="text-red-500 text-xs mt-1">{errors.email.message}</p>}
            </div>

            {/* CPF e SIAPE */}
            <div className="flex flex-col sm:flex-row sm:space-x-4 space-y-4 sm:space-y-0">
              <div className="w-full sm:w-1/2">
                <input
                  type="text"
                  placeholder="CPF"
                  className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-green-500"
                  {...register('cpf')}
                />
                {errors.cpf && <p className="text-red-500 text-xs mt-1">{errors.cpf.message}</p>}
              </div>
              <div className="w-full sm:w-1/2">
                <input
                  type="text"
                  placeholder="SIAPE"
                  className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-green-500"
                  {...register('siape')}
                />
                {errors.siape && <p className="text-red-500 text-xs mt-1">{errors.siape.message}</p>}
              </div>
            </div>

            {/* Data de nascimento */}
            <div>
              <label htmlFor="data_nascimento" className="text-sm text-gray-500 ml-1">Data de Nascimento (opcional)</label>
              <input
                id="data_nascimento"
                type="date"
                className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-green-500"
                {...register('data_nascimento')}
              />
              {errors.data_nascimento && <p className="text-red-500 text-xs mt-1">{errors.data_nascimento.message}</p>}
            </div>

            {/* Senha e confirmação */}
            <div>
              <input
                type="password"
                placeholder="Senha"
                className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-green-500"
                {...register('password')}
              />
              {errors.password && <p className="text-red-500 text-xs mt-1">{errors.password.message}</p>}
            </div>
            <div>
              <input
                type="password"
                placeholder="Confirmar senha"
                className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-green-500"
                {...register('confirmPassword')}
              />
              {errors.confirmPassword && <p className="text-red-500 text-xs mt-1">{errors.confirmPassword.message}</p>}
            </div>

            <button
              type="submit"
              disabled={isLoading}
              className="w-full bg-green-800 text-white py-3 px-4 rounded-md font-medium hover:bg-green-900 transition-colors disabled:opacity-50"
            >
              {isLoading ? 'Cadastrando...' : 'Cadastrar Professor'}
            </button>
          </form>

          <div className="mt-6 text-center">
            <p className="text-sm text-gray-600">
              <Link to="/dashboard" className="text-green-600 hover:text-green-700 font-medium">
                Voltar para a Dashboard
              </Link>
            </p>
          </div>
        </div>
      </div>
    </div>
  )
}
