import { useMutation, useQuery } from "@tanstack/react-query";
import { usePostStorage } from "../store/PostStorage";
import { useModalStorage } from "../store/useModalStorage";
import { toast } from "sonner";
import { useSessionStore } from "@/auth/storage/AuthStorage";

export const usePostStackMutation = () => {
  const insertPost = usePostStorage((state) => state.insertPost);
  const setShowModal = useModalStorage((state) => state.setShowModal);
  return useMutation({
    mutationKey: ["inser new Post"],
    mutationFn: insertPost,
    onSuccess: () => {
      setShowModal();
      toast.success("Publicación creada correctamente...", {
        position: "top-right",
      });
    },
    onError: (error) => {
      console.error("Supabase error:", error);
      toast.error("Algo salio mal, intente nuevamente...");
    },
  });
};

export const usePostQuery = (to = 0, from = 9) => {
  const session = useSessionStore((state) => state.session);
  const getPostWithDetails = usePostStorage(
    (state) => state.getPostWithDetails,
  );
  return useQuery({
    queryKey: ["get post current", session!.user.id],
    queryFn: () => getPostWithDetails(to, from, session!.user.id),
    enabled: !!session,
  });
};
