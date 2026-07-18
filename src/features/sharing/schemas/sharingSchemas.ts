import { z } from 'zod'

export const shareListSchema = z.object({
  email: z.string().trim().min(1, 'Informe o e-mail.').email('E-mail inválido.'),
  permission: z.enum(['viewer', 'editor']),
})

export type ShareListInput = z.infer<typeof shareListSchema>
