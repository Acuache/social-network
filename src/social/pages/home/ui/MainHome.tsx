import { CurrentPost } from "./CurrentPost"
import { NewPostInput } from "./NewPostInput"

export const MainHome = () => {
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
