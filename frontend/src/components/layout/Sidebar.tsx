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
    roles: ['candidate', 'admin'],
  },
  {
    label: 'Dashboard',
    href: '/professor-dashboard',
    icon: LayoutDashboard,
    roles: ['professor'],
  },
  {
    label: 'Cursos',
    href: '/courses',
    icon: BookOpen,
    roles: ['candidate', 'admin'],
  },
  {
    label: 'Meus Cursos',
    href: '/my-courses',
    icon: BookOpen,
    roles: ['professor'],
  },
  {
    label: 'Inscrições',
    href: '/enrollments',
    icon: FileText,
    roles: ['candidate', 'admin'],
  },
  {
    label: 'Certificados',
    href: '/certificates',
    icon: Award,
    roles: ['candidate', 'admin'],
  },
  {
    label: 'Relatórios',
    href: '/reports',
    icon: BarChart3,
    roles: ['professor', 'admin'],
  },
  {
    label: 'Usuários',
    href: '/users',
    icon: Users,
    roles: ['admin'],
  },
  {
    label: 'Configurações',
    href: '/settings',
    icon: Settings,
    roles: ['candidate', 'professor', 'admin'],
  },
]

export function Sidebar() {
  const { user } = useAuthStore()

  const filteredNavItems = navItems.filter(item => 
    item.roles.includes(user?.role || '')
  )

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

