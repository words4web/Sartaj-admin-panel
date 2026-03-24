import { create } from "zustand";
import { persist } from "zustand/middleware";
import { AuthState, User, LoginCredentials } from "@/types/auth/auth.types";
import { storageUtils } from "@/lib/utils";
import { STORAGE_KEYS } from "@/lib/constants";
import { authService } from "@/services/authService";

interface AuthStore extends AuthState {
  setUser: (user: User | null) => void;
  setToken: (token: string | null) => void;
  setLoading: (loading: boolean) => void;
  setError: (error: string | null) => void;
  login: (credentials: LoginCredentials) => Promise<void>;
  logout: () => void;
  hydrate: () => void;
}

export const useAuthStore = create<AuthStore>()(
  persist(
    (set) => ({
      user: null,
      token: null,
      isAuthenticated: false,
      isLoading: false,
      error: null,

      setUser: (user) =>
        set({
          user,
          isAuthenticated: user !== null,
        }),

      setToken: (token) => {
        if (token) {
          storageUtils.set(STORAGE_KEYS.AUTH_TOKEN, token);
        } else {
          storageUtils.remove(STORAGE_KEYS.AUTH_TOKEN);
        }
        set({ token });
      },

      setLoading: (isLoading) => set({ isLoading }),

      setError: (error) => set({ error }),

      login: async (credentials: LoginCredentials) => {
        set({ isLoading: true, error: null });
        try {
          const { user, token } = await authService.login(credentials);

          set({
            user,
            token,
            isAuthenticated: true,
            isLoading: false,
          });

          storageUtils.set(STORAGE_KEYS.AUTH_TOKEN, token);
          storageUtils.set(STORAGE_KEYS.USER_DATA, user);
        } catch (error: any) {
          const errorMessage =
            error?.response?.data?.message || error.message || "Login failed";
          set({
            error: errorMessage,
            isLoading: false,
          });
          throw error;
        }
      },

      logout: () => {
        storageUtils.remove(STORAGE_KEYS.AUTH_TOKEN);
        storageUtils.remove(STORAGE_KEYS.USER_DATA);
        set({
          user: null,
          token: null,
          isAuthenticated: false,
          error: null,
        });
      },

      hydrate: () => {
        const token = storageUtils.get(STORAGE_KEYS.AUTH_TOKEN);
        const user = storageUtils.get(STORAGE_KEYS.USER_DATA);

        if (token && user) {
          set({
            token,
            user,
            isAuthenticated: true,
          });
        }
      },
    }),
    {
      name: "auth-store",
      partialize: (state) => ({
        user: state.user,
        token: state.token,
        isAuthenticated: state.isAuthenticated,
      }),
    },
  ),
);

// Listen to logout events from axios interceptor
if (typeof window !== "undefined") {
  window.addEventListener("auth:logout", () => {
    useAuthStore.getState().logout();
  });
}
