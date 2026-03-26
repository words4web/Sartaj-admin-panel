import axiosInstance from "@/lib/api/axios";
import { API_ROUTES } from "@/constants/api";
import { LoginCredentials, AuthResponse, User } from "@/types/auth/auth.types";

export const authService = {
  login: async (credentials: LoginCredentials): Promise<AuthResponse> => {
    return axiosInstance.post(API_ROUTES.AUTH.LOGIN, credentials);
  },

  logout: async (): Promise<void> => {
    try {
      await axiosInstance.post(API_ROUTES.AUTH.LOGOUT);
    } catch (error) {
      console.error("Logout error:", error);
    }
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

  getProfile: async (): Promise<User> => {
    const data = await axiosInstance.get<{ user: User }>(
      API_ROUTES.AUTH.PROFILE,
    );
    return (data as any)?.user;
  },
};
