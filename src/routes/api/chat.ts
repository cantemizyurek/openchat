import {
  getChat,
  saveActiveStreamId,
  saveChatMessage,
} from '@/lib/services/chat'
import { createFileRoute } from '@tanstack/react-router'
import {
  convertToModelMessages,
  createIdGenerator,
  generateId,
  smoothStream,
  streamText,
  validateUIMessages,
} from 'ai'
import { ChatMessage } from '@/lib/db/schema'
import { createResumableStreamContext } from 'resumable-stream'

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

        await saveChatMessage({ data: { id, messages: validatedMessages } })
        await saveActiveStreamId({ data: { id, activeStreamId: undefined } })

        const result = streamText({
          model,
          messages: convertToModelMessages(validatedMessages),
          experimental_transform: smoothStream({
            chunking: 'word',
            delayInMs: 20,
          }),
          providerOptions: {
            openai: {
              reasoningSummary: 'auto',
              reasoningEffort: 'medium',
            },
          },
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
            await saveActiveStreamId({
              data: { id, activeStreamId: undefined },
            })
          },
          async consumeSseStream({ stream }) {
            const streamId = generateId()

            const streamContext = createResumableStreamContext({
              waitUntil: async (async) => async,
            })
            await streamContext.createNewResumableStream(streamId, () => stream)

            await saveActiveStreamId({ data: { id, activeStreamId: streamId } })
          },
        })
      },
    },
  },
})
