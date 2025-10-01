import { z } from 'zod'

export const metadataSchema = z.object({
  model: z.string().optional(),
  createdAt: z.number().optional(),
  totalTokens: z.number().optional(),
})

export type Metadata = z.infer<typeof metadataSchema>
