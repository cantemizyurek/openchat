import {
  PromptInput,
  PromptInputToolbar,
  PromptInputBody,
  PromptInputTextarea,
  PromptInputTools,
  PromptInputSubmit,
} from '@/components/ai-elements/prompt-input'
import { getChat } from '@/lib/services/chat'
import { ClientOnly, createFileRoute, useRouter } from '@tanstack/react-router'
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
import { ModelSelector } from '@/components/model-selector'
import { useAtomValue } from 'jotai/react'
import { createClientOnlyFn } from '@tanstack/react-start'
import { modelAtom } from '@/lib/state/model'
import {
  Reasoning,
  ReasoningContent,
  ReasoningTrigger,
} from '@/components/ai-elements/reasoning'

export const Route = createFileRoute('/chat/$chatId/')({
  component: RouteComponent,
  async loader({ params }) {
    const { chatId } = params
    const chat = await getChat({ data: { id: chatId } })
    return { chat }
  },
})

export const getModel = createClientOnlyFn(() => {
  const model = useAtomValue(modelAtom)
  return { model }
})

function RouteComponent() {
  const { chat } = Route.useLoaderData()
  const [input, setInput] = useState('')
  const initialMessageRef = useRef<string | null>(chat.initialMessage)
  const router = useRouter()
  const { model } = getModel()

  const { messages, sendMessage, status, stop } = useChat({
    id: chat.id,
    messages: chat.messages,
    resume: true,
    transport: new DefaultChatTransport({
      api: '/api/chat',
      prepareSendMessagesRequest({ messages, id }) {
        return { body: { message: messages[messages.length - 1], id, model } }
      },
      prepareReconnectToStreamRequest: ({ id }) => {
        return {
          api: `/api/chat/${id}/stream`,
          credentials: 'include',
        }
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
    <div className="h-full w-full flex flex-col items-center">
      <Conversation className="w-full flex-1 min-h-0 px-4 overflow-y-auto">
        <ConversationContent>
          {messages.map((message) => (
            <Message key={message.id} from={message.role}>
              <MessageContent
                variant={message.role === 'user' ? 'contained' : 'flat'}
              >
                {message.parts.map((part, i) => {
                  switch (part.type) {
                    case 'text':
                      return (
                        <Response key={`${message.id}-${i}`}>
                          {part.text}
                        </Response>
                      )
                    case 'reasoning':
                      return (
                        <Reasoning
                          className="w-full"
                          isStreaming={
                            status === 'streaming' &&
                            i === message.parts.length - 1 &&
                            message.id === messages.at(-1)?.id
                          }
                        >
                          <ReasoningTrigger />
                          <ReasoningContent>{part.text}</ReasoningContent>
                        </Reasoning>
                      )

                    default:
                      return null
                  }
                })}
              </MessageContent>
            </Message>
          ))}
          <div className="h-32" />
        </ConversationContent>
        <ConversationScrollButton className="left-4 translate-x-[0%]" />
      </Conversation>
      <PromptInput
        onSubmit={async (data) => {
          if (!data.text) return
          sendMessage({
            text: data.text,
          })
          setInput('')
        }}
        className="xl:max-w-2xl 2xl:max-w-3xl lg:max-w-xl max-w-md mx-4 w-full fixed bottom-4"
      >
        <PromptInputBody>
          <PromptInputTextarea
            value={input}
            onChange={(e) => setInput(e.target.value)}
          />
        </PromptInputBody>
        <PromptInputToolbar>
          <PromptInputTools>
            <ClientOnly fallback={null}>
              <ModelSelector />
            </ClientOnly>
          </PromptInputTools>
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
