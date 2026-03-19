import { useMutation, useQuery, useQueryClient } from "@tanstack/react-query";
import { useCommentStorage } from "../store/CommentStorage";
import { toast } from "sonner";

export const userGetCommentMutate = () => {
  const queryClient = useQueryClient();
  const insertComment = useCommentStorage((state) => state.insertComment);
  return useMutation({
    mutationKey: ["insert comment"],
    mutationFn: insertComment,
    onError: () => toast.error("Intente nuevamente"),
    onSuccess: (_data, variables) => {
      queryClient.invalidateQueries({ queryKey: ["get comments", variables.id_publication] });
      queryClient.invalidateQueries({ queryKey: ["publication"] });
      toast.success("Agregado correctamente...");
    },
  });
};

export const useGetComments = (id_publication: number) => {
  const getComment = useCommentStorage((state) => state.getComment);
  return useQuery({
    queryKey: ["get comments", id_publication],
    queryFn: () => getComment(id_publication),
  });
};
