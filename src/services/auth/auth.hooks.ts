import { useQuery, useMutation } from "@tanstack/react-query";
import { authService } from "./auth.service";
import { LoginCredentials } from "@/types/auth/auth.types";
import { toast } from "sonner";

export const authKeys = {
  all: ["auth"] as const,
  profile: () => [...authKeys.all, "profile"] as const,
};

export const useProfile = () => {
  return useQuery({
    queryKey: authKeys.profile(),
    queryFn: authService.getProfile,
    staleTime: 1000 * 60 * 30, // 30 minutes
  });
};

export const useLogin = () => {
  return useMutation({
    mutationFn: (credentials: LoginCredentials) =>
      authService.login(credentials),
    onSuccess: () => {
      toast.success("Logged in successfully");
    },
    onError: (error: any) => {
      toast.error(error?.message || "Login failed");
    },
  });
};

export const useLogout = () => {
  return useMutation({
    mutationFn: authService.logout,
    onSuccess: () => {
      toast.success("Logged out successfully");
    },
  });
};
