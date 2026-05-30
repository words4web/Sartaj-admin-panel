import { useQuery } from "@tanstack/react-query";
import { customerApi } from "./customer.api";
import { CustomerFilters } from "@/types/customer/customer.types";

export const customerKeys = {
  all: ["customers"] as const,
  lists: () => [...customerKeys.all, "list"] as const,
  list: (filters: CustomerFilters) =>
    [...customerKeys.lists(), { filters }] as const,
  details: () => [...customerKeys.all, "detail"] as const,
  detail: (id: string) => [...customerKeys.details(), id] as const,
  wallet: (id: string, page: number, limit: number) =>
    [...customerKeys.all, "wallet", id, { page, limit }] as const,
};

export const useCustomers = (filters?: CustomerFilters) => {
  return useQuery({
    queryKey: customerKeys.list(filters || {}),
    queryFn: () => customerApi.getCustomers(filters),
  });
};

export const useCustomer = (id: string) => {
  return useQuery({
    queryKey: customerKeys.detail(id),
    queryFn: () => customerApi.getCustomerById(id),
    enabled: !!id,
  });
};

export const useCustomerWallet = (id: string, page: number, limit: number) => {
  return useQuery({
    queryKey: customerKeys.wallet(id, page, limit),
    queryFn: () => customerApi.getCustomerWallet(id, { page, limit }),
    enabled: !!id,
  });
};
