import { create } from "zustand";
import { persist } from "zustand/middleware";
import { AuthState, User, LoginCredentials } from "@/types/auth/auth.types";
import { authService } from "@/services/auth/auth.service";
import { STORAGE_KEYS } from "@/lib/constants";

interface AuthStore extends AuthState {
  setUser: (user: User | null) => void;
  setToken: (token: string | null) => void;
  setLoading: (loading: boolean) => void;
  setError: (error: string | null) => void;
  login: (credentials: LoginCredentials) => Promise<void>;
  logout: () => void;
  getProfile: () => Promise<void>;
  _hasHydrated: boolean;
  setHasHydrated: (state: boolean) => void;
}

export const useAuthStore = create<AuthStore>()(
  persist(
    (set) => ({
      user: null,
      token: null,
      isAuthenticated: false,
      isLoading: false,
      error: null,
      _hasHydrated: false,
      setHasHydrated: (state) => set({ _hasHydrated: state }),

      setUser: (user) =>
        set({
          user,
          isAuthenticated: user !== null,
        }),

      setToken: (token) => set({ token }),

      setLoading: (isLoading) => set({ isLoading }),

      setError: (error) => set({ error }),

      login: async (credentials: LoginCredentials) => {
        set({ isLoading: true, error: null });
        try {
          const { admin, accessToken } = await authService.login(credentials);

          set({
            user: admin,
            token: accessToken,
            isAuthenticated: true,
            isLoading: false,
          });
        } catch (error: any) {
          const errorMessage =
            error?.response?.data?.message || error?.message || "Login failed";
          set({
            error: errorMessage,
            isLoading: false,
          });
          throw error;
        }
      },

      logout: () => {
        set({
          user: null,
          token: null,
          isAuthenticated: false,
          error: null,
        });
      },
      getProfile: async () => {
        const { token } = useAuthStore.getState();
        if (!token) return;

        set({ isLoading: true, error: null });
        try {
          const user = await authService.getProfile();
          set({
            user,
            isAuthenticated: true,
            isLoading: false,
          });
        } catch (error: any) {
          const errorMessage =
            error?.response?.data?.message ||
            error.message ||
            "Failed to fetch profile";
          set({
            error: errorMessage,
            isLoading: false,
          });
          // If profile fetch fails, it might be because the token is invalid
          // We don't necessarily want to logout automatically here,
          // as the refresh interceptor might handle it.
        }
      },
    }),
    {
      name: STORAGE_KEYS.AUTH_STORE,
      partialize: (state) => ({
        user: state.user,
        token: state.token,
        isAuthenticated: state.isAuthenticated,
      }),
      onRehydrateStorage: (state) => {
        return () => state.setHasHydrated(true);
      },
    },
  ),
);

// Listen to auth events from axios interceptor seamlessly
if (typeof window !== "undefined") {
  window.addEventListener("auth:logout", () => {
    useAuthStore.getState().logout();
  });
  window.addEventListener("auth:refresh", (e: any) => {
    if (e.detail?.token) {
      useAuthStore.getState().setToken(e.detail.token);
    }
  });
}
