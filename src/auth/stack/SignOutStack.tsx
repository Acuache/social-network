import { useMutation } from "@tanstack/react-query"
import { useAuthStore } from "../storage/AuthStorage"
import { toast } from "sonner"

export const useSignOutMutate = () => {
  const signOut = useAuthStore(state => state.signOut)
  return useMutation({
    mutationKey: ['sign out sesion'],
    mutationFn: signOut,
    onSuccess: () => {
      toast.success('Sesión cerrada correctamente.')
    },
    onError: (error) => {
      toast.error(error.message)
    }
  })
}