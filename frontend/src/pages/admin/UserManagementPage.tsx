import { useState, useEffect } from 'react'
import { useAuthStore } from '@/shared/stores/authStore'
import { authService } from '@/shared/services/authService'
import { User, UserRole } from '@/shared/types'
import { Search, Filter, UserPlus, Shield, GraduationCap, Users, CheckCircle, XCircle, Clock } from 'lucide-react'
import { Button } from '@/components/ui/Button'
import { Input } from '@/components/ui/Input'
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/Card'

export function UserManagementPage() {
  const { user: currentUser } = useAuthStore()
  const [users, setUsers] = useState<User[]>([])
  const [pendingProfessors, setPendingProfessors] = useState<User[]>([])
  const [isLoading, setIsLoading] = useState(true)
  const [searchTerm, setSearchTerm] = useState('')
  const [roleFilter, setRoleFilter] = useState<UserRole | 'all'>('all')
  const [showAdminForm, setShowAdminForm] = useState(false)

  // Verificar se o usuário atual é admin
  if (currentUser?.role !== 'admin') {
    return (
      <div className="min-h-screen bg-white flex items-center justify-center">
        <div className="text-center">
          <Shield className="h-16 w-16 text-red-500 mx-auto mb-4" />
          <h2 className="text-2xl font-bold text-gray-900 mb-2">Acesso Negado</h2>
          <p className="text-gray-600">Apenas administradores podem acessar esta página.</p>
        </div>
      </div>
    )
  }

  useEffect(() => {
    loadUsers()
    loadPendingProfessors()
  }, [])

  const loadUsers = async () => {
    try {
      const response = await authService.getAllUsers(currentUser?.token || '')
      setUsers(response.data)
    } catch (error) {
      console.error('Erro ao carregar usuários:', error)
    } finally {
      setIsLoading(false)
    }
  }

  const loadPendingProfessors = async () => {
    try {
      const response = await authService.getPendingProfessors(currentUser?.token || '')
      setPendingProfessors(response.data)
    } catch (error) {
      console.error('Erro ao carregar professores pendentes:', error)
    }
  }

  const handleApproveProfessor = async (professorId: string) => {
    try {
      await authService.approveProfessor(professorId, currentUser?.token || '')
      await loadPendingProfessors()
      await loadUsers()
    } catch (error) {
      console.error('Erro ao aprovar professor:', error)
    }
  }

  const handleUpdateUserRole = async (userId: string, newRole: UserRole) => {
    try {
      await authService.updateUserRole(userId, newRole, currentUser?.token || '')
      await loadUsers()
    } catch (error) {
      console.error('Erro ao atualizar role do usuário:', error)
    }
  }

  const handleToggleUserStatus = async (userId: string) => {
    try {
      await authService.toggleUserStatus(userId, currentUser?.token || '')
      await loadUsers()
    } catch (error) {
      console.error('Erro ao alterar status do usuário:', error)
    }
  }

  const filteredUsers = users.filter(user => {
    const matchesSearch = user.name.toLowerCase().includes(searchTerm.toLowerCase()) ||
                         user.email.toLowerCase().includes(searchTerm.toLowerCase())
    const matchesRole = roleFilter === 'all' || user.role === roleFilter
    return matchesSearch && matchesRole
  })

  const getRoleIcon = (role: UserRole) => {
    switch (role) {
      case 'admin':
        return <Shield className="h-4 w-4 text-red-600" />
      case 'professor':
        return <GraduationCap className="h-4 w-4 text-blue-600" />
      case 'candidate':
        return <Users className="h-4 w-4 text-green-600" />
      default:
        return <Users className="h-4 w-4 text-gray-600" />
    }
  }

  const getRoleLabel = (role: UserRole) => {
    switch (role) {
      case 'admin':
        return 'Administrador'
      case 'professor':
        return 'Professor'
      case 'candidate':
        return 'Candidato'
      default:
        return role
    }
  }

  if (isLoading) {
    return (
      <div className="min-h-screen bg-white flex items-center justify-center">
        <div className="text-center">
          <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-green-600 mx-auto mb-4"></div>
          <p className="text-gray-600">Carregando usuários...</p>
        </div>
      </div>
    )
  }

  return (
    <div className="space-y-6">
      {/* Header */}
      <div className="flex items-center justify-between">
        <div>
          <h1 className="text-3xl font-bold text-secondary-900">Gerenciamento de Usuários</h1>
          <p className="text-secondary-600 mt-2">
            Gerencie usuários, roles e aprovações do sistema
          </p>
        </div>
        <Button onClick={() => setShowAdminForm(!showAdminForm)}>
          <UserPlus className="h-4 w-4 mr-2" />
          Cadastrar Admin
        </Button>
      </div>

      {/* Professores Pendentes */}
      {pendingProfessors.length > 0 && (
        <Card>
          <CardHeader>
            <CardTitle className="flex items-center">
              <Clock className="h-5 w-5 mr-2 text-yellow-600" />
              Professores Pendentes de Aprovação
            </CardTitle>
          </CardHeader>
          <CardContent>
            <div className="space-y-4">
              {pendingProfessors.map((professor) => (
                <div key={professor.id} className="flex items-center justify-between p-4 border border-yellow-200 rounded-lg bg-yellow-50">
                  <div>
                    <h3 className="font-medium text-gray-900">{professor.name}</h3>
                    <p className="text-sm text-gray-600">{professor.email}</p>
                    <p className="text-sm text-gray-500">CPF: {professor.cpf}</p>
                  </div>
                  <div className="flex space-x-2">
                    <Button
                      size="sm"
                      onClick={() => handleApproveProfessor(professor.id)}
                      className="bg-green-600 hover:bg-green-700"
                    >
                      <CheckCircle className="h-4 w-4 mr-1" />
                      Aprovar
                    </Button>
                    <Button
                      size="sm"
                      variant="outline"
                      className="border-red-300 text-red-600 hover:bg-red-50"
                    >
                      <XCircle className="h-4 w-4 mr-1" />
                      Rejeitar
                    </Button>
                  </div>
                </div>
              ))}
            </div>
          </CardContent>
        </Card>
      )}

      {/* Filtros */}
      <div className="flex flex-col sm:flex-row gap-4">
        <div className="flex-1">
          <div className="relative">
            <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 h-4 w-4 text-secondary-500" />
            <Input
              placeholder="Buscar usuários..."
              value={searchTerm}
              onChange={(e) => setSearchTerm(e.target.value)}
              className="pl-10"
            />
          </div>
        </div>
        <div className="flex gap-2">
          <Button
            variant={roleFilter === 'all' ? 'default' : 'outline'}
            onClick={() => setRoleFilter('all')}
            size="sm"
          >
            Todos
          </Button>
          <Button
            variant={roleFilter === 'candidate' ? 'default' : 'outline'}
            onClick={() => setRoleFilter('candidate')}
            size="sm"
          >
            Candidatos
          </Button>
          <Button
            variant={roleFilter === 'professor' ? 'default' : 'outline'}
            onClick={() => setRoleFilter('professor')}
            size="sm"
          >
            Professores
          </Button>
          <Button
            variant={roleFilter === 'admin' ? 'default' : 'outline'}
            onClick={() => setRoleFilter('admin')}
            size="sm"
          >
            Admins
          </Button>
        </div>
      </div>

      {/* Lista de Usuários */}
      <div className="space-y-4">
        {filteredUsers.map((user) => (
          <Card key={user.id}>
            <CardContent className="p-6">
              <div className="flex items-center justify-between">
                <div className="flex items-center space-x-4">
                  <div className="w-10 h-10 bg-gray-100 rounded-full flex items-center justify-center">
                    {getRoleIcon(user.role)}
                  </div>
                  <div>
                    <h3 className="font-medium text-gray-900">{user.name}</h3>
                    <p className="text-sm text-gray-600">{user.email}</p>
                    <p className="text-sm text-gray-500">CPF: {user.cpf}</p>
                  </div>
                </div>
                
                <div className="flex items-center space-x-4">
                  <div className="text-right">
                    <span className="inline-flex items-center px-2.5 py-0.5 rounded-full text-xs font-medium bg-gray-100 text-gray-800">
                      {getRoleLabel(user.role)}
                    </span>
                    <p className="text-sm text-gray-500 mt-1">
                      Criado em {new Date(user.createdAt).toLocaleDateString('pt-BR')}
                    </p>
                  </div>
                  
                  <div className="flex space-x-2">
                    {user.role !== 'admin' && (
                      <select
                        value={user.role}
                        onChange={(e) => handleUpdateUserRole(user.id, e.target.value as UserRole)}
                        className="text-sm border border-gray-300 rounded px-2 py-1"
                      >
                        <option value="candidate">Candidato</option>
                        <option value="professor">Professor</option>
                        <option value="admin">Admin</option>
                      </select>
                    )}
                    
                    <Button
                      size="sm"
                      variant="outline"
                      onClick={() => handleToggleUserStatus(user.id)}
                    >
                      {user.role === 'admin' ? 'Desativar' : 'Ativar/Desativar'}
                    </Button>
                  </div>
                </div>
              </div>
            </CardContent>
          </Card>
        ))}
      </div>

      {filteredUsers.length === 0 && (
        <div className="text-center py-12">
          <Users className="h-12 w-12 text-secondary-400 mx-auto mb-4" />
          <h3 className="text-lg font-medium text-secondary-900 mb-2">
            Nenhum usuário encontrado
          </h3>
          <p className="text-secondary-600">
            Não há usuários que correspondam aos filtros aplicados.
          </p>
        </div>
      )}
    </div>
  )
}
