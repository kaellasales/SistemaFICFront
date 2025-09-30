import { useState } from 'react'
import { Search, Download, Award, Calendar, User, BookOpen } from 'lucide-react'
import { Button } from '@/components/ui/Button'
import { Input } from '@/components/ui/Input'
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/Card'
import { useAuthStore } from '@/shared/stores/authStore'

export function CertificatesPage() {
  const { user } = useAuthStore()
  const [searchTerm, setSearchTerm] = useState('')

  // Mock data - em produção, viria da API
  const certificates = [
    {
      id: '1',
      certificateNumber: 'CERT-2024-001',
      course: { name: 'Excel Avançado' },
      candidate: { name: 'Jhonata Vieira' },
      issuedAt: '2024-01-15',
      downloadUrl: '#',
    },
    {
      id: '2',
      certificateNumber: 'CERT-2024-002',
      course: { name: 'Design Gráfico Digital' },
      candidate: { name: 'Jhonata Vieira' },
      issuedAt: '2024-01-10',
      downloadUrl: '#',
    },
    {
      id: '3',
      certificateNumber: 'CERT-2024-003',
      course: { name: 'Programação Web com React' },
      candidate: { name: 'Jhonata Vieira' },
      issuedAt: '2024-01-05',
      downloadUrl: '#',
    },
  ]

  const filteredCertificates = certificates.filter(certificate =>
    certificate.course.name.toLowerCase().includes(searchTerm.toLowerCase()) ||
    certificate.candidate.name.toLowerCase().includes(searchTerm.toLowerCase()) ||
    certificate.certificateNumber.toLowerCase().includes(searchTerm.toLowerCase())
  )

  const handleDownload = (certificateId: string) => {
    // Em produção, isso faria o download do certificado
    console.log('Downloading certificate:', certificateId)
  }

  return (
    <div className="space-y-6">
      <div className="flex items-center justify-between">
        <div>
          <h1 className="text-3xl font-bold text-secondary-900">Certificados</h1>
          <p className="text-secondary-600 mt-2">
            {user?.role === 'candidate' 
              ? 'Visualize e baixe seus certificados de conclusão'
              : 'Gerencie e emita certificados para alunos aprovados'
            }
          </p>
        </div>
      </div>

      {/* Filtros e Busca */}
      <div className="flex flex-col sm:flex-row gap-4">
        <div className="flex-1">
          <div className="relative">
            <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 h-4 w-4 text-secondary-500" />
            <Input
              placeholder="Buscar certificados..."
              value={searchTerm}
              onChange={(e) => setSearchTerm(e.target.value)}
              className="pl-10"
            />
          </div>
        </div>
      </div>

      {/* Lista de Certificados */}
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
        {filteredCertificates.map((certificate) => (
          <Card key={certificate.id} className="hover:shadow-lg transition-shadow">
            <CardHeader>
              <div className="flex items-center space-x-3">
                <div className="h-12 w-12 bg-primary-100 rounded-full flex items-center justify-center">
                  <Award className="h-6 w-6 text-primary-600" />
                </div>
                <div className="flex-1">
                  <CardTitle className="text-lg">{certificate.course.name}</CardTitle>
                  <CardDescription>
                    Certificado de Conclusão
                  </CardDescription>
                </div>
              </div>
            </CardHeader>
            
            <CardContent>
              <div className="space-y-3">
                <div className="flex items-center text-sm text-secondary-600">
                  <User className="h-4 w-4 mr-2" />
                  {certificate.candidate.name}
                </div>
                
                <div className="flex items-center text-sm text-secondary-600">
                  <BookOpen className="h-4 w-4 mr-2" />
                  {certificate.certificateNumber}
                </div>
                
                <div className="flex items-center text-sm text-secondary-600">
                  <Calendar className="h-4 w-4 mr-2" />
                  Emitido em {new Date(certificate.issuedAt).toLocaleDateString('pt-BR')}
                </div>
              </div>
              
              <div className="mt-4 pt-4 border-t border-secondary-200">
                <Button 
                  className="w-full"
                  onClick={() => handleDownload(certificate.id)}
                >
                  <Download className="h-4 w-4 mr-2" />
                  Baixar Certificado
                </Button>
              </div>
            </CardContent>
          </Card>
        ))}
      </div>

      {filteredCertificates.length === 0 && (
        <div className="text-center py-12">
          <Award className="h-12 w-12 text-secondary-400 mx-auto mb-4" />
          <h3 className="text-lg font-medium text-secondary-900 mb-2">
            Nenhum certificado encontrado
          </h3>
          <p className="text-secondary-600">
            {user?.role === 'candidate' 
              ? 'Você ainda não possui certificados. Complete um curso para receber o seu!'
              : 'Não há certificados que correspondam aos filtros aplicados.'
            }
          </p>
        </div>
      )}
    </div>
  )
}

