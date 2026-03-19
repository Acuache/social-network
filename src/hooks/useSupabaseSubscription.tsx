import { supabase } from "@/config/supabase.config"
import type { QueryKey } from "@tanstack/react-query"
import { useQueryClient } from "@tanstack/react-query"
import { useEffect, useRef } from "react"

interface SupabaseSubscriptionProps {
  channelName: string
  options: { event: "INSERT" | "UPDATE" | "DELETE" | "*"; schema: string; table: string }
  queryKey: QueryKey
}

export const useSupabaseSubscription = ({ channelName, options, queryKey }: SupabaseSubscriptionProps) => {
  const queryClient = useQueryClient()
  const queryKeyRef = useRef(queryKey)
  queryKeyRef.current = queryKey
  const { event, schema, table } = options

  useEffect(() => {
    const subscription = supabase.channel(channelName).on(
      'postgres_changes' as const,
      { event, schema, table },
      () => {
        queryClient.invalidateQueries({ queryKey: queryKeyRef.current })
      }
    ).subscribe()
    return () => { void supabase.removeChannel(subscription) }
  }, [channelName, event, schema, table, queryClient])
}
