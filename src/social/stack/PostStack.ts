import { useInfiniteQuery, useMutation, useQueryClient } from "@tanstack/react-query";
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

export const usePostQuery = (pageSize = 9) => {
  const session = useSessionStore((state) => state.session);
  const getPostWithDetails = usePostStorage(
    (state) => state.getPostWithDetails,
  );

  return useInfiniteQuery({
    queryKey: ["get post current", session?.user.id],
    queryFn: ({ pageParam = 0 }) =>
      getPostWithDetails(pageParam, pageSize, session!.user.id),
    initialPageParam: 0,
    getNextPageParam: (lastPage, _allPages, lastPageParam) => {
      if (!lastPage || lastPage.length < pageSize) return undefined;
      return lastPageParam + pageSize;
    },
    enabled: !!session,
  });
};

export const useLikePostMutate = () => {
  const likePost = usePostStorage((state) => state.likePost);
  const queryClient = useQueryClient();
  return useMutation({
    mutationKey: ["like post"],
    mutationFn: likePost,
    onError: (error) => {
      toast.error("Algo salio mal, intente nuevamente...");
      console.log(error.message);
    },
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ["get post current"] });
    },
  });
};
