import { useMutation } from "@tanstack/react-query"
import { useAuthStore } from "../storage/AuthStorage"
import { toast } from "sonner"

export const useCreateUserAndSessionMutate = () => {
  const createUserAndLogin = useAuthStore(state => state.createUserAndLogin)
  return useMutation({
    mutationKey: ['init login with email and password'],
    mutationFn: createUserAndLogin,
    onError: (error) => {
      const authErrors: Record<string, string> = {
        "User already registered": "Este correo ya está registrado",
        "Invalid email": "Correo inválido",
        "Password should be at least 6 characters": "La contraseña debe tener al menos 6 caracteres",
        "Email rate limit exceeded": "Demasiados intentos, intenta más tarde"
      }
      toast.error(authErrors[error.message] ?? "Ocurrió un error inesperado")
    },
    onSuccess: () => {
      toast.success('Cuenta creada correctamente', {
        position: 'top-right'
      })
    }
  })
}

export const useSignInWithPasswordMutate = () => {
  const signInWithPassword = useAuthStore(state => state.signInWithPassword)
  return useMutation({
    mutationKey: ['sign in with password'],
    mutationFn: signInWithPassword,
    onError: () => {
      toast.error('Correo o contraseña incorrectas')
    },
    onSuccess: () => {
      toast.success('Cuenta iniciada correctamente', {
        position: 'top-right'
      })
    }
  })
}

export const useSignInWithOAuthMutate = () => {
  const signInWithGoogle = useAuthStore(state => state.signInWithGoogle)

  return useMutation({
    mutationKey: ['init login with oaut with google'],
    mutationFn: signInWithGoogle,
    onError: () => {
      toast.error('No se pudo conectar con Google')
    },
  })
}
export const signInWithFacebook = () => {
  const signInWithFacebook = useAuthStore(state => state.signInWithFacebook)

  return useMutation({
    mutationKey: ['init login with oaut with google'],
    mutationFn: signInWithFacebook,
    onError: () => {
      toast.error('No se pudo conectar con Facebook')
    },
  })
}


