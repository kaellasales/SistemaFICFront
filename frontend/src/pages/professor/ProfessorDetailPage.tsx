// src/pages/professores/ProfessorDetailPage.tsx
import { useState, useEffect } from 'react'
import { useParams, useNavigate } from 'react-router-dom'
import { Card, CardContent, CardHeader, CardTitle, CardDescription } from '@/components/ui/Card'
import { Button } from '@/components/ui/Button'
import { BookOpen, CheckCircle, Clock } from 'lucide-react'
import  api  from "@/shared/services/api"

interface Curso {
  id: number
  title: string
  status: 'Completo' | 'Pendente' | 'Em andamento'
  enrollment_count: number
}

interface Professor {
  id: number
  first_name: string
  last_name: string
  email: string
  courses: Curso[]
}

export function ProfessorDetailPage() {
  const { id } = useParams<{ id: string }>()
  const navigate = useNavigate()
  const [professor, setProfessor] = useState<Professor | null>(null)
  const [loading, setLoading] = useState(true)

  useEffect(() => {
    const fetchProfessor = async () => {
      try {
        const response = await api.get(`/professor/${id}/`)
        setProfessor(response.data)
      } catch (error) {
        console.error('Erro ao buscar professor:', error)
      } finally {
        setLoading(false)
      }
    }
    if (id) {
    fetchProfessor();
    }
  }, [id])

  const getStatusIcon = (status: string) => {
    switch (status) {
      case 'Completo':
        return <CheckCircle className="h-4 w-4 text-green-600" />
      case 'Pendente':
        return <Clock className="h-4 w-4 text-yellow-600" />
      default:
        return <BookOpen className="h-4 w-4 text-blue-600" />
    }
  }

  if (loading) {
    return (
      <div className="flex items-center justify-center min-h-screen">
        <p>Carregando dados do professor...</p>
      </div>
    )
  }

  if (!professor) {
    return <p>Professor não encontrado.</p>
  }

  return (
    <div className="space-y-6 p-6">
      <Button onClick={() => navigate('/professores')} className="mb-4">
        Voltar para lista
      </Button>

      <Card>
        <CardHeader>
          <CardTitle>{professor.first_name} {professor.last_name}</CardTitle>
          <CardDescription>{professor.email}</CardDescription>
        </CardHeader>
      </Card>

      <h2 className="text-2xl font-bold text-secondary-900 mt-4">Cursos do Professor</h2>
      {professor.courses.length === 0 ? (
        <p>Este professor ainda não possui cursos cadastrados.</p>
      ) : (
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6 mt-4">
          {professor.courses.map((curso) => (
            <Card key={curso.id}>
              <CardHeader>
                <CardTitle>{curso.title}</CardTitle>
                <CardDescription>{curso.enrollment_count} inscrições</CardDescription>
              </CardHeader>
              <CardContent className="flex items-center space-x-2">
                {getStatusIcon(curso.status)}
                <span className={`font-medium ${
                  curso.status === 'Completo' ? 'text-green-600' : curso.status === 'Pendente' ? 'text-yellow-600' : 'text-blue-600'
                }`}>
                  {curso.status}
                </span>
              </CardContent>
            </Card>
          ))}
        </div>
      )}
    </div>
  )
}
