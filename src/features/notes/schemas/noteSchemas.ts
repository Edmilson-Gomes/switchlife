import { z } from 'zod'

export const noteFormSchema = z.object({
  title: z.string().trim().min(1, 'Informe um título.').max(200, 'Título muito longo.'),
  content: z.string().max(20000, 'Conteúdo muito longo.'),
  category: z.string().min(1, 'Escolha uma categoria.'),
  isPinned: z.boolean(),
})

export type NoteFormInput = z.infer<typeof noteFormSchema>
