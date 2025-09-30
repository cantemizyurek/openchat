import {
  PromptInput,
  PromptInputToolbar,
  PromptInputBody,
  PromptInputTextarea,
  PromptInputTools,
  PromptInputSubmit,
} from '@/components/ai-elements/prompt-input'
import { getChat } from '@/lib/services/chat'
import { createFileRoute, useRouter } from '@tanstack/react-router'
import { useChat } from '@ai-sdk/react'
import { DefaultChatTransport } from 'ai'
import { useEffect, useRef, useState } from 'react'
import {
  Conversation,
  ConversationContent,
  ConversationScrollButton,
} from '@/components/ai-elements/conversation'
import { Message, MessageContent } from '@/components/ai-elements/message'
import { Response } from '@/components/ai-elements/response'

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
  const router = useRouter()

  const { messages, sendMessage, status, stop } = useChat({
    id: chat.id,
    messages: chat.messages,
    transport: new DefaultChatTransport({
      api: '/api/chat',
      prepareSendMessagesRequest({ messages, id }) {
        return { body: { message: messages[messages.length - 1], id } }
      },
    }),
    onFinish: () => {
      router.invalidate()
    },
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
      <Conversation className="relative w-full h-full pb-30">
        <ConversationContent>
          {messages.map((message) => (
            <Message key={message.id} from={message.role}>
              <MessageContent
                variant={message.role === 'user' ? 'contained' : 'flat'}
              >
                {message.parts.map((part) => {
                  switch (part.type) {
                    case 'text':
                      return <Response>{part.text}</Response>
                    default:
                      return null
                  }
                })}
              </MessageContent>
            </Message>
          ))}
        </ConversationContent>
        <ConversationScrollButton />
      </Conversation>
      <PromptInput
        onSubmit={async (data) => {
          if (!data.text) return
          sendMessage({
            text: data.text,
          })
          setInput('')
        }}
        className="max-w-2xl w-full fixed bottom-4"
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
