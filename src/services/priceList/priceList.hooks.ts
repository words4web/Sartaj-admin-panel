import { useMutation, useQuery, useQueryClient } from "@tanstack/react-query";
import { toast } from "sonner";
import { priceListApi } from "./priceList.api";
import {
  CreatePriceListPayload,
  PriceListFilters,
  UpdatePriceListPayload,
} from "@/types/priceList/priceList.types";

export const PRICE_LIST_KEYS = {
  all: ["priceLists"] as const,
  lists: () => [...PRICE_LIST_KEYS.all, "list"] as const,
  list: (filters: PriceListFilters) =>
    [...PRICE_LIST_KEYS.lists(), filters] as const,
  details: () => [...PRICE_LIST_KEYS.all, "detail"] as const,
  detail: (id: string) => [...PRICE_LIST_KEYS.details(), id] as const,
};

export const usePriceLists = (
  filters: PriceListFilters = {},
  options?: { enabled?: boolean },
) => {
  return useQuery({
    queryKey: PRICE_LIST_KEYS.list(filters),
    queryFn: () => priceListApi.getPriceLists(filters),
    enabled: options?.enabled !== false,
  });
};

export const usePriceList = (id: string) => {
  return useQuery({
    queryKey: PRICE_LIST_KEYS.detail(id),
    queryFn: () => priceListApi.getPriceListById(id),
    enabled: !!id,
  });
};

export const useCreatePriceList = () => {
  const queryClient = useQueryClient();
  return useMutation({
    mutationFn: (data: CreatePriceListPayload) =>
      priceListApi.createPriceList(data),
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: PRICE_LIST_KEYS.lists() });
      toast.success("Price list created successfully");
    },
    onError: (error: any) => {
      toast.error(
        error?.response?.data?.message || "Failed to create price list",
      );
    },
  });
};

export const useUpdatePriceList = () => {
  const queryClient = useQueryClient();
  return useMutation({
    mutationFn: ({ id, data }: { id: string; data: UpdatePriceListPayload }) =>
      priceListApi.updatePriceList(id, data),
    onSuccess: (_, { id }) => {
      queryClient.invalidateQueries({ queryKey: PRICE_LIST_KEYS.lists() });
      queryClient.invalidateQueries({ queryKey: PRICE_LIST_KEYS.detail(id) });
      toast.success("Price list updated successfully");
    },
    onError: (error: any) => {
      toast.error(
        error?.response?.data?.message || "Failed to update price list",
      );
    },
  });
};

export const useDeletePriceList = () => {
  const queryClient = useQueryClient();
  return useMutation({
    mutationFn: (id: string) => priceListApi.deletePriceList(id),
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: PRICE_LIST_KEYS.lists() });
      toast.success("Price list removed and unassigned from customers");
    },
    onError: (error: any) => {
      toast.error(
        error?.response?.data?.message || "Failed to delete price list",
      );
    },
  });
};
