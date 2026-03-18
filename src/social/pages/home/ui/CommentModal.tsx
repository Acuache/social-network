import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar"
import { Button } from "@/components/ui/button"
import { Separator } from "@/components/ui/separator"
import { Textarea } from "@/components/ui/textarea"
import { Heart, Loader2, Send, Smile, X } from "lucide-react"
import type { PublicationWithDetailsResponse } from "@/interfaces/PublicationWithDetailsResponse.interface"
import EmojiPicker, { Theme } from "emoji-picker-react"
import { useEffect, useRef, useState } from "react"
import dayjs from "dayjs"
import utc from "dayjs/plugin/utc"
import relativeTime from "dayjs/plugin/relativeTime"
import "dayjs/locale/es"
import { useGetComments, userGetCommentMutate } from "@/social/stack/CommentStack"
import { useSessionStore } from "@/auth/storage/AuthStorage"

dayjs.extend(relativeTime)
dayjs.extend(utc)
dayjs.locale("es")

interface CommentModalProps {
  post: PublicationWithDetailsResponse
  onClose: () => void
}

export const CommentModal = ({ post, onClose }: CommentModalProps) => {
  const hasMedia = post.file && post.type_file
  const [showEmojiPicker, setShowEmojiPicker] = useState(false)
  const [hasText, setHasText] = useState(false)
  const textareaRef = useRef<HTMLTextAreaElement>(null)
  const emojiRef = useRef<HTMLDivElement>(null)

  useEffect(() => {
    if (!showEmojiPicker) return
    const handleClickOutside = (e: MouseEvent) => {
      if (emojiRef.current && !emojiRef.current.contains(e.target as Node)) {
        setShowEmojiPicker(false)
      }
    }
    document.addEventListener("mousedown", handleClickOutside)
    return () => document.removeEventListener("mousedown", handleClickOutside)
  }, [showEmojiPicker])

  const session = useSessionStore(state => state.session)
  const { mutate: commentMutate } = userGetCommentMutate()
  const handleCommentInsert = () => {
    const object = {
      comment: textareaRef.current!.value,
      id_user: session!.user.id,
      id_publication: post.id
    }
    commentMutate(object)
    textareaRef.current!.value = ''
  }

  const { data: commentsWithResponse, isLoading } = useGetComments(post.id)
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

          <div className="flex-1 overflow-y-auto px-4 py-3 space-y-4 customScroll">
            {isLoading ? (
              <div className="flex justify-center py-8">
                <Loader2 className="size-6 animate-spin text-muted-foreground" />
              </div>
            ) : commentsWithResponse?.length === 0 ? (
              <p className="text-sm text-muted-foreground text-center py-8">
                No hay comentarios aún en esta publicación
              </p>
            ) : (
              commentsWithResponse?.map((comment) => (
                <div key={comment.id} className="flex gap-3">
                  <Avatar className="size-8 shrink-0">
                    <AvatarImage src={comment.user_avatar || ''} />
                    <AvatarFallback>{comment.user_name[0]}</AvatarFallback>
                  </Avatar>
                  <div className="flex-1 min-w-0">
                    <div className="bg-muted rounded-xl px-3 py-2">
                      <p className="font-semibold text-xs">{comment.user_name} {comment.user_lastName}</p>
                      <p className="text-sm">{comment.comment}</p>
                    </div>
                    <p className="text-xs text-muted-foreground mt-1 ml-2">
                      {dayjs.utc(comment.created_at).fromNow()}
                    </p>
                  </div>
                </div>
              ))
            )}
          </div>

          <Separator />

          <div className="p-3 flex items-center gap-2 relative">
            <div className="relative" ref={emojiRef}>
              <Button size="icon" variant="ghost" onClick={() => setShowEmojiPicker(!showEmojiPicker)}>
                <Smile className="size-4" />
              </Button>
              <div className="absolute bottom-10 left-0">
                <EmojiPicker
                  theme={Theme.AUTO}
                  searchDisabled
                  open={showEmojiPicker}
                  onEmojiClick={(emojiObject) => {
                    if (!textareaRef.current) return
                    const textarea = textareaRef.current
                    const start = textarea.selectionStart
                    const end = textarea.selectionEnd
                    const value = textarea.value
                    textarea.value = value.slice(0, start) + emojiObject.emoji + value.slice(end)
                    const newPos = start + emojiObject.emoji.length
                    textarea.setSelectionRange(newPos, newPos)
                    textarea.focus()
                  }}
                />
              </div>
            </div>
            <Textarea
              ref={textareaRef}
              placeholder="Escribe un comentario..."
              className="resize-none min-h-[40px] max-h-[80px] text-sm"
              rows={1}
              onChange={(e) => setHasText(e.target.value.trim().length > 0)}
              onKeyDown={e => {
                if (e.key === 'Enter' && !e.shiftKey && hasText) {
                  e.preventDefault()
                  handleCommentInsert()
                }
              }}
            />
            <Button size="icon" variant="ghost" onClick={handleCommentInsert} disabled={!hasText}>
              <Send className="size-4" />
            </Button>
          </div>
        </div>
      </div>
    </div>
  )
}
