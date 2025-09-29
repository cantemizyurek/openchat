import { db, schema } from '@/lib/db'
import { createServerFn } from '@tanstack/react-start'
import { UIMessage } from 'ai'
import { eq } from 'drizzle-orm'
import { z } from 'zod'

export interface Chat {
  id: string
  name: string
  messages: UIMessage[]
  createdAt: Date
  updatedAt: Date
}

export const getChats = createServerFn({
  method: 'GET',
})
  .inputValidator((data) => z.object({ userId: z.string() }).parse(data))
  .handler(async ({ data }): Promise<Omit<Chat, 'messages'>[]> => {
    const chats = await db
      .select({
        id: schema.chats.id,
        name: schema.chats.name,
        createdAt: schema.chats.createdAt,
        updatedAt: schema.chats.updatedAt,
      })
      .from(schema.chats)
      .where(eq(schema.chats.userId, data.userId))
    if (!chats) return []

    return chats.map((chat) => ({
      id: chat.id,
      name: chat.name,
      createdAt: chat.createdAt,
      updatedAt: chat.updatedAt,
    }))
  })
