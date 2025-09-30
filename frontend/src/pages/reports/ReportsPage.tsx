import { useState } from 'react'
import { BarChart3, Download, TrendingUp, Users, BookOpen, Award, FileText } from 'lucide-react'
import { Button } from '@/components/ui/Button'
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/Card'
import { useAuthStore } from '@/shared/stores/authStore'

export function ReportsPage() {
  const { user } = useAuthStore()
  const [selectedPeriod, setSelectedPeriod] = useState('30')

  // Mock data - em produção, viria da API
  const reportData = {
    overview: {
      totalCourses: 28,
      totalEnrollments: 342,
      totalApproved: 156,
      totalCertificates: 89,
    },
    courseStats: [
      { name: 'Programação Web', enrollments: 45, approved: 38, certificates: 35 },
      { name: 'Design Gráfico', enrollments: 32, approved: 28, certificates: 25 },
      { name: 'Excel Avançado', enrollments: 28, approved: 24, certificates: 22 },
      { name: 'Python Básico', enrollments: 25, approved: 20, certificates: 18 },
    ],
    monthlyData: [
      { month: 'Jan', enrollments: 45, approved: 38 },
      { month: 'Fev', enrollments: 52, approved: 42 },
      { month: 'Mar', enrollments: 38, approved: 32 },
      { month: 'Abr', enrollments: 41, approved: 35 },
    ],
  }

  const handleExportReport = (type: string) => {
    // Em produção, isso exportaria o relatório
    console.log('Exporting report:', type)
  }

  return (
    <div className="space-y-6">
      <div className="flex items-center justify-between">
        <div>
          <h1 className="text-3xl font-bold text-secondary-900">Relatórios</h1>
          <p className="text-secondary-600 mt-2">
            {user?.role === 'professor' 
              ? 'Acompanhe o desempenho dos seus cursos'
              : 'Visualize estatísticas gerais do sistema'
            }
          </p>
        </div>
        
        <div className="flex space-x-2">
          <select 
            value={selectedPeriod}
            onChange={(e) => setSelectedPeriod(e.target.value)}
            className="px-3 py-2 border border-secondary-300 rounded-md text-sm"
          >
            <option value="7">Últimos 7 dias</option>
            <option value="30">Últimos 30 dias</option>
            <option value="90">Últimos 90 dias</option>
            <option value="365">Último ano</option>
          </select>
          
          <Button variant="outline">
            <Download className="h-4 w-4 mr-2" />
            Exportar
          </Button>
        </div>
      </div>

      {/* Estatísticas Gerais */}
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
        <Card>
          <CardContent className="p-6">
            <div className="flex items-center justify-between">
              <div>
                <p className="text-sm font-medium text-secondary-600">
                  Total de Cursos
                </p>
                <p className="text-3xl font-bold text-secondary-900">
                  {reportData.overview.totalCourses}
                </p>
              </div>
              <BookOpen className="h-8 w-8 text-primary-600" />
            </div>
          </CardContent>
        </Card>

        <Card>
          <CardContent className="p-6">
            <div className="flex items-center justify-between">
              <div>
                <p className="text-sm font-medium text-secondary-600">
                  Total de Inscrições
                </p>
                <p className="text-3xl font-bold text-secondary-900">
                  {reportData.overview.totalEnrollments}
                </p>
              </div>
              <FileText className="h-8 w-8 text-blue-600" />
            </div>
          </CardContent>
        </Card>

        <Card>
          <CardContent className="p-6">
            <div className="flex items-center justify-between">
              <div>
                <p className="text-sm font-medium text-secondary-600">
                  Aprovados
                </p>
                <p className="text-3xl font-bold text-secondary-900">
                  {reportData.overview.totalApproved}
                </p>
              </div>
              <Users className="h-8 w-8 text-green-600" />
            </div>
          </CardContent>
        </Card>

        <Card>
          <CardContent className="p-6">
            <div className="flex items-center justify-between">
              <div>
                <p className="text-sm font-medium text-secondary-600">
                  Certificados Emitidos
                </p>
                <p className="text-3xl font-bold text-secondary-900">
                  {reportData.overview.totalCertificates}
                </p>
              </div>
              <Award className="h-8 w-8 text-purple-600" />
            </div>
          </CardContent>
        </Card>
      </div>

      {/* Gráficos e Tabelas */}
      <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
        {/* Estatísticas por Curso */}
        <Card>
          <CardHeader>
            <CardTitle>Estatísticas por Curso</CardTitle>
            <CardDescription>
              Inscrições, aprovações e certificados por curso
            </CardDescription>
          </CardHeader>
          <CardContent>
            <div className="space-y-4">
              {reportData.courseStats.map((course, index) => (
                <div key={index} className="border border-secondary-200 rounded-lg p-4">
                  <div className="flex items-center justify-between mb-2">
                    <h4 className="font-medium text-secondary-900">{course.name}</h4>
                    <span className="text-sm text-secondary-600">
                      {Math.round((course.approved / course.enrollments) * 100)}% aprovação
                    </span>
                  </div>
                  
                  <div className="grid grid-cols-3 gap-4 text-sm">
                    <div className="text-center">
                      <p className="font-medium text-blue-600">{course.enrollments}</p>
                      <p className="text-secondary-600">Inscrições</p>
                    </div>
                    <div className="text-center">
                      <p className="font-medium text-green-600">{course.approved}</p>
                      <p className="text-secondary-600">Aprovados</p>
                    </div>
                    <div className="text-center">
                      <p className="font-medium text-purple-600">{course.certificates}</p>
                      <p className="text-secondary-600">Certificados</p>
                    </div>
                  </div>
                </div>
              ))}
            </div>
          </CardContent>
        </Card>

        {/* Tendências Mensais */}
        <Card>
          <CardHeader>
            <CardTitle>Tendências Mensais</CardTitle>
            <CardDescription>
              Evolução das inscrições e aprovações
            </CardDescription>
          </CardHeader>
          <CardContent>
            <div className="space-y-4">
              {reportData.monthlyData.map((month, index) => (
                <div key={index} className="flex items-center justify-between p-3 border border-secondary-200 rounded-lg">
                  <div className="flex items-center space-x-3">
                    <div className="h-8 w-8 bg-primary-100 rounded-full flex items-center justify-center">
                      <TrendingUp className="h-4 w-4 text-primary-600" />
                    </div>
                    <div>
                      <p className="font-medium text-secondary-900">{month.month}</p>
                      <p className="text-sm text-secondary-600">
                        {month.enrollments} inscrições, {month.approved} aprovados
                      </p>
                    </div>
                  </div>
                  
                  <div className="text-right">
                    <p className="text-sm font-medium text-green-600">
                      {Math.round((month.approved / month.enrollments) * 100)}%
                    </p>
                    <p className="text-xs text-secondary-600">taxa aprovação</p>
                  </div>
                </div>
              ))}
            </div>
          </CardContent>
        </Card>
      </div>

      {/* Relatórios Disponíveis */}
      <Card>
        <CardHeader>
          <CardTitle>Relatórios Disponíveis</CardTitle>
          <CardDescription>
            Exporte relatórios detalhados em diferentes formatos
          </CardDescription>
        </CardHeader>
        <CardContent>
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
            <div className="border border-secondary-200 rounded-lg p-4">
              <div className="flex items-center space-x-3 mb-3">
                <BarChart3 className="h-5 w-5 text-primary-600" />
                <h4 className="font-medium">Relatório de Cursos</h4>
              </div>
              <p className="text-sm text-secondary-600 mb-3">
                Estatísticas detalhadas de todos os cursos
              </p>
              <Button 
                variant="outline" 
                size="sm"
                onClick={() => handleExportReport('courses')}
              >
                <Download className="h-4 w-4 mr-1" />
                Exportar
              </Button>
            </div>

            <div className="border border-secondary-200 rounded-lg p-4">
              <div className="flex items-center space-x-3 mb-3">
                <Users className="h-5 w-5 text-blue-600" />
                <h4 className="font-medium">Relatório de Usuários</h4>
              </div>
              <p className="text-sm text-secondary-600 mb-3">
                Dados dos usuários e suas atividades
              </p>
              <Button 
                variant="outline" 
                size="sm"
                onClick={() => handleExportReport('users')}
              >
                <Download className="h-4 w-4 mr-1" />
                Exportar
              </Button>
            </div>

            <div className="border border-secondary-200 rounded-lg p-4">
              <div className="flex items-center space-x-3 mb-3">
                <Award className="h-5 w-5 text-green-600" />
                <h4 className="font-medium">Relatório de Certificados</h4>
              </div>
              <p className="text-sm text-secondary-600 mb-3">
                Lista de certificados emitidos
              </p>
              <Button 
                variant="outline" 
                size="sm"
                onClick={() => handleExportReport('certificates')}
              >
                <Download className="h-4 w-4 mr-1" />
                Exportar
              </Button>
            </div>
          </div>
        </CardContent>
      </Card>
    </div>
  )
}

