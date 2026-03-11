import type { User } from "@/auth/interfaces/UserResponse.interface";
import { supabase } from "@/config/supabase.config";
import { create } from "zustand";

interface UserAllStore {
  getUserAll: (
    from: number,
    to: number,
  ) => Promise<{ data: User[]; count: number }>;
}

export const useUserStorage = create<UserAllStore>()(() => ({
  getUserAll: async (from: number, to: number) => {
    const { data, count, error } = await supabase
      .from("users")
      .select("*", { count: "exact" })
      .range(from, to);
    if (error) throw error;
    return { data: data ?? [], count: count ?? 0 };
  },
}));
