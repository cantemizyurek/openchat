import { db, schema } from '@/lib/db'
import type { ChatMessage } from '@/lib/db/schema'
import { createServerFn } from '@tanstack/react-start'
import { eq, sql } from 'drizzle-orm'
import { z } from 'zod'
import { ChatSchema } from './schema'

export interface Chat {
  id: string
  name: string
  messages: ChatMessage[]
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

export const createChat = createServerFn({
  method: 'POST',
})
  .inputValidator((data) =>
    z
      .object({
        userId: z.string(),
        name: z.string(),
        initialMessage: z.string(),
      })
      .parse(data)
  )
  .handler(async ({ data }) => {
    const [chat] = await db
      .insert(schema.chats)
      .values({
        userId: data.userId,
        initialMessage: data.initialMessage,
        name: data.name,
        messages: [],
      })
      .returning()

    if (!chat) {
      throw new Error('Failed to create chat')
    }

    return {
      ...chat,
      messages: chat.messages as any,
    }
  })

export const getChat = createServerFn({
  method: 'GET',
})
  .inputValidator((data) => z.object({ id: z.string() }).parse(data))
  .handler(async ({ data }) => {
    const [chat] = await db
      .select()
      .from(schema.chats)
      .where(eq(schema.chats.id, data.id))
      .limit(1)

    if (!chat) {
      throw new Error('Chat not found')
    }

    return {
      id: chat.id,
      name: chat.name,
      initialMessage: chat.initialMessage,
      messages: chat.messages as any,
      createdAt: chat.createdAt,
      updatedAt: chat.updatedAt,
    }
  })

export const deleteChat = createServerFn({
  method: 'POST',
})
  .inputValidator((data) => ChatSchema.pick({ id: true }).parse(data))
  .handler(async ({ data }) => {
    await db.delete(schema.chats).where(eq(schema.chats.id, data.id))
  })

export const saveChatMessage = createServerFn({
  method: 'POST',
})
  .inputValidator((data) =>
    ChatSchema.pick({ id: true, messages: true }).parse(data)
  )
  .handler(async ({ data }) => {
    const chat = await db
      .update(schema.chats)
      .set({
        messages: data.messages,
      })
      .where(eq(schema.chats.id, data.id))
      .returning()

    if (!chat) {
      throw new Error('Failed to save chat message')
    }
  })
