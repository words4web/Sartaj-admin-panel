import axiosInstance from "@/lib/api/axios";
import { API_ROUTES } from "@/constants/api";
import { LoginCredentials, AuthResponse, User } from "@/types/auth/auth.types";

export const authService = {
  login: async (credentials: LoginCredentials): Promise<AuthResponse> => {
    return axiosInstance.post(API_ROUTES.AUTH.LOGIN, credentials);
  },

  logout: async (fcmToken?: string | null): Promise<void> => {
    try {
      await axiosInstance.post(API_ROUTES.AUTH.LOGOUT, { fcmToken });
    } catch (error) {}
  },

  register: async (data: Record<string, any>): Promise<AuthResponse> => {
    return axiosInstance.post(
      API_ROUTES.AUTH.LOGIN.replace("/login", "/register"),
      data,
    );
  },

  refreshToken: async (): Promise<AuthResponse> => {
    return axiosInstance.post(API_ROUTES.AUTH.REFRESH);
  },

  getProfile: async (): Promise<{
    user: User;
    unreadNotificationCount: number;
  }> => {
    return axiosInstance.get(API_ROUTES.AUTH.PROFILE);
  },
};
