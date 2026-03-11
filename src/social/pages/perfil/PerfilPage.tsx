import { useUserProfileQuery } from "@/auth/stack/UserStack"
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar"
import { Button } from "@/components/ui/button"
import { Separator } from "@/components/ui/separator"
import { CalendarDays, ImagePlus, Mail, Pencil } from "lucide-react"

export const PerfilPage = () => {
  const { data: user } = useUserProfileQuery()

  const initials = `${user!.name[0]}${user!.lastName[0]}`
  const fullName = `${user!.name} ${user!.lastName}`
  const joinDate = new Date(user!.created_at).toLocaleDateString("es-ES", {
    year: "numeric",
    month: "long",
  })

  return (
    <div className="flex flex-col flex-1 min-h-0">
      {/* Header / Cover */}
      <div className="relative">
        <div className="h-40 bg-muted flex items-center justify-center">
          <Button variant="ghost" size="sm" className="text-muted-foreground gap-1.5 opacity-60 hover:opacity-100 transition-opacity">
            <ImagePlus className="size-4" />
            Cambiar portada
          </Button>
        </div>

        <div className="absolute -bottom-12 left-6">
          <Avatar className="size-24 border-4 border-background shadow-md">
            <AvatarImage src={user!.avatar ?? undefined} />
            <AvatarFallback className="text-2xl font-semibold bg-muted">
              {initials}
            </AvatarFallback>
          </Avatar>
        </div>
      </div>

      {/* Info */}
      <div className="px-6 pt-14 pb-4">
        <div className="flex items-start justify-between">
          <div>
            <h1 className="text-xl font-bold">{fullName}</h1>
            <p className="text-sm text-muted-foreground">@{user!.name.toLowerCase()}{user!.lastName.toLowerCase()}</p>
          </div>
          <Button variant="outline" size="sm" className="gap-1.5 rounded-full">
            <Pencil className="size-3" />
            Editar
          </Button>
        </div>

        <div className="flex flex-wrap gap-4 mt-3 text-xs text-muted-foreground">
          <span className="flex items-center gap-1">
            <Mail className="size-3.5" />
            {user!.email}
          </span>
          <span className="flex items-center gap-1">
            <CalendarDays className="size-3.5" />
            Se unió en {joinDate}
          </span>
        </div>

        <div className="flex gap-4 mt-3 text-sm">
          <p><span className="font-semibold">0</span> <span className="text-muted-foreground">publicaciones</span></p>
          <p><span className="font-semibold">0</span> <span className="text-muted-foreground">seguidores</span></p>
          <p><span className="font-semibold">0</span> <span className="text-muted-foreground">siguiendo</span></p>
        </div>
      </div>

      <Separator />

      {/* Publicaciones */}
      <div className="flex-1 flex items-center justify-center p-10">
        <div className="text-center space-y-1">
          <p className="text-muted-foreground font-medium">Sin publicaciones aún</p>
          <p className="text-xs text-muted-foreground/60">Tus publicaciones aparecerán aquí</p>
        </div>
      </div>
    </div>
  )
}
