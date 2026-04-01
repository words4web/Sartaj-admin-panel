import { useMutation, useQuery, useQueryClient } from "@tanstack/react-query";
import { manufacturerApi } from "./manufacturer.api";
import { ManufacturerFilters, CreateManufacturerPayload, UpdateManufacturerPayload } from "@/types/manufacturer/manufacturer.types";
import { toast } from "sonner";

export const MANUFACTURER_KEYS = {
  all: ["manufacturers"] as const,
  lists: () => [...MANUFACTURER_KEYS.all, "list"] as const,
  list: (filters: ManufacturerFilters) => [...MANUFACTURER_KEYS.lists(), filters] as const,
  details: () => [...MANUFACTURER_KEYS.all, "detail"] as const,
  detail: (id: string) => [...MANUFACTURER_KEYS.details(), id] as const,
};

export const useManufacturerList = (filters: ManufacturerFilters = {}) => {
  return useQuery({
    queryKey: MANUFACTURER_KEYS.list(filters),
    queryFn: () => manufacturerApi.getManufacturers(filters),
  });
};

export const useManufacturer = (id: string) => {
  return useQuery({
    queryKey: MANUFACTURER_KEYS.detail(id),
    queryFn: () => manufacturerApi.getManufacturerById(id),
    enabled: !!id,
  });
};

export const useCreateManufacturer = () => {
  const queryClient = useQueryClient();
  return useMutation({
    mutationFn: (data: CreateManufacturerPayload) => manufacturerApi.createManufacturer(data),
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: MANUFACTURER_KEYS.lists() });
      toast.success("Manufacturer created successfully");
    },
    onError: (error: any) => {
      toast.error(error?.response?.data?.message || "Failed to create manufacturer");
    },
  });
};

export const useUpdateManufacturer = () => {
  const queryClient = useQueryClient();
  return useMutation({
    mutationFn: ({ id, data }: { id: string; data: UpdateManufacturerPayload }) =>
      manufacturerApi.updateManufacturer(id, data),
    onSuccess: (_, { id }) => {
      queryClient.invalidateQueries({ queryKey: MANUFACTURER_KEYS.lists() });
      queryClient.invalidateQueries({ queryKey: MANUFACTURER_KEYS.detail(id) });
      toast.success("Manufacturer updated successfully");
    },
    onError: (error: any) => {
      toast.error(error?.response?.data?.message || "Failed to update manufacturer");
    },
  });
};

export const useDeleteManufacturer = () => {
  const queryClient = useQueryClient();
  return useMutation({
    mutationFn: (id: string) => manufacturerApi.deleteManufacturer(id),
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: MANUFACTURER_KEYS.lists() });
      toast.success("Manufacturer deleted successfully");
    },
    onError: (error: any) => {
      toast.error(error?.response?.data?.message || "Failed to delete manufacturer");
    },
  });
};
