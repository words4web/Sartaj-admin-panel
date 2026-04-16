import { useQuery } from "@tanstack/react-query";
import { orderApi } from "./order.api";
import { OrderFilters } from "@/types/order/order.types";

export const orderKeys = {
  all: ["orders"] as const,
  lists: () => [...orderKeys.all, "list"] as const,
  list: (filters: OrderFilters) => [...orderKeys.lists(), { filters }] as const,
  details: () => [...orderKeys.all, "detail"] as const,
  detail: (id: string) => [...orderKeys.details(), id] as const,
};

export const useOrders = (filters?: OrderFilters) => {
  return useQuery({
    queryKey: orderKeys.list(filters || {}),
    queryFn: () => orderApi.getOrders(filters),
  });
};

export const useOrder = (id: string) => {
  return useQuery({
    queryKey: orderKeys.detail(id),
    queryFn: () => orderApi.getOrderById(id),
    enabled: !!id,
  });
};
