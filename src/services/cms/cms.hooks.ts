import { useMutation, useQuery, useQueryClient } from "@tanstack/react-query";
import { cmsApi } from "./cms.api";
import {
  CMSFilters,
  CreateCMSPayload,
  UpdateCMSPayload,
} from "@/types/cms/cms.types";
import { toast } from "sonner";

export const CMS_KEYS = {
  all: ["cms"] as const,
  lists: () => [...CMS_KEYS.all, "list"] as const,
  list: (filters: CMSFilters) => [...CMS_KEYS.lists(), filters] as const,
  details: () => [...CMS_KEYS.all, "detail"] as const,
  detail: (id: string) => [...CMS_KEYS.details(), id] as const,
};

export const useCmsList = (filters: CMSFilters = {}) => {
  return useQuery({
    queryKey: CMS_KEYS.list(filters),
    queryFn: () => cmsApi.getCmsList(filters),
  });
};

export const useCmsDetail = (id: string) => {
  return useQuery({
    queryKey: CMS_KEYS.detail(id),
    queryFn: () => cmsApi.getCmsById(id),
    enabled: !!id,
  });
};

export const useCreateCms = () => {
  const queryClient = useQueryClient();
  return useMutation({
    mutationFn: (data: CreateCMSPayload) => cmsApi.createCms(data),
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: CMS_KEYS.lists() });
      toast.success("Page created successfully");
    },
    onError: (error: any) => {
      toast.error(error?.response?.data?.message || "Failed to create page");
    },
  });
};

export const useUpdateCms = () => {
  const queryClient = useQueryClient();
  return useMutation({
    mutationFn: ({ id, data }: { id: string; data: UpdateCMSPayload }) =>
      cmsApi.updateCms(id, data),
    onSuccess: (_, { id }) => {
      queryClient.invalidateQueries({ queryKey: CMS_KEYS.lists() });
      queryClient.invalidateQueries({ queryKey: CMS_KEYS.detail(id) });
      toast.success("Page updated successfully");
    },
    onError: (error: any) => {
      toast.error(error?.response?.data?.message || "Failed to update page");
    },
  });
};

export const useDeleteCms = () => {
  const queryClient = useQueryClient();
  return useMutation({
    mutationFn: (id: string) => cmsApi.deleteCms(id),
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: CMS_KEYS.lists() });
      toast.success("Page deleted successfully");
    },
    onError: (error: any) => {
      toast.error(error?.response?.data?.message || "Failed to delete page");
    },
  });
};
