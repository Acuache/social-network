import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar"
import { Card, CardHeader, CardTitle, CardDescription, CardAction, CardContent, CardFooter } from "@/components/ui/card"
import { PostImageFrame } from "./PostImageFrame"
import { Button } from "@/components/ui/button"
import { Heart, MessageCircle } from "lucide-react"
import { useState } from "react"

export const CurrentPost = () => {
  const [liked, setLiked] = useState(false);
  return (
    <Card className="gap-1">
      <CardHeader>
        <div className="flex items-center gap-2">
          <Avatar className="size-9">
            <AvatarImage src="https://github.com/shadcn.png" />
            <AvatarFallback>CN</AvatarFallback>
          </Avatar>
          <CardTitle>Michael Acuache</CardTitle>
        </div>
        <CardAction>Hace 8h</CardAction>
      </CardHeader>
      <CardContent className="py-0">
        <CardDescription className="mb-3">
          <p>Lorem ipsum, dolor sit amet consectetur adipisicing elit. Amet, porro labore iusto eveniet</p>
        </CardDescription>
        <div>
          <PostImageFrame urlImg="https://encrypted-tbn0.gstatic.com/images?q=tbn:ANd9GcTt7DtEy2KXtay34KQ9h59368BIKnquR5FJVw&s" />
        </div>
      </CardContent>
      <CardFooter className="mt-2 flex gap-5">
        <div className="flex gap-1 items-center text-sm">
          <Button variant="outline" size="icon" onClick={() => setLiked(!liked)}>
            <Heart className="text-red-700" fill={liked ? "currentColor" : "none"} />
          </Button>
          ( 8 )
        </div>
        <div className="flex gap-1 items-center text-sm">
          <Button variant="outline" size="sm">
            <MessageCircle /> Comentar
          </Button>
          ( 1 )
        </div>
      </CardFooter>
    </Card>
  )
}
