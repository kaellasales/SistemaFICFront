import { NavLink } from 'react-router-dom'
import { 
  LayoutDashboard, 
  BookOpen, 
  FileText, 
  Award, 
  BarChart3,
  Users,
  Settings
} from 'lucide-react'
import { useAuthStore } from '@/shared/stores/authStore'
import { cn } from '@/shared/utils/cn'

interface NavItem {
  label: string
  href: string
  icon: React.ComponentType<{ className?: string }>
  roles: string[]
}

const navItems: NavItem[] = [
  {
    label: 'Dashboard',
    href: '/dashboard',
    icon: LayoutDashboard,
    roles: ['aluno', 'professor', 'cca'], // Todos veem uma dashboard
  },
  {
    label: 'Cursos',
    href: '/courses',
    icon: BookOpen,
    roles: ['aluno'], // Apenas alunos veem a "vitrine" de cursos
  },
  {
    label: 'Meus Cursos',
    href: '/my-courses',
    icon: BookOpen,
    roles: ['professor'], // Apenas professores veem os cursos que eles criaram
  },
  {
    label: 'Minhas Inscrições',
    href: '/enrollments',
    icon: FileText,
    roles: ['aluno'],
  },
  {
    label: 'Certificados',
    href: '/certificates',
    icon: Award,
    roles: ['aluno', 'cca'],
  },
  {
    label: 'Relatórios',
    href: '/reports',
    icon: BarChart3,
    roles: ['professor', 'cca'],
  },
  {
    label: 'Gerenciar Usuários',
    href: '/users',
    icon: Users,
    roles: ['cca'], // Apenas o CCA gerencia usuários
  },
  {
    label: 'Configurações',
    href: '/settings',
    icon: Settings,
    roles: ['aluno', 'professor', 'cca'],
  },
];


export function Sidebar() {
  const { user } = useAuthStore()

const filteredNavItems = navItems.filter(item => {
  if (!user?.groups) return false;
  const userGroups = user.groups.map(group => group.toLowerCase());
  return item.roles.some(role => userGroups.includes(role));
});
  return (
    <aside className="w-64 bg-white border-r border-secondary-200 min-h-screen">
      <nav className="p-4 space-y-2">
        {filteredNavItems.map((item) => {
          const Icon = item.icon
          return (
            <NavLink
              key={item.href}
              to={item.href}
              className={({ isActive }) =>
                cn(
                  'flex items-center space-x-3 px-3 py-2 rounded-md text-sm font-medium transition-colors',
                  isActive
                    ? 'bg-primary-100 text-primary-700'
                    : 'text-secondary-700 hover:bg-secondary-100 hover:text-secondary-900'
                )
              }
            >
              <Icon className="h-5 w-5" />
              <span>{item.label}</span>
            </NavLink>
          )
        })}
      </nav>
    </aside>
  )
}

