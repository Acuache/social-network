import type { User } from "@/auth/interfaces/UserResponse.interface"
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar"
import { Card, CardContent } from "@/components/ui/card"

interface Props {
  user: User
}

export const CardUser = ({ user }: Props) => {
  const initials = `${user.name[0]}${user.lastName[0]}`

  return (
    <Card className="hover:bg-muted/50 transition-colors">
      <CardContent className="flex items-center gap-4 p-4">
        <Avatar className="size-12">
          <AvatarImage src={user.avatar ?? undefined} />
          <AvatarFallback className="font-semibold bg-muted">
            {initials}
          </AvatarFallback>
        </Avatar>

        <div className="flex-1 min-w-0">
          <p className="font-medium truncate">{user.name} {user.lastName}</p>
          <p className="text-sm text-muted-foreground truncate">{user.email}</p>
        </div>
      </CardContent>
    </Card>
  )
}
