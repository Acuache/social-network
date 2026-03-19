import { supabase } from "@/config/supabase.config"
import type { User } from "@/auth/interfaces/UserResponse.interface"
import { create } from "zustand"

export interface PublicationSearchResult {
  id: number
  description: string
  file: string | null
  created_at: string
  id_user: string
  likes: number
  type_file: string | null
  user_name: string
  user_lastname: string
  user_avatar: string | null
}

interface SearchStorage {
  searchUsers: (query: string, limit?: number) => Promise<User[]>
  searchPublications: (query: string, limit?: number) => Promise<PublicationSearchResult[]>
}

const cleanQuery = (q: string) => q.trim().replace(/^#/, "")

export const useSearchStorage = create<SearchStorage>()(() => ({
  searchUsers: async (query: string, limit = 10) => {
    const q = cleanQuery(query)
    if (!q) return []

    const { data, error } = await supabase
      .from("users")
      .select("*")
      .or(`name.ilike.%${q}%,lastName.ilike.%${q}%,email.ilike.%${q}%`)
      .limit(limit)

    if (error) throw error
    return data ?? []
  },

  searchPublications: async (query: string, limit = 10) => {
    const q = cleanQuery(query)
    if (!q) return []

    const { data, error } = await supabase
      .from("publications")
      .select(`
        id, description, file, created_at, id_user, likes, type_file,
        users!id_user (name, lastName, avatar)
      `)
      .ilike("description", `%${q}%`)
      .order("created_at", { ascending: false })
      .limit(limit)

    if (error) throw error
    if (!data?.length) return []

    return data.map((p: Record<string, unknown>) => {
      const usersRaw = p.users;
      const usersData = Array.isArray(usersRaw)
        ? (usersRaw[0] as Record<string, unknown> | undefined)
        : (usersRaw as Record<string, unknown> | null | undefined);
      const users = usersData
        ? {
            name: String(usersData.name ?? ""),
            lastName: String(usersData.lastName ?? usersData.lastname ?? usersData.last_name ?? ""),
            avatar: (usersData.avatar as string | null) ?? null,
          }
        : null;
      return {
        id: p.id as number,
        description: (p.description as string) ?? "",
        file: p.file as string | null,
        created_at: p.created_at as string,
        id_user: p.id_user as string,
        likes: (p.likes as number) ?? 0,
        type_file: p.type_file as string | null,
        user_name: users?.name ?? "",
        user_lastname: users?.lastName ?? "",
        user_avatar: users?.avatar ?? null,
      }
    })
  },
}))
