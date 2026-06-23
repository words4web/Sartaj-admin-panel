import { useMutation, useQueryClient } from "@tanstack/react-query";
import { toast } from "sonner";
import { orderApi } from "./order.api";
import { orderKeys } from "./order.queries";
import {
  UpdateOrderTrackingPayload,
  UpdateOrderStatusPayload,
} from "@/types/order/order.types";

export const useUpdateOrderStatus = () => {
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: ({
      id,
      data,
    }: {
      id: string;
      data: UpdateOrderStatusPayload;
    }) => orderApi.updateOrderStatus(id, data),
    onSuccess: (_, variables) => {
      toast.success("Order status updated successfully");
      queryClient.invalidateQueries({ queryKey: orderKeys.lists() });
      queryClient.invalidateQueries({
        queryKey: orderKeys.detail(variables.id),
      });
    },
    onError: (error: any) => {
      toast.error(error?.message || "Failed to update order status");
    },
  });
};

export const useUpdateOrderTracking = () => {
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: ({
      id,
      data,
    }: {
      id: string;
      data: UpdateOrderTrackingPayload;
    }) => orderApi.updateOrderTracking(id, data),
    onSuccess: (_, variables) => {
      toast.success("Tracking number updated successfully");
      queryClient.invalidateQueries({
        queryKey: orderKeys.detail(variables.id),
      });
    },
    onError: (error: any) => {
      toast.error(error?.message || "Failed to update tracking number");
    },
  });
};

export const useUpdateOrderDeliveryTerms = () => {
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: ({
      id,
      data,
    }: {
      id: string;
      data: { deliveryTerms: string | null };
    }) => orderApi.updateOrderDeliveryTerms(id, data),
    onSuccess: (_, variables) => {
      toast.success(
        "Delivery terms updated successfully. Invoice is regenerating in background.",
      );
      queryClient.invalidateQueries({
        queryKey: orderKeys.detail(variables?.id),
      });

      setTimeout(() => {
        queryClient.invalidateQueries({
          queryKey: orderKeys.detail(variables?.id),
        });
      }, 10000);
    },
    onError: (error: any) => {
      toast.error(error?.message || "Failed to update delivery terms");
    },
  });
};
