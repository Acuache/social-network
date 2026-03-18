import { Separator } from "@/components/ui/separator"
import { useUserCountQuery } from "@/social/stack/UserStack"

export const HeaderHome = () => {
  const { data: userCount } = useUserCountQuery()

  return (
    <div>
      <header className="flex justify-between items-center  p-2">
        <h2>Inicio</h2>
        <span>({userCount ?? "—"}) Usuarios</span>
      </header>
      <Separator className="border-mode borer-b" />
    </div>
  )
}
