import { supabase } from "@/config/supabase.config";
import type { Comment } from "@/social/interfaces/Comment.interface";
import { create } from "zustand";
import type { CommentsWithResponse } from "../interfaces/CommentsWithResponse.interface";
interface CommentStorage {
  insertComment: (comment: Partial<Comment>) => Promise<void>;
  getComment: (id_publication: number) => Promise<CommentsWithResponse[]>;
}
export const useCommentStorage = create<CommentStorage>()(() => ({
  insertComment: async (comment: Partial<Comment>) => {
    const { error } = await supabase.from("comments").insert(comment);
    if (error) throw error;
  },
  getComment: async (id_publication: number) => {
    const { data, error } = await supabase.rpc("comment_with_response", {
      _id_publication: id_publication,
    });
    if (error) throw error;
    return data;
  },
}));
