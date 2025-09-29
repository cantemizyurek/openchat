import {
  PromptInput,
  PromptInputToolbar,
  PromptInputBody,
  PromptInputTextarea,
  PromptInputTools,
  PromptInputSubmit,
} from '@/components/ai-elements/prompt-input'
import { getChat } from '@/lib/services/chat'
import { createFileRoute } from '@tanstack/react-router'
import { useChat } from '@ai-sdk/react'
import { DefaultChatTransport } from 'ai'
import { useEffect, useRef, useState } from 'react'

export const Route = createFileRoute('/chat/$chatId/')({
  component: RouteComponent,
  async loader({ params }) {
    const { chatId } = params
    const chat = await getChat({ data: { id: chatId } })
    return { chat }
  },
})

function RouteComponent() {
  const { chat } = Route.useLoaderData()
  const [input, setInput] = useState('')
  const initialMessageRef = useRef<string | null>(chat.initialMessage)

  const { messages, sendMessage, status, stop } = useChat({
    id: chat.id,
    messages: chat.messages,
    transport: new DefaultChatTransport({
      api: '/api/chat',
      prepareSendMessagesRequest({ messages, id }) {
        return { body: { message: messages[messages.length - 1], id } }
      },
    }),
  })

  useEffect(() => {
    if (initialMessageRef.current && messages.length === 0) {
      sendMessage({
        text: initialMessageRef.current,
      })
      initialMessageRef.current = null
    }
  }, [])

  return (
    <div className="h-full w-full flex flex-col items-center justify-between p-4">
      <div>
        <div>
          {messages.map((message) => (
            <div key={message.id}>
              {message.parts
                .map((part) => part.type === 'text' && part.text)
                .join('')}
            </div>
          ))}
        </div>
      </div>
      <PromptInput
        onSubmit={async (data) => {
          if (!data.text) return
          sendMessage({
            text: data.text,
          })
          setInput('')
        }}
        className="max-w-2xl w-full"
      >
        <PromptInputBody>
          <PromptInputTextarea
            value={input}
            onChange={(e) => setInput(e.target.value)}
          />
        </PromptInputBody>
        <PromptInputToolbar>
          <PromptInputTools></PromptInputTools>
          <PromptInputSubmit
            disabled={false}
            status={status}
            onClick={() => {
              if (status === 'streaming') {
                stop()
              }
            }}
          />
        </PromptInputToolbar>
      </PromptInput>
    </div>
  )
}
