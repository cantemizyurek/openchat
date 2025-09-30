import {
  PromptInput,
  PromptInputBody,
  PromptInputSubmit,
  PromptInputTextarea,
  PromptInputToolbar,
  PromptInputTools,
} from '@/components/ai-elements/prompt-input'
import { ModelSelector } from '@/components/model-selector'
import { createChat } from '@/lib/services/chat'
import { getCurrentUser } from '@/lib/services/user'
import {
  ClientOnly,
  createFileRoute,
  redirect,
  useRouter,
} from '@tanstack/react-router'

export const Route = createFileRoute('/chat/')({
  component: RouteComponent,
  async loader() {
    const user = await getCurrentUser()
    if (!user) {
      throw redirect({ to: '/' })
    }
    return { user }
  },
})

function RouteComponent() {
  const { user } = Route.useLoaderData()
  const router = useRouter()

  return (
    <div className="h-full w-full flex flex-col items-center justify-between p-4">
      <div></div>
      <PromptInput
        onSubmit={async (data) => {
          if (!data.text) return
          const chat = await createChat({
            data: {
              userId: user.id,
              name: 'New Chat',
              initialMessage: data.text,
            },
          })
          router.navigate({ to: `/chat/${chat.id}` })
        }}
        className="max-w-2xl w-full"
      >
        <PromptInputBody>
          <PromptInputTextarea />
        </PromptInputBody>
        <PromptInputToolbar>
          <PromptInputTools>
            <ClientOnly fallback={null}>
              <ModelSelector />
            </ClientOnly>
          </PromptInputTools>
          <PromptInputSubmit disabled={false} status={'ready'} />
        </PromptInputToolbar>
      </PromptInput>
    </div>
  )
}
