import { CustomPagination } from "@/components/CustomPagination"
import { useUserQuery } from "@/social/stack/UserStack"
import { CardUser } from "./ui/CardUser"
import { useSearchParams } from "react-router"
import AnimatedList from "@/components/AnimatedList"


export const UsersPage = () => {
  const [searchParams, setSearchParams] = useSearchParams()
  const page = Math.max(1, +(searchParams.get("page") ?? "1"))
  const limit = Number(searchParams.get('limit') ?? '6')

  const from = (page - 1) * limit
  const to = from + limit - 1

  const { data, isLoading } = useUserQuery(from, to)

  const totalPages = Math.ceil((data?.count ?? 0) / limit)

  const handlePageChange = (newPage: number) => {
    searchParams.set("page", newPage.toString())
    setSearchParams(searchParams)
  }
  if (isLoading) return <span>Cargando datos...</span>
  return (
    <div className="flex flex-col p-4 gap-4">
      <h1 className="text-xl font-bold">Usuarios</h1>

      <div className="flex-1 ">
        <AnimatedList
          className="w-full h-full"
          items={data!.data}
          renderItem={(user) => <CardUser user={user} />}
          onItemSelect={(user) => console.log(user)}
          showGradients={false}
          enableArrowNavigation
          displayScrollbar
        />
      </div>

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
