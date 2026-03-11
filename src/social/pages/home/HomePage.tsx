import { HeaderHome } from "./ui/HeaderHome"
import { MainHome } from "./ui/MainHome"

export const HomePage = () => {
  return (
    <div className="flex flex-col flex-1 min-h-0 border-mode">
      <HeaderHome />
      <MainHome />
    </div>
  )
}
