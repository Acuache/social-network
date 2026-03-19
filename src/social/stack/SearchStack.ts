import { useQuery } from "@tanstack/react-query"
import { useSearchStorage } from "../store/SearchStorage"

export const useSearchQuery = (query: string, enabled = true) => {
  const searchUsers = useSearchStorage((state) => state.searchUsers)
  const searchPublications = useSearchStorage((state) => state.searchPublications)

  const usersQuery = useQuery({
    queryKey: ["search", "users", query],
    queryFn: () => searchUsers(query, 8),
    enabled: enabled && query.trim().length >= 2,
  })

  const publicationsQuery = useQuery({
    queryKey: ["search", "publications", query],
    queryFn: () => searchPublications(query, 8),
    enabled: enabled && query.trim().length >= 2,
  })

  return {
    users: usersQuery.data ?? [],
    publications: publicationsQuery.data ?? [],
    isLoading: usersQuery.isLoading || publicationsQuery.isLoading,
    isFetching: usersQuery.isFetching || publicationsQuery.isFetching,
  }
}
