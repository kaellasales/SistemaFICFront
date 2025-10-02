// src/pages/professores/ProfessoresPage.tsx
import { useState, useEffect } from 'react'
import { useNavigate } from 'react-router-dom'
import { Card, CardContent, CardHeader, CardTitle, CardDescription } from '@/components/ui/Card'
import { Button } from '@/components/ui/Button'
import { Users, Plus } from 'lucide-react'
import  api  from "@/shared/services/api"

interface Professor {
  id: number
  first_name: string
  last_name: string
  email: string
  total_courses?: number
}

export function ProfessoresPage() {
  const navigate = useNavigate()
  const [professores, setProfessores] = useState<Professor[]>([])
  const [loading, setLoading] = useState(true)

  useEffect(() => {
    const fetchProfessores = async () => {
      try {
        const response = await api.get('/professor/')
        setProfessores(response.data)
      } catch (error) {
        console.error('Erro ao buscar professores:', error)
      } finally {
        setLoading(false)
      }
    }

    fetchProfessores()
  }, [])

  if (loading) {
    return (
      <div className="flex items-center justify-center min-h-screen">
        <p>Carregando professores...</p>
      </div>
    )
  }

  return (
    <div className="space-y-6 p-6">
      <div className="flex items-center justify-between">
        <h1 className="text-3xl font-bold text-secondary-900">Professores</h1>
        <Button 
          onClick={() => navigate('/professores/cadastrar')} 
          className="flex items-center space-x-2"
        >
          <Plus className="h-4 w-4" />
          <span>Cadastrar Professor</span>
        </Button>
      </div>

      {professores.length === 0 ? (
        <p>Nenhum professor cadastrado ainda.</p>
      ) : (
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
          {professores.map((prof) => (
            <Card 
              key={prof.id} 
              className="cursor-pointer hover:shadow-lg transition-shadow"
              onClick={() => navigate(`/professores/${prof.id}`)}
            >
              <CardHeader>
                <CardTitle>{prof.first_name} {prof.last_name}</CardTitle>
                <CardDescription>{prof.email}</CardDescription>
              </CardHeader>
              <CardContent className="flex items-center space-x-2">
                <Users className="h-5 w-5 text-blue-600" />
                <span>{prof.total_courses ?? 0} cursos</span>
              </CardContent>
            </Card>
          ))}
        </div>
      )}
    </div>
  )
}
