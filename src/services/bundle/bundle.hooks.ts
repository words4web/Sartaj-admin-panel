import { useQuery, useMutation, useQueryClient } from "@tanstack/react-query";
import { bundleApi } from "./bundle.api";
import { CreateBundlePayload } from "@/types/bundle/bundle.types";
import { toast } from "sonner";

export const useGetBundles = () => {
  return useQuery({
    queryKey: ["bundles"],
    queryFn: bundleApi.getBundles,
  });
};

export const useGetBundleById = (id: string) => {
  return useQuery({
    queryKey: ["bundle", id],
    queryFn: () => bundleApi.getBundleById(id),
    enabled: !!id,
  });
};

export const useCreateBundle = () => {
  const queryClient = useQueryClient();
  return useMutation({
    mutationFn: (data: CreateBundlePayload) => bundleApi.createBundle(data),
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ["bundles"] });
      toast.success("Bundle created successfully");
    },
    onError: (error: any) => {
      toast.error(error?.response?.data?.message || "Failed to create bundle");
    },
  });
};

export const useUpdateBundle = () => {
  const queryClient = useQueryClient();
  return useMutation({
    mutationFn: ({ id, data }: { id: string; data: CreateBundlePayload }) =>
      bundleApi.updateBundle(id, data),
    onSuccess: (_, variables) => {
      queryClient.invalidateQueries({ queryKey: ["bundles"] });
      queryClient.invalidateQueries({ queryKey: ["bundle", variables?.id] });
      toast.success("Bundle updated successfully");
    },
    onError: (error: any) => {
      toast.error(error?.response?.data?.message || "Failed to update bundle");
    },
  });
};

export const useDeleteBundle = () => {
  const queryClient = useQueryClient();
  return useMutation({
    mutationFn: (id: string) => bundleApi.deleteBundle(id),
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ["bundles"] });
      toast.success("Bundle deleted successfully");
    },
    onError: (error: any) => {
      toast.error(error?.response?.data?.message || "Failed to delete bundle");
    },
  });
};
