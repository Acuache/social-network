import { useMutation } from "@tanstack/react-query";
import { usePostStorage } from "../store/PostStorage";
import { useModalStorage } from "../store/useModalStorage";
import { toast } from "sonner";

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
