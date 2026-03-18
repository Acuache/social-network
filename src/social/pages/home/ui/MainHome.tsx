import { usePostQuery } from "@/social/stack/PostStack"
import { CurrentPost } from "./CurrentPost"
import { NewPostInput } from "./NewPostInput"
import { useEffect, useRef, useCallback } from "react"
import { Loader2 } from "lucide-react"
export const MainHome = () => {
  const {
    data,
    isPending,
    fetchNextPage,
    hasNextPage,
    isFetchingNextPage,
  } = usePostQuery()

  const observerRef = useRef<IntersectionObserver | null>(null)
  const lastPostRef = useCallback(
    (node: HTMLDivElement | null) => {
      if (isFetchingNextPage) return
      if (observerRef.current) observerRef.current.disconnect()
      observerRef.current = new IntersectionObserver((entries) => {
        if (entries[0].isIntersecting && hasNextPage) {
          fetchNextPage()
        }
      })
      if (node) observerRef.current.observe(node)
    },
    [isFetchingNextPage, hasNextPage, fetchNextPage],
  )

  useEffect(() => {
    return () => observerRef.current?.disconnect()
  }, [])

  if (isPending) return (
    <div className="flex justify-center p-8">
      <Loader2 className="size-6 animate-spin" />
    </div>
  )

  const allPosts = data?.pages.flat() ?? []

  return (
    <div className={`flex flex-col gap-7 overflow-auto p-4 customScroll`} >
      <NewPostInput />
      {allPosts.map((post, index) => (
        <div
          key={post.id}
          ref={index === allPosts.length - 1 ? lastPostRef : undefined}
        >
          <CurrentPost {...post} />
        </div>
      ))}
      {isFetchingNextPage && (
        <div className="flex justify-center p-4">
          <Loader2 className="size-5 animate-spin" />
        </div>
      )}
    </div>
  )
}
