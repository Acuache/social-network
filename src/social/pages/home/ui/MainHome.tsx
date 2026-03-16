import { usePostQuery } from "@/social/stack/PostStack"
import { CurrentPost } from "./CurrentPost"
import { NewPostInput } from "./NewPostInput"
export const MainHome = () => {
  const { data } = usePostQuery()
  console.log(data)
  return (
    <div className="flex flex-col gap-7 overflow-auto p-4">
      <NewPostInput />
      <CurrentPost />
      <CurrentPost />
      <CurrentPost />
      <CurrentPost />
      <CurrentPost />
      <CurrentPost />
      <CurrentPost />
    </div>
  )
}
