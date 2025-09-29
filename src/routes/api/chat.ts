import { getChat, saveChatMessage } from '@/lib/services/chat'
import { createFileRoute } from '@tanstack/react-router'
import {
  convertToModelMessages,
  createIdGenerator,
  streamText,
  validateUIMessages,
} from 'ai'
import { openai } from '@ai-sdk/openai'

export const Route = createFileRoute('/api/chat')({
  server: {
    handlers: {
      POST: async ({ request }) => {
        const { message, id } = await request.json()

        const chat = await getChat({ data: { id } })
        const messages = [...chat.messages, message]

        const validatedMessages = await validateUIMessages({
          messages,
        })

        const result = streamText({
          model: openai('gpt-4.1'),
          messages: convertToModelMessages(validatedMessages),
        })

        return result.toUIMessageStreamResponse({
          originalMessages: validatedMessages,
          generateMessageId: createIdGenerator({
            prefix: 'msg',
            size: 16,
          }),
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
