import type { User } from "@/auth/interfaces/UserResponse.interface";
import { supabase } from "@/config/supabase.config";
import { create } from "zustand";

interface UserStorage {
  updateUser: (updateData: Partial<User>, id_user: string) => Promise<void>;
  uploadAvatarAndUpdateUser: (file: File, id_user: string) => Promise<void>;
}

export const useUpdateUserStorage = create<UserStorage>()(() => ({
  updateUser: async (updateData: Partial<User>, id_user: string) => {
    const { error } = await supabase
      .from("users")
      .update(updateData)
      .eq("id", id_user);
    if (error) throw error;
  },
  uploadAvatarAndUpdateUser: async (file: File, id_user: string) => {
    const ext = file.name.split(".").pop() || "webp";
    const path = `avatars/${id_user}.${ext}`;

    const { error: uploadError } = await supabase.storage
      .from("image_video")
      .upload(path, file, { upsert: true });
    if (uploadError) throw uploadError;

    const { data: publicUrlData } = supabase.storage
      .from("image_video")
      .getPublicUrl(path);

    const { error: updateError } = await supabase
      .from("users")
      .update({ avatar: publicUrlData.publicUrl })
      .eq("id", id_user);
    if (updateError) throw updateError;
  },
}));
