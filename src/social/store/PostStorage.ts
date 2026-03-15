import { supabase } from "@/config/supabase.config";
import type { PostPublicationResponse } from "@/interfaces/PostPublicationResponse.interface";
import { create } from "zustand";

interface PostStorage {
  insertPost: (
    dataPost: Partial<PostPublicationResponse>,
  ) => Promise<PostPublicationResponse>;
}

export const usePostStorage = create<PostStorage>()(() => ({
  insertPost: async (dataPost: Partial<PostPublicationResponse>) => {
    // Guardando el post de publicación en la tabla publications sin el file
    const { file, ...current } = dataPost;
    const { data: currentPublication, error: errorCurrentPublication } =
      await supabase.from("publications").insert(current).select().single();
    if (errorCurrentPublication) throw errorCurrentPublication;

    if (!file) return;

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
    await supabase
      .from("publications")
      .update({ file: publicUrlData.publicUrl })
      .eq("id", new_id);
    return currentPublication;
  },
}));
