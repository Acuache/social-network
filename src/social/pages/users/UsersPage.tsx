import { CustomPagination } from "@/components/CustomPagination"
import { useUserQuery } from "@/social/stack/UserStack"
import { CardUser } from "./ui/CardUser"
import { useSearchParams } from "react-router"
import { Loader2 } from "lucide-react"

export const UsersPage = () => {
  const [searchParams, setSearchParams] = useSearchParams()
  const page = Math.max(1, +(searchParams.get("page") ?? "1"))
  const limit = Number(searchParams.get("limit") ?? "6")

  const from = (page - 1) * limit
  const to = from + limit - 1

  const { data, isLoading } = useUserQuery(from, to)

  const totalPages = Math.ceil((data?.count ?? 0) / limit)

  const handlePageChange = (newPage: number) => {
    searchParams.set("page", newPage.toString())
    setSearchParams(searchParams)
  }


  return (
    <div className="flex flex-col flex-1 min-h-0 p-4 gap-4">
      <h1 className="text-xl font-bold">Usuarios</h1>

      {isLoading ? (
        <div className="flex-1 flex flex-col items-center justify-center gap-3 py-12">
          <Loader2 className="size-10 animate-spin text-muted-foreground" />
          <p className="text-sm text-muted-foreground">Cargando usuarios...</p>
        </div>
      ) : (
        <div className="flex-1 overflow-auto customScroll">
          <div className="flex flex-col gap-3">
            {data?.data.map((user) => (
              <CardUser key={user.id} user={user} />
            ))}
          </div>
        </div>
      )}

      {totalPages > 0 && (
        <CustomPagination
          currentPage={page}
          totalPages={totalPages}
          onPageChange={handlePageChange}
        />
      )}
    </div>
  )
}
