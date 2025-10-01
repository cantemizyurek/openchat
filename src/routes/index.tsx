import { getCurrentUser } from '@/lib/services/user'
import { createFileRoute, redirect } from '@tanstack/react-router'

export const Route = createFileRoute('/')({
  component: App,
  loader: async () => {
    const user = await getCurrentUser()
    if (!user) {
      throw redirect({ to: '/auth/sign-in' })
    }
    throw redirect({ to: '/chat' })
  },
})

function App() {
  return <div></div>
}
