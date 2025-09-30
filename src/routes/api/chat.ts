import { getChat, saveChatMessage } from '@/lib/services/chat'
import { createFileRoute } from '@tanstack/react-router'
import {
  convertToModelMessages,
  createIdGenerator,
  streamText,
  validateUIMessages,
} from 'ai'
import { ChatMessage } from '@/lib/db/schema'
import { getModels } from '@tokenlens/models'

export const Route = createFileRoute('/api/chat')({
  server: {
    handlers: {
      POST: async ({ request }) => {
        const { message, id, model } = await request.json()

        const chat = await getChat({ data: { id } })
        const messages = [...chat.messages, message]

        const validatedMessages = await validateUIMessages({
          messages,
        })

        const provider =
          getModels()[model.split(':')[0] as keyof ReturnType<typeof getModels>]

        const modelFn = (await import(
          /* @vite-ignore */
          provider.npm
        )) as {
          [key: string]: (...args: any[]) => any
        }

        const result = streamText({
          model: modelFn[model.split(':')[0]](model.split(':')[1]),
          messages: convertToModelMessages(validatedMessages),
        })

        return result.toUIMessageStreamResponse<ChatMessage>({
          originalMessages: validatedMessages as ChatMessage[],
          generateMessageId: createIdGenerator({
            prefix: 'msg',
            size: 16,
          }),
          sendReasoning: true,

          messageMetadata: ({ part }) => {
            if (part.type === 'start') {
              return {
                createdAt: Date.now(),
                model: model,
              }
            }

            if (part.type === 'finish') {
              return {
                totalTokens: part.totalUsage.totalTokens,
              }
            }
          },
          onFinish: async ({ messages }) => {
            await saveChatMessage({
              data: {
                id,
                messages: messages,
              },
            })
          },
        })
      },
    },
  },
})
