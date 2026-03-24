import { useQuery, useMutation, useQueryClient } from "@tanstack/react-query";
import { toast } from "sonner";
import axiosInstance from "@/lib/api/axios";
import { API_ENDPOINTS } from "@/lib/constants";
import {
  Customer,
  CreateCustomerPayload,
  UpdateCustomerPayload,
  CustomerListResponse,
  CustomerFilters,
} from "@/types/customer/customer.types";

export const customerService = {
  getCustomers: async (
    filters?: CustomerFilters,
  ): Promise<CustomerListResponse> => {
    const response = await axiosInstance.get<CustomerListResponse>(
      API_ENDPOINTS.CUSTOMERS.LIST,
      {
        params: filters,
      },
    );
    return response.data;
  },

  getCustomerById: async (id: string): Promise<Customer> => {
    const response = await axiosInstance.get<Customer>(
      API_ENDPOINTS.CUSTOMERS.GET(id),
    );
    return response.data;
  },

  createCustomer: async (data: CreateCustomerPayload): Promise<Customer> => {
    const response = await axiosInstance.post<Customer>(
      API_ENDPOINTS.CUSTOMERS.CREATE,
      data,
    );
    return response.data;
  },

  updateCustomer: async (
    id: string,
    data: UpdateCustomerPayload,
  ): Promise<Customer> => {
    const response = await axiosInstance.put<Customer>(
      API_ENDPOINTS.CUSTOMERS.UPDATE(id),
      data,
    );
    return response.data;
  },

  deleteCustomer: async (id: string): Promise<void> => {
    await axiosInstance.delete(API_ENDPOINTS.CUSTOMERS.DELETE(id));
  },

  // Batch operations
  deleteMultiple: async (ids: string[]): Promise<void> => {
    await axiosInstance.post("/customers/batch-delete", { ids });
  },

  updateStatus: async (
    id: string,
    status: "active" | "inactive" | "suspended",
  ): Promise<Customer> => {
    const response = await axiosInstance.patch<Customer>(
      API_ENDPOINTS.CUSTOMERS.UPDATE(id),
      { status },
    );
    return response.data;
  },
};

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
    queryFn: () => customerService.getCustomers(filters),
  });
};

export const useCustomer = (id: string) => {
  return useQuery({
    queryKey: customerKeys.detail(id),
    queryFn: () => customerService.getCustomerById(id),
    enabled: !!id,
  });
};

export const useCreateCustomer = () => {
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: customerService.createCustomer,
    onSuccess: () => {
      toast.success("Customer created successfully");
      queryClient.invalidateQueries({ queryKey: customerKeys.lists() });
    },
    onError: (error) => {
      toast.error("Failed to create customer");
      console.error(error);
    },
  });
};

export const useUpdateCustomer = () => {
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: ({ id, data }: { id: string; data: any }) =>
      customerService.updateCustomer(id, data),
    onSuccess: (_, variables) => {
      toast.success("Customer updated successfully");
      queryClient.invalidateQueries({ queryKey: customerKeys.lists() });
      queryClient.invalidateQueries({
        queryKey: customerKeys.detail(variables.id),
      });
    },
    onError: (error) => {
      toast.error("Failed to update customer");
      console.error(error);
    },
  });
};

export const useDeleteCustomer = () => {
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: customerService.deleteCustomer,
    onSuccess: () => {
      toast.success("Customer deleted successfully");
      queryClient.invalidateQueries({ queryKey: customerKeys.lists() });
    },
    onError: (error) => {
      toast.error("Failed to delete customer");
      console.error(error);
    },
  });
};
