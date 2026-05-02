import { create } from "zustand";
import { persist } from "zustand/middleware";
import { AuthState, User, LoginCredentials } from "@/types/auth/auth.types";
import { authService } from "@/services/auth/auth.service";
import { useDeviceStore } from "@/stores/deviceStore";
import { useNotificationStore } from "@/stores/notificationStore";
import { STORAGE_KEYS, CUSTOM_EVENTS } from "@/lib/constants";

interface AuthStore extends AuthState {
  setUser: (user: User | null) => void;
  setToken: (token: string | null) => void;
  setLoading: (loading: boolean) => void;
  setError: (error: string | null) => void;
  login: (credentials: LoginCredentials) => Promise<void>;
  logout: () => Promise<void>;
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

      logout: async () => {
        try {
          const fcmToken = useDeviceStore.getState().fcmToken;
          await authService.logout(fcmToken);
          if (fcmToken) {
            useDeviceStore.getState().setFcmToken(null);
          }
        } catch (err) {
          console.error("Logout failed:", err);
        }

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
          const response = await authService.getProfile();
          set({
            user: response.user,
            isAuthenticated: true,
            isLoading: false,
          });

          // Sync unread notification count
          if (typeof response.unreadNotificationCount === "number") {
            useNotificationStore
              .getState()
              .setUnreadCount(response.unreadNotificationCount);
          }
        } catch (error: any) {
          const errorMessage =
            error?.response?.data?.message ||
            error?.message ||
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

if (typeof window !== "undefined") {
  window.addEventListener(CUSTOM_EVENTS.AUTH_LOGOUT, async () => {
    await useAuthStore.getState().logout();
    window.location.href = "/login";
  });
  window.addEventListener(CUSTOM_EVENTS.AUTH_REFRESH, (e: any) => {
    if (e.detail?.token) {
      useAuthStore.getState().setToken(e.detail.token);
    }
  });
}
