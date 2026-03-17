import { supabase } from "@/config/supabase.config"
import type { QueryKey } from "@tanstack/react-query"
import { useQueryClient } from "@tanstack/react-query"
import { useEffect } from "react"

interface SupabaseSubscriptionProps {
  channelName: string
  options: { event: "INSERT" | "UPDATE" | "DELETE" | "*"; schema: string; table: string }
  queryKey: QueryKey
}

export const useSupabaseSubscription = ({ channelName, options, queryKey }: SupabaseSubscriptionProps) => {
  const queryClient = useQueryClient()
  useEffect(() => {
    const subscription = supabase.channel(channelName).on(
      'postgres_changes' as const,
      options,
      () => {
        queryClient.invalidateQueries({ queryKey })
      }
    ).subscribe()
    return () => { void supabase.removeChannel(subscription) }
  }, [channelName, queryKey, options])
}
