import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar"
import { Button } from "@/components/ui/button"
import { Separator } from "@/components/ui/separator"
import { Textarea } from "@/components/ui/textarea"
import { Heart, Send, X } from "lucide-react"
import type { PublicationWithDetailsResponse } from "@/interfaces/PublicationWithDetailsResponse.interface"
import dayjs from "dayjs"
import utc from "dayjs/plugin/utc"
import relativeTime from "dayjs/plugin/relativeTime"
import "dayjs/locale/es"

dayjs.extend(relativeTime)
dayjs.extend(utc)
dayjs.locale("es")

interface CommentModalProps {
  post: PublicationWithDetailsResponse
  onClose: () => void
}

const MOCK_COMMENTS = [
  { id: 1, user_name: "Ana García", user_avatar: "", content: "¡Qué genial! 🔥", created_at: "2026-03-14T10:00:00Z" },
  { id: 2, user_name: "Carlos López", user_avatar: "", content: "Me encanta esto, muy buena publicación", created_at: "2026-03-14T09:30:00Z" },
  { id: 3, user_name: "María Torres", user_avatar: "", content: "Increíble 👏", created_at: "2026-03-14T08:00:00Z" },
]

export const CommentModal = ({ post, onClose }: CommentModalProps) => {
  const hasMedia = post.file && post.type_file

  return (
    <div
      className="fixed inset-0 flex items-center justify-center bg-black/60 z-50 backdrop-blur-sm"
      onClick={onClose}
    >
      <div
        className={`bg-background rounded-xl shadow-2xl overflow-hidden flex flex-col ${hasMedia ? "w-[900px] max-w-[95vw] h-[85vh] md:flex-row" : "w-[500px] max-w-[95vw] h-[85vh]"}`}
        onClick={(e) => e.stopPropagation()}
      >
        <div className="flex items-center justify-between p-4 md:hidden">
          <div className="flex items-center gap-3">
            <Avatar className="size-10">
              <AvatarImage src={post.user_avatar || ""} />
              <AvatarFallback>{post.user_name[0]}{post.user_lastname[0]}</AvatarFallback>
            </Avatar>
            <div>
              <p className="font-semibold text-sm">{post.user_name} {post.user_lastname}</p>
              <p className="text-xs text-muted-foreground">{dayjs.utc(post.created_at).fromNow()}</p>
            </div>
          </div>
          <Button variant="ghost" size="icon" onClick={onClose}>
            <X className="size-5" />
          </Button>
        </div>

        {hasMedia && (
          <>
            <Separator className="md:hidden" />
            <div className="bg-black flex items-center justify-center shrink-0 h-[35vh] md:h-auto md:shrink md:flex-1 min-w-0 overflow-hidden">
              {post.type_file === "image" && post.file && (
                <img
                  src={post.file}
                  alt=""
                  className="max-w-full max-h-full object-contain"
                />
              )}
              {post.type_file === "video" && post.file && (
                <video
                  src={post.file}
                  controls
                  className="max-w-full max-h-full object-contain"
                />
              )}
            </div>
          </>
        )}

        <div className={`flex flex-col min-h-0 ${hasMedia ? "flex-1 md:w-[380px] md:min-w-[380px] md:flex-none" : "flex-1"}`}>
          <div className="hidden md:flex items-center justify-between p-4">
            <div className="flex items-center gap-3">
              <Avatar className="size-10">
                <AvatarImage src={post.user_avatar || ""} />
                <AvatarFallback>{post.user_name[0]}{post.user_lastname[0]}</AvatarFallback>
              </Avatar>
              <div>
                <p className="font-semibold text-sm">{post.user_name} {post.user_lastname}</p>
                <p className="text-xs text-muted-foreground">{dayjs.utc(post.created_at).fromNow()}</p>
              </div>
            </div>
            <Button variant="ghost" size="icon" onClick={onClose}>
              <X className="size-5" />
            </Button>
          </div>

          <Separator className="hidden md:block" />

          {post.description && (
            <div className="px-4 py-3">
              <p className="text-sm">{post.description}</p>
            </div>
          )}

          <div className="flex items-center gap-4 px-4 py-2 text-sm text-muted-foreground">
            <span className="flex items-center gap-1">
              <Heart className="size-4 text-red-700" fill={post.like_user_current ? "currentColor" : "none"} />
              {post.likes} likes
            </span>
            <span>{post.comments_count} comentarios</span>
          </div>

          <Separator />

          <div className="flex-1 overflow-y-auto px-4 py-3 space-y-4">
            {MOCK_COMMENTS.map((comment) => (
              <div key={comment.id} className="flex gap-3">
                <Avatar className="size-8 shrink-0">
                  <AvatarImage src={comment.user_avatar} />
                  <AvatarFallback>{comment.user_name[0]}</AvatarFallback>
                </Avatar>
                <div className="flex-1 min-w-0">
                  <div className="bg-muted rounded-xl px-3 py-2">
                    <p className="font-semibold text-xs">{comment.user_name}</p>
                    <p className="text-sm">{comment.content}</p>
                  </div>
                  <p className="text-xs text-muted-foreground mt-1 ml-2">
                    {dayjs.utc(comment.created_at).fromNow()}
                  </p>
                </div>
              </div>
            ))}
          </div>

          <Separator />

          <div className="p-3 flex items-center gap-2">
            <Textarea
              placeholder="Escribe un comentario..."
              className="resize-none min-h-[40px] max-h-[80px] text-sm"
              rows={1}
            />
            <Button size="icon" variant="ghost">
              <Send className="size-4" />
            </Button>
          </div>
        </div>
      </div>
    </div>
  )
}
