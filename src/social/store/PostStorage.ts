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
  getPublicationById: (
    publicationId: number,
    id_user: string,
  ) => Promise<PublicationWithDetailsResponse | null>;
  likePost: (object: any) => Promise<void>;
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

  getPublicationById: async (publicationId: number, id_user: string) => {
    const { data: pub, error: pubError } = await supabase
      .from("publications")
      .select(
        `
        id, description, file, created_at, id_user, likes, type_file,
        users!id_user (name, lastName, avatar, email)
      `,
      )
      .eq("id", publicationId)
      .single();

    if (pubError || !pub) return null;

    const usersRaw = pub.users;
    const usersData = Array.isArray(usersRaw)
      ? (usersRaw[0] as Record<string, unknown> | undefined)
      : (usersRaw as Record<string, unknown> | null | undefined);
    const users = usersData
      ? {
          name: String(usersData.name ?? ""),
          lastName: String(usersData.lastName ?? usersData.lastname ?? usersData.last_name ?? ""),
          avatar: (usersData.avatar as string | null) ?? null,
          email: String(usersData.email ?? ""),
        }
      : null;

    const { count: commentsCount } = await supabase
      .from("comments")
      .select("*", { count: "exact", head: true })
      .eq("id_publication", publicationId);

    let like_user_current = false;
    const { data: likeData } = await supabase
      .from("likes")
      .select("id")
      .eq("id_publication", publicationId)
      .eq("id_user", id_user)
      .maybeSingle();
    if (likeData) like_user_current = true;

    return {
      id: pub.id,
      description: pub.description ?? "",
      file: pub.file,
      created_at: pub.created_at,
      id_user: pub.id_user,
      likes: pub.likes ?? 0,
      type_file: pub.type_file,
      user_name: users?.name ?? "",
      user_lastname: users?.lastName ?? "",
      user_email: users?.email ?? "",
      user_avatar: users?.avatar ?? "",
      comments_count: commentsCount ?? 0,
      like_user_current,
    } as PublicationWithDetailsResponse;
  },

  likePost: async (object: any) => {
    const { error } = await supabase.rpc("toggle_like", object);
    if (error) throw error;
  },
}));
