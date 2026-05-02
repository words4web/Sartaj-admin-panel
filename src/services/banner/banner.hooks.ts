import { useMutation, useQuery, useQueryClient } from "@tanstack/react-query";
import { bannerApi } from "./banner.api";
import {
  BannerFilters,
  CreateBannerPayload,
  UpdateBannerPayload,
} from "@/types/banner/banner.types";
import { toast } from "sonner";

export const BANNER_KEYS = {
  all: ["banners"] as const,
  lists: () => [...BANNER_KEYS.all, "list"] as const,
  list: (filters: BannerFilters) => [...BANNER_KEYS.lists(), filters] as const,
  details: () => [...BANNER_KEYS.all, "detail"] as const,
  detail: (id: string) => [...BANNER_KEYS.details(), id] as const,
};

export const useBanners = (filters: BannerFilters = {}) => {
  return useQuery({
    queryKey: BANNER_KEYS.list(filters),
    queryFn: () => bannerApi.getBanners(filters),
  });
};

export const useBanner = (id: string) => {
  return useQuery({
    queryKey: BANNER_KEYS.detail(id),
    queryFn: () => bannerApi.getBannerById(id),
    enabled: !!id,
  });
};

export const useCreateBanner = () => {
  const queryClient = useQueryClient();
  return useMutation({
    mutationFn: (data: CreateBannerPayload) => bannerApi.createBanner(data),
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: BANNER_KEYS.lists() });
      toast.success("Banner created successfully");
    },
    onError: (error: any) => {
      toast.error(error?.response?.data?.message || "Failed to create banner");
    },
  });
};

export const useUpdateBanner = () => {
  const queryClient = useQueryClient();
  return useMutation({
    mutationFn: ({ id, data }: { id: string; data: UpdateBannerPayload }) =>
      bannerApi.updateBanner(id, data),
    onSuccess: (_, { id }) => {
      queryClient.invalidateQueries({ queryKey: BANNER_KEYS.lists() });
      queryClient.invalidateQueries({ queryKey: BANNER_KEYS.detail(id) });
      toast.success("Banner updated successfully");
    },
    onError: (error: any) => {
      toast.error(error?.response?.data?.message || "Failed to update banner");
    },
  });
};

export const useToggleBannerStatus = () => {
  const queryClient = useQueryClient();
  return useMutation({
    mutationFn: ({ id, isActive }: { id: string; isActive: boolean }) =>
      bannerApi.toggleStatus(id, isActive),
    onSuccess: (_, { id }) => {
      queryClient.invalidateQueries({ queryKey: BANNER_KEYS.lists() });
      queryClient.invalidateQueries({ queryKey: BANNER_KEYS.detail(id) });
      toast.success("Status updated successfully");
    },
    onError: (error: any) => {
      toast.error(error?.response?.data?.message || "Failed to update status");
    },
  });
};

export const useDeleteBanner = () => {
  const queryClient = useQueryClient();
  return useMutation({
    mutationFn: (id: string) => bannerApi.deleteBanner(id),
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: BANNER_KEYS.lists() });
      toast.success("Banner deleted successfully");
    },
    onError: (error: any) => {
      toast.error(error?.response?.data?.message || "Failed to delete banner");
    },
  });
};
