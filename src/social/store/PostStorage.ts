import { supabase } from "@/config/supabase.config";
import type { PostPublicationResponse } from "@/interfaces/PostPublicationResponse.interface";
import type { PublicationWithDetailsResponse } from "@/interfaces/PublicationWithDetailsResponse.interface";
import { create } from "zustand";

interface PostStorage {
  insertPost: (
    dataPost: Partial<PostPublicationResponse>,
  ) => Promise<PostPublicationResponse>;
  dataPost: PublicationWithDetailsResponse[] | null;
  getPostWithDetails: (
    to: number,
    limit: number,
    id_user: string,
  ) => Promise<PublicationWithDetailsResponse[]>;
}

export const usePostStorage = create<PostStorage>()((set) => ({
  insertPost: async (dataPost: Partial<PostPublicationResponse>) => {
    // Guardando el post de publicación en la tabla publications sin el file
    const { file, ...current } = dataPost;
    const { data: currentPublication, error: errorCurrentPublication } =
      await supabase.from("publications").insert(current).select().single();
    if (errorCurrentPublication) throw errorCurrentPublication;

    if (!file) return currentPublication;

    // Subimos el archivo a supabase
    const new_id = currentPublication.id;
    const { data, error: errorUpload } = await supabase.storage
      .from("image_video")
      .upload(
        `publications/${new_id}.${current.type_file === "image" ? "webp" : "mp4"}`,
        file,
      );
    if (errorUpload) throw errorUpload;

    // Obteniendo la url del archivo
    const { data: publicUrlData } = supabase.storage
      .from("image_video")
      .getPublicUrl(data!.path);

    // Actualizando la tabla de post
    const { error: errorUpdate } = await supabase
      .from("publications")
      .update({ file: publicUrlData.publicUrl })
      .eq("id", new_id);
    if (errorUpdate) throw errorUpdate;
    return { ...currentPublication, file: publicUrlData.publicUrl };
  },
  dataPost: null,
  getPostWithDetails: async (to: number, from: number, id_user: string) => {
    const { data, error } = await supabase
      .rpc("publications_with_details", {
        _id_user: id_user,
      })
      .range(to, to + from - 1);
    if (error) throw error;
    set({ dataPost: data });
    return data;
  },
}));
