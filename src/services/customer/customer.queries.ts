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
