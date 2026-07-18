import type { ListType } from '../../../types/database'

export const LIST_TYPES: { value: ListType; label: string }[] = [
  { value: 'shopping', label: 'Compras' },
  { value: 'checklist', label: 'Checklist' },
  { value: 'study', label: 'Estudos' },
  { value: 'task', label: 'Tarefas' },
  { value: 'generic', label: 'Genérica' },
]

export const UNIT_OPTIONS = ['unidade', 'kg', 'g', 'litro', 'ml', 'pacote', 'caixa']

export function listTypeLabel(listType: string): string {
  return LIST_TYPES.find((item) => item.value === listType)?.label ?? listType
}
