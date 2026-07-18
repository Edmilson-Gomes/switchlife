import type { NoteCategory } from '../../../types/database'

export const NOTE_CATEGORIES: { value: NoteCategory; label: string }[] = [
  { value: 'engenharia', label: 'Engenharia' },
  { value: 'ia', label: 'IA' },
  { value: 'estudos', label: 'Estudos' },
  { value: 'violao', label: 'Violão' },
  { value: 'exercicios', label: 'Exercícios' },
  { value: 'rotina', label: 'Rotina' },
  { value: 'pessoal', label: 'Pessoal' },
  { value: 'outros', label: 'Outros' },
]

export function categoryLabel(category: string): string {
  return NOTE_CATEGORIES.find((item) => item.value === category)?.label ?? category
}
