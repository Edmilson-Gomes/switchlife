import { z } from 'zod'

export const profileFormSchema = z.object({
  displayName: z.string().trim().min(2, 'Informe seu nome.').max(100),
  avatarUrl: z.string().trim().url('URL inválida.').optional().or(z.literal('')),
  timezone: z.string().trim().min(1, 'Informe o fuso horário.'),
  locale: z.string().trim().min(1, 'Informe o idioma.'),
})

export type ProfileFormInput = z.infer<typeof profileFormSchema>
