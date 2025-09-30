import { SidebarInset, SidebarProvider } from '@/components/ui/sidebar'
import { createFileRoute, Outlet, redirect } from '@tanstack/react-router'
import { AppSidebar } from '@/components/app-sidebar'
import { getCurrentUser } from '@/lib/services/user'
import { getChats } from '@/lib/services/chat'

export const Route = createFileRoute('/chat')({
  component: RouteComponent,
  async loader() {
    const user = await getCurrentUser()
    console.log(user)
    if (!user) {
      throw redirect({ to: '/' })
    }
    const chats = await getChats({ data: { userId: user.id } })
    return { user, chats }
  },
})

function RouteComponent() {
  const { user, chats } = Route.useLoaderData()

  return (
    <SidebarProvider className="h-screen">
      <AppSidebar user={user} chats={chats} />
      <SidebarInset className="flex flex-col">
        <Outlet />
      </SidebarInset>
    </SidebarProvider>
  )
}
