import { useQuery } from "@tanstack/react-query";
import { useAuthStore, useSessionStore } from "../storage/AuthStorage";
import type { UserResponse } from "../layouts/User.response";

export const useUserProfileQuery = () => {
  const session = useSessionStore((state) => state.session);
  const getUserProfile = useAuthStore((state) => state.getUserProfile);

  return useQuery<UserResponse | null>({
    queryKey: ["user-profile", session?.user.id],
    queryFn: () => getUserProfile(session!.user.id),
    enabled: !!session,
  });
};
