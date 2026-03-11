import { useUserProfileQuery } from "@/auth/stack/UserStack"
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar"
import { Button } from "@/components/ui/button"
import { Image, Smile } from "lucide-react"

export const NewPostInput = () => {
  const { data: currentUser } = useUserProfileQuery()
  return (
    <div className="rounded-xl border border-border p-4 flex">
      <div className="flex gap-3 flex-1">
        <Avatar className="size-10">
          <AvatarImage src={currentUser!.avatar || ''} />
          <AvatarFallback>{currentUser!.name[0]}{currentUser!.lastName[0]}</AvatarFallback>
        </Avatar>
        <div className="flex-1 text-gray-400 cursor-pointer hover:bg-gray-100 flex items-center px-1 rounded-md">
          ¿En que estás pensando, {currentUser!.lastName}?
        </div>
      </div>
      <div className="flex items-center justify-between">
        <div className="flex gap-1">
          <Button variant="ghost" size="sm" className="text-muted-foreground gap-1.5">
            <Image className="size-4" />
            <span className="hidden sm:inline text-xs">Imagen</span>
          </Button>

          <Button variant="ghost" size="sm" className="text-muted-foreground gap-1.5">
            <Smile className="size-4" />
            <span className="hidden sm:inline text-xs">Emoji</span>
          </Button>
        </div>
      </div>
    </div>
  )
}
