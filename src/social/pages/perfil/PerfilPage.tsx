import { useUserProfileQuery } from "@/auth/stack/UserStack"
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar"
import { CalendarDays } from "lucide-react"

export const PerfilPage = () => {
  const { data: user } = useUserProfileQuery()

  if (!user) return null

  const initials = `${user.name[0]}${user.lastName[0]}`
  const fullName = `${user.name} ${user.lastName}`
  const joinDate = new Date(user.created_at).toLocaleDateString("es-ES", {
    year: "numeric",
    month: "long",
  })

  return (
    <div className="flex flex-col items-center gap-6 p-6">
      <Avatar className="size-24">
        <AvatarImage src={user.avatar ?? undefined} />
        <AvatarFallback className="text-2xl font-semibold bg-muted">
          {initials}
        </AvatarFallback>
      </Avatar>

      <div className="text-center space-y-1">
        <h1 className="text-xl font-bold">{fullName}</h1>
        <p className="text-sm text-muted-foreground">{user.email}</p>
      </div>

      <span className="flex items-center gap-1.5 text-sm text-muted-foreground">
        <CalendarDays className="size-4" />
        Se unió en {joinDate}
      </span>
    </div>
  )
}
