import { useState, useEffect } from "react"
import { useSearchParams } from "react-router"
import { Input } from "@/components/ui/input"
import { useSearchQuery } from "@/social/stack/SearchStack"
import { CardUser } from "@/social/pages/users/ui/CardUser"
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar"
import { Card, CardContent } from "@/components/ui/card"
import { Link } from "react-router"
import { Loader2, Search, User, FileText, Hash } from "lucide-react"
import type { PublicationSearchResult } from "@/social/store/SearchStorage"
import type { User as UserType } from "@/auth/interfaces/UserResponse.interface"

type Tab = "all" | "users" | "publications"

export const SearchPage = () => {
  const [searchParams, setSearchParams] = useSearchParams()
  const q = searchParams.get("q") ?? ""
  const [query, setQuery] = useState(q)
  const [debouncedQuery, setDebouncedQuery] = useState(q)
  const [activeTab, setActiveTab] = useState<Tab>("all")

  useEffect(() => {
    setQuery(q)
    setDebouncedQuery(q)
  }, [q])

  useEffect(() => {
    const timer = setTimeout(() => setDebouncedQuery(query), 300)
    return () => clearTimeout(timer)
  }, [query])

  const handleSearch = (e: React.FormEvent) => {
    e.preventDefault()
    if (query.trim()) {
      searchParams.set("q", query.trim())
      setSearchParams(searchParams)
    }
  }

  const { users, publications, isLoading } = useSearchQuery(debouncedQuery)

  const hasResults = users.length > 0 || publications.length > 0
  const showResults = debouncedQuery.length >= 2

  return (
    <div className="flex flex-col flex-1 min-h-0 p-4 gap-4">
      <h1 className="text-xl font-bold">Buscar</h1>

      <form onSubmit={handleSearch} className="relative">
        <Search className="absolute left-3 top-1/2 -translate-y-1/2 size-4 text-muted-foreground" />
        <Input
          type="search"
          placeholder="Usuarios, publicaciones o #hashtags..."
          value={query}
          onChange={(e) => setQuery(e.target.value)}
          className="pl-9"
          autoFocus
        />
      </form>

      {showResults && (
        <>
          <div className="flex gap-2 border-b border-border pb-2">
            {(["all", "users", "publications"] as Tab[]).map((tab) => (
              <button
                key={tab}
                onClick={() => setActiveTab(tab)}
                className={`px-3 py-1.5 rounded-md text-sm font-medium transition-colors ${
                  activeTab === tab
                    ? "bg-primary text-primary-foreground"
                    : "hover:bg-muted text-muted-foreground"
                }`}
              >
                {tab === "all" && "Todo"}
                {tab === "users" && "Usuarios"}
                {tab === "publications" && "Publicaciones"}
              </button>
            ))}
          </div>

          {isLoading ? (
            <div className="flex justify-center py-12">
              <Loader2 className="size-8 animate-spin text-muted-foreground" />
            </div>
          ) : !hasResults ? (
            <p className="text-center text-muted-foreground py-12">
              No se encontraron resultados para &quot;{debouncedQuery}&quot;
            </p>
          ) : (
            <div className="flex-1 overflow-auto customScroll space-y-6">
              {(activeTab === "all" || activeTab === "users") && users.length > 0 && (
                <section>
                  <h2 className="flex items-center gap-2 text-sm font-semibold text-muted-foreground mb-3">
                    <User className="size-4" />
                    Usuarios ({users.length})
                  </h2>
                  <div className="flex flex-col gap-2">
                    {users.map((user) => (
                      <Link key={user.id} to="/usuarios">
                        <CardUser user={user as UserType} />
                      </Link>
                    ))}
                  </div>
                </section>
              )}

              {(activeTab === "all" || activeTab === "publications") && publications.length > 0 && (
                <section>
                  <h2 className="flex items-center gap-2 text-sm font-semibold text-muted-foreground mb-3">
                    <FileText className="size-4" />
                    Publicaciones ({publications.length})
                  </h2>
                  <div className="flex flex-col gap-3">
                    {publications.map((pub) => (
                      <PublicationSearchCard key={pub.id} publication={pub} />
                    ))}
                  </div>
                </section>
              )}
            </div>
          )}
        </>
      )}

      {!showResults && (
        <div className="flex flex-col items-center justify-center gap-2 py-16 text-muted-foreground">
          <Hash className="size-12 opacity-50" />
          <p className="text-sm">Escribe al menos 2 caracteres para buscar</p>
          <p className="text-xs">Usuarios, publicaciones o #hashtags</p>
        </div>
      )}
    </div>
  )
}

function PublicationSearchCard({ publication }: { publication: PublicationSearchResult }) {
  return (
    <Link to="/">
      <Card className="hover:bg-muted/50 transition-colors">
        <CardContent className="flex gap-4 p-4">
          <Avatar className="size-10 shrink-0">
            <AvatarImage src={publication.user_avatar ?? undefined} />
            <AvatarFallback className="text-sm">
              {publication.user_name[0]}{publication.user_lastname[0]}
            </AvatarFallback>
          </Avatar>
          <div className="flex-1 min-w-0">
            <p className="font-medium text-sm">
              {publication.user_name} {publication.user_lastname}
            </p>
            <p className="text-sm text-muted-foreground line-clamp-2">{publication.description}</p>
          </div>
        </CardContent>
      </Card>
    </Link>
  )
}
