import { Link } from '@tanstack/react-router'
import {
  Sidebar,
  SidebarMenuItem,
  SidebarFooter,
  SidebarHeader,
  SidebarMenuButton,
  SidebarContent,
  SidebarMenu,
  SidebarGroup,
  SidebarGroupContent,
} from './ui/sidebar'
import { FlaskConical, MessageCircleIcon, PlusIcon, XIcon } from 'lucide-react'
import { User } from '@/lib/services/user'
import { NavUser } from './nav-user'
import { Chat, deleteChat } from '@/lib/services/chat'
import { Button } from './ui/button'
import { motion, AnimatePresence } from 'motion/react'
import { useState } from 'react'
import { useRouter } from '@tanstack/react-router'

export function AppSidebar({
  user,
  chats,
}: {
  user: User
  chats: Omit<Chat, 'messages'>[]
}) {
  const [hoveredChat, setHoveredChat] = useState<string | null>(null)
  const router = useRouter()

  return (
    <Sidebar variant="inset">
      <SidebarHeader>
        <SidebarMenu>
          <SidebarMenuItem>
            <SidebarMenuButton size="lg" asChild>
              <Link to="/chat">
                <div className="bg-sidebar-primary text-sidebar-primary-foreground flex aspect-square size-8 items-center justify-center rounded-lg">
                  <FlaskConical className="size-4" />
                </div>
                <div className="grid flex-1 text-left text-sm leading-tight">
                  <span className="truncate font-medium">Open Chat</span>
                </div>
              </Link>
            </SidebarMenuButton>
          </SidebarMenuItem>
        </SidebarMenu>
        <SidebarGroup className="p-0">
          <SidebarGroupContent className="p-0">
            <Button size="sm" asChild className="w-full">
              <Link to="/chat">
                <PlusIcon />
                <span className="truncate">New Chat</span>
              </Link>
            </Button>
          </SidebarGroupContent>
        </SidebarGroup>
      </SidebarHeader>
      <SidebarContent>
        <SidebarGroup>
          <SidebarMenu>
            {chats.map((chat) => (
              <SidebarMenuItem
                key={chat.id}
                onMouseEnter={() => setHoveredChat(chat.id)}
                onMouseLeave={() => setHoveredChat(null)}
                className="relative"
              >
                <SidebarMenuButton size="sm" asChild>
                  <Link
                    to={`/chat/$chatId`}
                    params={{ chatId: chat.id }}
                    activeProps={{
                      className: 'bg-sidebar-accent',
                    }}
                  >
                    <MessageCircleIcon />
                    <span className="truncate"> {chat.name}</span>
                  </Link>
                </SidebarMenuButton>
                <AnimatePresence>
                  {hoveredChat === chat.id && (
                    <motion.button
                      initial={{ x: 20, opacity: 0, filter: 'blur(4px)' }}
                      animate={{ x: 0, opacity: 1, filter: 'blur(0px)' }}
                      exit={{ x: 20, opacity: 0, filter: 'blur(4px)' }}
                      transition={{ duration: 0.2 }}
                      className="absolute right-2 top-1/2 -translate-y-1/2 p-1 rounded hover:bg-destructive/10"
                      onClick={() => {
                        deleteChat({
                          data: {
                            id: chat.id,
                          },
                        })
                        router.invalidate()
                        if (
                          router.state.location.pathname === `/chat/${chat.id}`
                        ) {
                          router.navigate({ to: '/chat' })
                        }
                      }}
                    >
                      <XIcon className="size-4 text-destructive" />
                    </motion.button>
                  )}
                </AnimatePresence>
              </SidebarMenuItem>
            ))}
          </SidebarMenu>
        </SidebarGroup>
      </SidebarContent>
      <SidebarFooter>
        <NavUser user={user} />
      </SidebarFooter>
    </Sidebar>
  )
}
