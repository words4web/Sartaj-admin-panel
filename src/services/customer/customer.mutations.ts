import { useMutation, useQueryClient } from "@tanstack/react-query";
import { toast } from "sonner";
import { customerApi } from "./customer.api";
import { customerKeys } from "./customer.queries";
import {
  Customer,
  CreateCustomerPayload,
  UpdateCustomerPayload,
} from "@/types/customer/customer.types";

export const useCreateCustomer = () => {
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: (data: CreateCustomerPayload) =>
      customerApi.createCustomer(data),
    onSuccess: () => {
      toast.success("Customer created successfully");
      queryClient.invalidateQueries({ queryKey: customerKeys.lists() });
    },
    onError: (error: any) => {
      toast.error(error?.message || "Failed to create customer");
    },
  });
};

export const useUpdateCustomer = () => {
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: ({ id, data }: { id: string; data: UpdateCustomerPayload }) =>
      customerApi.updateCustomer(id, data),
    onSuccess: (_, variables) => {
      toast.success("Customer updated successfully");
      queryClient.invalidateQueries({ queryKey: customerKeys.lists() });
      queryClient.invalidateQueries({
        queryKey: customerKeys.detail(variables.id),
      });
    },
    onError: (error: any) => {
      toast.error(error?.message || "Failed to update customer");
    },
  });
};

export const useDeleteCustomer = () => {
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: (id: string) => customerApi.deleteCustomer(id),
    onSuccess: () => {
      toast.success("Customer deleted successfully");
      queryClient.invalidateQueries({ queryKey: customerKeys.lists() });
    },
    onError: (error: any) => {
      toast.error(error?.message || "Failed to delete customer");
    },
  });
};

export const useUpdateCustomerStatus = () => {
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: ({ id, status }: { id: string; status: Customer["status"] }) =>
      customerApi.updateStatus(id, status),
    onSuccess: (_, variables) => {
      toast.success("Status updated successfully");
      queryClient.invalidateQueries({ queryKey: customerKeys.lists() });
      queryClient.invalidateQueries({
        queryKey: customerKeys.detail(variables.id),
      });
    },
    onError: (error: any) => {
      toast.error(error?.message || "Failed to update status");
    },
  });
};
