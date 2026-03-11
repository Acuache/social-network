import {
  Sidebar,
  SidebarContent,
  SidebarFooter,
  SidebarGroup,
  SidebarGroupContent,
  SidebarHeader,
  SidebarMenu,
  SidebarMenuButton,
  SidebarMenuItem,
} from "@/components/ui/sidebar"
import { CircleUserRound, House, LogOut, MessageSquare, Moon, Sun, UserSearch } from "lucide-react"

import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar"
import { Link, useLocation } from "react-router"
import { useTheme } from "@/components/theme-provider"
import { useSignOutMutate } from "@/auth/stack/SignOutStack"
import { useUserProfileQuery } from "@/auth/stack/UserStack"


const projects = [
  {
    name: 'Inicio',
    url: '/',
    icon: House
  },
  {
    name: 'Usuarios',
    url: '/usuarios',
    icon: UserSearch
  },
  {
    name: 'Mi Perfil',
    url: '/perfil',
    icon: CircleUserRound
  }
]

export function AppSidebar() {
  const { pathname } = useLocation()
  const { theme, setTheme } = useTheme()
  const { data: currentUser } = useUserProfileQuery()
  const { mutate: signOutMutate, isPending: signOutIsPending } = useSignOutMutate()
  return (
    <Sidebar variant='inset' collapsible="none" className="bg-bg-light dark:bg-bg-dark md:w-[16rem]">

      <SidebarHeader className="bg-bg-light dark:bg-bg-dark">
        <SidebarMenu>
          <SidebarMenuItem>
            <Link to='/perfil'>
              <SidebarMenuButton size="lg" className="">
                <Avatar className="size-8">
                  <AvatarImage src={currentUser!.avatar || ''} />
                  <AvatarFallback>{currentUser!.name[0]}{currentUser!.lastName[0]}</AvatarFallback>
                </Avatar>
                <h2 className="hidden md:block text-nowrap">{currentUser!.name} {currentUser!.lastName}</h2>
              </SidebarMenuButton>
            </Link>
          </SidebarMenuItem>
        </SidebarMenu>
      </SidebarHeader>

      <SidebarContent className="bg-bg-light dark:bg-bg-dark">
        <SidebarGroup>
          <SidebarGroupContent>
            <SidebarMenu>
              {projects.map((project) => {
                const Icon = project.icon
                return (
                  <SidebarMenuItem key={project.name}>
                    <SidebarMenuButton
                      asChild
                      size="lg"
                      isActive={pathname === project.url}
                      className="[&>svg]:size-6 text-base hover:bg-gray-200! hover:text-blue-600! transition duration-300 data-[active=true]:bg-gray-200! data-[active=true]:text-blue-500!"
                    >
                      <Link to={project.url}>
                        <Icon />
                        <span className="hidden md:inline">{project.name}</span>
                      </Link>
                    </SidebarMenuButton>
                  </SidebarMenuItem>
                )
              })}
            </SidebarMenu>
          </SidebarGroupContent>
        </SidebarGroup>
      </SidebarContent>

      <SidebarFooter className="">
        <SidebarMenu >
          <SidebarMenuItem>
            <SidebarMenuButton
              className="[&>svg]:size-5 text-sm text-nowrap mb-2"
              onClick={() => setTheme(theme === "dark" ? "light" : "dark")}
            >
              {theme === "dark" ? <Sun /> : <Moon />}
              <span className="hidden md:inline">
                {theme === "dark" ? "Modo Claro" : "Modo Oscuro"}
              </span>
            </SidebarMenuButton>
          </SidebarMenuItem>

          <SidebarMenuItem>
            <SidebarMenuButton className="bg-black text-white [&>svg]:size-5 text-sm text-nowrap">
              <MessageSquare /> <span className="hidden md:inline">Nuevo Post</span>
            </SidebarMenuButton>
          </SidebarMenuItem>

          <SidebarMenuItem>
            <SidebarMenuButton onClick={() => signOutMutate()} disabled={signOutIsPending} className="bg-black text-white [&>svg]:size-5 text-sm text-nowrap">
              <LogOut /> <span className="hidden md:inline">Cerrar Sesión</span>
            </SidebarMenuButton>
          </SidebarMenuItem>
        </SidebarMenu>
      </SidebarFooter>
    </Sidebar>
  )
}