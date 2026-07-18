import {
  Home,
  NotebookPen,
  ListChecks,
  Users,
  MoreHorizontal,
  User,
  Settings,
} from 'lucide-react'
import type { LucideIcon } from 'lucide-react'

export interface NavItem {
  to: string
  label: string
  icon: LucideIcon
}

export const primaryNavItems: NavItem[] = [
  { to: '/app/inicio', label: 'Início', icon: Home },
  { to: '/app/anotacoes', label: 'Anotações', icon: NotebookPen },
  { to: '/app/listas', label: 'Listas', icon: ListChecks },
  { to: '/app/compartilhados', label: 'Compartilhados', icon: Users },
]

export const secondaryNavItems: NavItem[] = [
  { to: '/app/perfil', label: 'Perfil', icon: User },
  { to: '/app/configuracoes', label: 'Configurações', icon: Settings },
]

export const moreNavItem: NavItem = {
  to: '/app/perfil',
  label: 'Mais',
  icon: MoreHorizontal,
}
