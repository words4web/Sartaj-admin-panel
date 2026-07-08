import { useMutation, useQuery, useQueryClient } from "@tanstack/react-query";
import { themeApi } from "./theme.api";
import { toast } from "sonner";
import { THEME_METADATA } from "@/types/theme/theme.types";

export const THEME_KEYS = {
  all: ["themes"] as const,
  list: () => [...THEME_KEYS.all, "list"] as const,
  active: () => [...THEME_KEYS.all, "active"] as const,
};

export const useThemes = () => {
  return useQuery({
    queryKey: THEME_KEYS.list(),
    queryFn: () => themeApi.getAllThemes(),
    staleTime: 1000 * 60 * 60,
  });
};

export const useActiveTheme = () => {
  return useQuery({
    queryKey: THEME_KEYS.active(),
    queryFn: () => themeApi.getActiveTheme(),
    staleTime: 1000 * 60 * 60,
  });
};

export const useSetActiveTheme = () => {
  const queryClient = useQueryClient();
  return useMutation({
    mutationFn: (name: string) => themeApi.setActiveTheme(name),
    onSuccess: (data) => {
      queryClient.invalidateQueries({ queryKey: THEME_KEYS.list() });
      queryClient.invalidateQueries({ queryKey: THEME_KEYS.active() });
      const label = data
        ? THEME_METADATA[data.name]?.label || data.name
        : "Theme";
      toast.success(`"${label}" is now the active theme on the website`);
    },

    onError: (error: any) => {
      toast.error(
        error?.response?.data?.message || "Failed to update active theme",
      );
    },
  });
};
