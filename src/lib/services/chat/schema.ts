import z from 'zod'

export const ChatSchema = z.object({
  id: z.string(),
  name: z.string(),
  messages: z.array(z.any()),
})
