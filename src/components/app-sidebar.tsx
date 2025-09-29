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
import { FlaskConical, MessageCircleIcon, PlusIcon } from 'lucide-react'
import { User } from '@/lib/services/user'
import { NavUser } from './nav-user'
import { Chat } from '@/lib/services/chat'
import { Button } from './ui/button'

export function AppSidebar({
  user,
  chats,
}: {
  user: User
  chats: Omit<Chat, 'messages'>[]
}) {
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
              <SidebarMenuItem key={chat.id}>
                <SidebarMenuButton size="sm" asChild>
                  <Link to={`/chat/$chatId`} params={{ chatId: chat.id }}>
                    <MessageCircleIcon />
                    <span className="truncate"> {chat.name}</span>
                  </Link>
                </SidebarMenuButton>
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
