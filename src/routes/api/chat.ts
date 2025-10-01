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
  stepCountIs,
  streamText,
  Tool,
  validateUIMessages,
} from 'ai'
import { ChatMessage } from '@/lib/db/schema'
import { createResumableStreamContext } from 'resumable-stream'
import { tools } from '@/lib/ai/tools'

export const Route = createFileRoute('/api/chat')({
  server: {
    handlers: {
      POST: async ({ request }) => {
        const { message, id, model } = await request.json()

        const chat = await getChat({ data: { id } })
        const messages = [...chat.messages, message]

        const validatedMessages = await validateUIMessages({
          messages,
          // metadataSchema: metadataSchema,
          tools: tools as Record<string, Tool<unknown, unknown>>,
        })

        await saveChatMessage({ data: { id, messages: validatedMessages } })
        await saveActiveStreamId({ data: { id, activeStreamId: undefined } })

        const result = streamText({
          model,
          system: `You are a helpful AI assistant. Today's date is ${new Date().toLocaleDateString(
            'en-US',
            {
              weekday: 'long',
              year: 'numeric',
              month: 'long',
              day: 'numeric',
            }
          )}.

You have access to web search capabilities to find current information when needed. Always provide accurate, helpful, and up-to-date responses. When using tools, explain what you're doing and why it's helpful for answering the user's question.

Be concise and direct in your responses while maintaining a friendly and professional tone. Focus on providing practical, actionable information that directly addresses the user's needs.`,
          stopWhen: stepCountIs(10),
          messages: convertToModelMessages(validatedMessages),
          experimental_transform: smoothStream({
            chunking: 'word',
            delayInMs: 20,
          }),
          tools: tools,
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
