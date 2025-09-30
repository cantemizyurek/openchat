import { getChat } from '@/lib/services/chat'
import { createFileRoute } from '@tanstack/react-router'
import { createResumableStreamContext } from 'resumable-stream'
import { UI_MESSAGE_STREAM_HEADERS } from 'ai'

export const Route = createFileRoute('/api/chat/$chatId/stream')({
  server: {
    handlers: {
      async GET({ params }) {
        const chat = await getChat({ data: { id: params.chatId } })

        if (!chat.activeStreamId) return new Response(null, { status: 204 })

        const streamContext = createResumableStreamContext({
          waitUntil: async (async) => async,
        })

        return new Response(
          await streamContext.resumeExistingStream(chat.activeStreamId),
          { headers: UI_MESSAGE_STREAM_HEADERS }
        )
      },
    },
  },
})
