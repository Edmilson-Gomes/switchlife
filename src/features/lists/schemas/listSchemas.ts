import { z } from 'zod'

export const listFormSchema = z.object({
  title: z.string().trim().min(1, 'Informe um título.').max(200, 'Título muito longo.'),
  description: z.string().max(2000, 'Descrição muito longa.').optional(),
  listType: z.enum(['shopping', 'checklist', 'study', 'task', 'generic']),
})

export type ListFormInput = z.infer<typeof listFormSchema>

export const listItemFormSchema = z.object({
  title: z.string().trim().min(1, 'Informe um item.').max(200, 'Item muito longo.'),
  description: z.string().max(500, 'Descrição muito longa.').optional(),
  quantity: z.string().optional(),
  unit: z.string().max(20).optional(),
})

export type ListItemFormInput = z.infer<typeof listItemFormSchema>
