"use client";

import { create } from "zustand";
import { persist } from "zustand/middleware";
import { supabase } from "@/lib/supabase";
import axios from "@/lib/axios";

interface User {
  id: string;
  email: string;
}

interface AuthState {
  user: User | null;
  token: string | null;
  loading: boolean;
  error: string | null;
  _hasHydrated: boolean;
  setHasHydrated: (val: boolean) => void;
  signup: (email: string, password: string) => Promise<boolean>;
  login: (email: string, password: string) => Promise<boolean>;
  logout: () => Promise<void>;
  initialize: () => Promise<void>;
  getUser: () => Promise<void>;
}

export const useAuthStore = create<AuthState>()(
  persist(
    (set, get) => ({
      user: null,
      token: null,
      loading: false,
      error: null,
      _hasHydrated: false,

      setHasHydrated: (val) => set({ _hasHydrated: val }),

      signup: async (email, password) => {
        try {
          set({ loading: true, error: null });
          const { data, error } = await supabase.auth.signUp({ email, password });

          if (error) throw error;
          if (!data.session) {
            set({ error: "Please check your email for verification", loading: false });
            return false;
          }

          const token = data.session.access_token;
          await axios.post("/auth/sync-user", {}, {
            headers: { Authorization: `Bearer ${token}` },
          });

          set({
            user: { id: data.user!.id, email: data.user!.email! },
            token,
            loading: false,
          });
          return true;
        } catch (err: any) {
          set({ error: err.message, loading: false });
          return false;
        }
      },

      login: async (email, password) => {
        try {
          set({ loading: true, error: null });
          const { data, error } = await supabase.auth.signInWithPassword({ email, password });

          if (error) throw error;

          const token = data.session.access_token;
          await axios.post("/auth/sync-user", {}, {
            headers: { Authorization: `Bearer ${token}` },
          });

          set({
            user: { id: data.user.id, email: data.user.email! },
            token,
            loading: false,
          });
          return true;
        } catch (err: any) {
          set({ error: err.message, loading: false });
          return false;
        }
      },

      logout: async () => {
        await supabase.auth.signOut();
        set({ user: null, token: null });
        window.location.href = "/login";
      },

      // यह सिर्फ एक बार app start पर call करें
      initialize: async () => {
        try {
          // Supabase से fresh session लो (यह localStorage से auto-read करता है)
          const { data } = await supabase.auth.getSession();

          if (!data.session) {
            set({ token: null, user: null });
            return;
          }

          const token = data.session.access_token;
          set({
            token,
            user: {
              id: data.session.user.id,
              email: data.session.user.email!,
            },
          });

          // Token expire होने पर auto-refresh handle करो
          supabase.auth.onAuthStateChange((event, session) => {
            if (event === "TOKEN_REFRESHED" && session) {
              set({ token: session.access_token });
            }
            if (event === "SIGNED_OUT") {
              set({ user: null, token: null });
            }
          });

          await get().getUser();
        } catch (err) {
          console.error("Initialize failed:", err);
        }
      },

      getUser: async () => {
        try {
          const token = get().token;
          if (!token) return;

          const res = await axios.get("/auth/me", {
            headers: { Authorization: `Bearer ${token}` },
          });

          set({
            user: {
              id: res.data.supabase_id || res.data.id,
              email: res.data.email,
            },
          });
        } catch (err: any) {
          console.error("Auth verify failed:", err.message);
        }
      },
    }),
    {
      name: "auth-storage", // localStorage में save होगा
      partialize: (state) => ({
        // सिर्फ यही persist करो, functions नहीं
        user: state.user,
        token: state.token,
      }),
      onRehydrateStorage: () => (state) => {
        // Hydration complete होने पर flag set करो
        state?.setHasHydrated(true);
      },
    }
  )
);