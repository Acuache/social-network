import { Navigate } from "react-router"
import type { PropsWithChildren } from "react"

import { useSessionStore } from "@/auth/storage/AuthStorage"
import { useUserProfileQuery } from "@/auth/stack/UserStack"
import { CustomLoading } from "@/components/CustomLoading"

export const AuthenticatedRoute = ({ children }: PropsWithChildren) => {
  const session = useSessionStore(state => state.session)
  const isLoading = useSessionStore(state => state.isLoading)
  const { isLoading: isLoadingProfile } = useUserProfileQuery()

  if (isLoading || isLoadingProfile) return <CustomLoading />
  if (!session) return <Navigate to='/auth/login' />
  return children
}

export const GuestRoute = ({ children }: PropsWithChildren) => {
  const session = useSessionStore(state => state.session)
  const isLoading = useSessionStore(state => state.isLoading)
  if (isLoading) return <CustomLoading />
  if (session) return <Navigate to='/' />
  return children
}