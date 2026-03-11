import { Separator } from "@/components/ui/separator"

export const HeaderHome = () => {
  return (
    <div>
      <header className="flex justify-between items-center  p-2">
        <h2>Inicio</h2>
        <span>(100) Usuarios</span>
      </header>
      <Separator className="border-mode borer-b" />
    </div>
  )
}
