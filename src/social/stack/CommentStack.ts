import { useMutation, useQuery } from "@tanstack/react-query";
import { useCommentStorage } from "../store/CommentStorage";
import { toast } from "sonner";

export const userGetCommentMutate = () => {
  const insertComment = useCommentStorage((state) => state.insertComment);
  return useMutation({
    mutationKey: ["insert comment"],
    mutationFn: insertComment,
    onError: () => toast.error("Intente nuevamente"),
    onSuccess: () => toast.success("Agregado correctamente..."),
  });
};

export const useGetComments = (id_publication: number) => {
  const getComment = useCommentStorage((state) => state.getComment);
  return useQuery({
    queryKey: ["get comments", id_publication],
    queryFn: () => getComment(id_publication),
  });
};
