import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar"
import { Card, CardHeader, CardTitle, CardDescription, CardAction, CardContent, CardFooter } from "@/components/ui/card"
import { PostImageFrame } from "./PostImageFrame"
import { Button } from "@/components/ui/button"
import { Heart, MessageCircle } from "lucide-react"
import { useEffect, useRef, useState } from "react"
import type { PublicationWithDetailsResponse } from "@/interfaces/PublicationWithDetailsResponse.interface"

import dayjs from "dayjs"
import relativeTime from "dayjs/plugin/relativeTime"
import "dayjs/locale/es"
import utc from "dayjs/plugin/utc"
import { useLikePostMutate } from "@/social/stack/PostStack"
import { useSessionStore } from "@/auth/storage/AuthStorage"
import { CommentModal } from "./CommentModal"

dayjs.extend(relativeTime)
dayjs.extend(utc)
dayjs.locale("es")

export const CurrentPost = (postCurrent: PublicationWithDetailsResponse) => {
  const videoRef = useRef<HTMLVideoElement>(null);
  const session = useSessionStore(state => state.session)
  const { mutate: postLikeMutate } = useLikePostMutate()
  const [showComments, setShowComments] = useState(false)

  const handleLikePost = (e: React.MouseEvent) => {
    e.stopPropagation()
    postLikeMutate({ p_post_id: postCurrent.id, p_user_id: session!.user.id })
  }

  useEffect(() => {
    const video = videoRef.current;
    if (!video) return;

    const observer = new IntersectionObserver(
      ([entry]) => {
        if (!entry.isIntersecting) video.pause();
      },
      { threshold: 0.25 },
    );

    observer.observe(video);
    return () => observer.disconnect();
  }, []);
  return (
    <>
      <Card className="gap-1">
        <CardHeader>
          <div className="flex items-center gap-2">
            <Avatar className="size-9">
              <AvatarImage src={postCurrent.user_avatar || ''} />
              <AvatarFallback>{postCurrent.user_name[0]}{postCurrent.user_lastname[0]}</AvatarFallback>
            </Avatar>
            <CardTitle>{postCurrent.user_name} {postCurrent.user_lastname}</CardTitle>
          </div>
          <CardAction>{dayjs.utc(postCurrent.created_at).fromNow()}</CardAction>
        </CardHeader>
        <CardContent className="py-0">
          {
            postCurrent.description && (
              <CardDescription className="mb-3">
                <p>{postCurrent.description}</p>
              </CardDescription>
            )
          }

          {postCurrent.type_file === 'image' && postCurrent.file && (
            <PostImageFrame urlImg={postCurrent.file} />
          )}
          {postCurrent.type_file === 'video' && postCurrent.file && (
            <video
              ref={videoRef}
              src={postCurrent.file}
              controls
              className="w-full max-h-[500px] rounded-lg object-contain"
            />
          )}
        </CardContent>
        <CardFooter className="mt-2 flex gap-5">
          <div className="flex gap-1 items-center text-sm">
            <Button variant="outline" size="icon" onClick={handleLikePost}>
              <Heart className="text-red-700" fill={postCurrent.like_user_current ? "currentColor" : "none"} />
            </Button>
            <span>( {postCurrent.likes} )</span>
          </div>
          <div className="flex gap-1 items-center text-sm">
            <Button variant="outline" size="sm" onClick={() => {
              videoRef.current?.pause()

              setShowComments(true)
            }}>
              <MessageCircle /> Comentar
            </Button>
            <span>( {postCurrent.comments_count} )</span>
          </div>
        </CardFooter>
      </Card>
      {showComments && (
        <CommentModal post={postCurrent} onClose={() => setShowComments(false)} />
      )}
    </>
  )
}
