import { create } from "zustand";
import type {
  SignInInterface,
  SignUpInterface,
} from "../interfaces/SignUp.interface";
import { supabase } from "@/config/supabase.config";
import type { AuthResponse, OAuthResponse, Session } from "@supabase/auth-js";
import type { UserResponse } from "../layouts/User.response";
import { queryClient } from "@/SocialApp";

interface AuthStore {
  createUserAndLogin: (data: SignUpInterface) => Promise<AuthResponse["data"]>;
  signOut: () => Promise<void>;
  getUserProfile: (userId: string) => Promise<UserResponse>;
  signInWithPassword: (
    formData: SignInInterface,
  ) => Promise<AuthResponse["data"]>;
  signInWithGoogle: () => Promise<OAuthResponse["data"]>;
  signInWithFacebook: () => Promise<OAuthResponse["data"]>;
}

export const useAuthStore = create<AuthStore>()(() => ({
  createUserAndLogin: async (dataForm: SignUpInterface) => {
    const { data, error } = await supabase.auth.signUp({
      email: dataForm.email,
      password: dataForm.password,
      options: {
        data: {
          full_name: `${dataForm.name} ${dataForm.lastName}`,
        },
      },
    });
    if (error) throw new Error(error.message);
    return data;
  },
  signOut: async () => {
    const { error } = await supabase.auth.signOut();
    if (error) throw new Error("Algo salió mal, intente nuevamente.");
  },
  getUserProfile: async (userId: string) => {
    const { data, error } = await supabase
      .from("users")
      .select("*")
      .eq("id", userId)
      .maybeSingle();
    if (error) throw error;
    return data;
  },
  signInWithPassword: async (formData: SignInInterface) => {
    const { data, error } = await supabase.auth.signInWithPassword({
      email: formData.email,
      password: formData.password,
    });
    if (error) throw error;
    return data;
  },
  signInWithGoogle: async () => {
    const { data, error } = await supabase.auth.signInWithOAuth({
      provider: "google",
    });
    if (error) throw error;
    return data;
  },
  signInWithFacebook: async () => {
    const { data, error } = await supabase.auth.signInWithOAuth({
      provider: "facebook",
    });
    if (error) throw error;
    return data;
  },
}));

// --- Store para la sesión (listener reactivo) ---

interface SessionStore {
  session: Session | null;
  isLoading: boolean;
}

export const useSessionStore = create<SessionStore>()((set) => {
  supabase.auth.onAuthStateChange((event, session) => {
    if (event === "INITIAL_SESSION") {
      set({ session, isLoading: false });
      console.log("Ejecutado -> INITIAL_SESSION");
    } else if (event === "SIGNED_IN") {
      set({ session });
      console.log("Ejecutado -> SIGNED_IN");
      console.log("---");
    } else if (event === "SIGNED_OUT") {
      set({ session: null });
      queryClient.clear();
      console.log("Ejecutado -> SIGNED_OUT");
    } else if (event === "PASSWORD_RECOVERY") {
      // TODO: manejar recuperación de contraseña
      console.log("PASSWORD_RECOVERY");
    } else if (event === "TOKEN_REFRESHED") {
      set({ session });
      console.log("Ejecutado -> TOKEN_REFRESHED");
    } else if (event === "USER_UPDATED") {
      set({ session });
      console.log("Ejecutado -> USER_UPDATED");
    }
  });

  return {
    session: null,
    isLoading: true,
  };
});
