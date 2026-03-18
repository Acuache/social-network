import { useMutation } from "@tanstack/react-query"
import { useUpdateUserStorage } from "../store/UpdateUserStorage"
import type { User } from "@/auth/interfaces/UserResponse.interface"

type UpdateAvatarParams =
  | { updateData: Partial<User>; id_user: string }
  | { file: File; id_user: string }

export const useUpdateUserMutate = () => {
  const updateUser = useUpdateUserStorage(state => state.updateUser)
  const uploadAvatarAndUpdateUser = useUpdateUserStorage(state => state.uploadAvatarAndUpdateUser)

  return useMutation({
    mutationKey: ['update user'],
    mutationFn: (params: UpdateAvatarParams) => {
      if ("file" in params) {
        return uploadAvatarAndUpdateUser(params.file, params.id_user)
      }
      return updateUser(params.updateData, params.id_user)
    }
  })
}