import { useUserProfileQuery } from "@/auth/stack/UserStack"
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar"
import {
  Card,
  CardAction,
  CardContent,
  CardFooter,
  CardHeader,
  CardTitle,
} from "@/components/ui/card"
import { Separator } from "@/components/ui/separator"
import { useModalStorage } from "@/social/store/useModalStorage"
import { X } from "lucide-react"
import { Textarea } from "@/components/ui/textarea"
import { Button } from "@/components/ui/button"

export const PostForm = () => {
  const setShowModal = useModalStorage(state => state.setShowModal)
  const { data: currentUser } = useUserProfileQuery()
  const onSubmit = (event: React.SubmitEvent<HTMLFormElement>) => {
    event.preventDefault()
    const formData = new FormData(event.target)
    const description = formData.get('description') as string
    console.log(description)
  }
  return (
    <div className="fixed inset-0 flex items-center justify-center bg-black/50 z-50 backdrop-blur-xl" onClick={setShowModal} >
      <form className="" onClick={(e) => e.stopPropagation()} onSubmit={onSubmit} >
        <Card className="w-160" >
          <CardHeader>
            <CardTitle className="text-xl">Crear Publicación</CardTitle>
            <CardAction onClick={setShowModal} className="cursor-pointer">
              <X />
            </CardAction>
            <Separator className="m-0" />
          </CardHeader>

          <CardContent className="">
            <CardHeader className="flex items-center p-0 mb-4">
              <Avatar className="size-10">
                <AvatarImage src="https://github.com/shadcn.png" />
                <AvatarFallback>CN</AvatarFallback>
              </Avatar>
              <p className="text-lg">{currentUser?.name} {currentUser?.lastName}</p>
            </CardHeader>
            <Textarea className="resize-none h-25" name="description" placeholder="¿Qué estas pensando ahora?" />
          </CardContent>

          <CardFooter>
            <Button>Publicar</Button>
          </CardFooter>
        </Card>
      </form>

    </div>
  )
}
