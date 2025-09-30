import { pgTable, uuid, text, timestamp, jsonb } from 'drizzle-orm/pg-core'
import { duration } from '@/lib/utils/duration'
import { UIMessage } from 'ai'
import { Metadata } from '../ai'

const timestamps = {
  createdAt: timestamp('created_at').defaultNow().notNull(),
  updatedAt: timestamp('updated_at')
    .defaultNow()
    .notNull()
    .$onUpdate(() => new Date()),
}

export const users = pgTable('users', {
  id: uuid('id').primaryKey().defaultRandom(),
  email: text('email').notNull().unique(),
  name: text('name').notNull(),
  password: text('password').notNull(),
  ...timestamps,
})

export const sessions = pgTable('sessions', {
  id: uuid('id').primaryKey().defaultRandom(),
  userId: uuid('user_id')
    .notNull()
    .references(() => users.id, { onDelete: 'cascade' }),
  ...timestamps,
  expiresAt: timestamp('expires_at')
    .notNull()
    .$defaultFn(() => new Date(Date.now() + duration('30d'))),
})

export type ChatMessage = UIMessage<Metadata, {}, {}>

export const chats = pgTable('chats', {
  id: uuid('id').primaryKey().defaultRandom(),
  userId: uuid('user_id')
    .notNull()
    .references(() => users.id, { onDelete: 'cascade' }),
  initialMessage: text('initial_message').notNull(),
  name: text('name').notNull(),
  messages: jsonb('messages').$type<ChatMessage[]>().notNull(),
  ...timestamps,
})
