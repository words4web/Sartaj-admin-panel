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

export const useValidateOrderEdit = () => {
  return useMutation({
    mutationFn: ({
      id,
      data,
    }: {
      id: string;
      data: {
        items: { productId: string; quantity: number }[];
        couponCode?: string | null;
      };
    }) => orderApi.validateOrderEdit(id, data),
    onError: (error: any) => {
      toast.error(error?.message || "Failed to validate order edit");
    },
  });
};

export const useEditOrderItems = () => {
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: ({
      id,
      data,
    }: {
      id: string;
      data: {
        items: { productId: string; quantity: number }[];
        couponCode?: string | null;
      };
    }) => orderApi.editOrderItems(id, data),
    onSuccess: (_, variables) => {
      toast.success(
        "Order items updated successfully. Invoice is regenerating in background.",
      );
      queryClient.invalidateQueries({ queryKey: orderKeys.lists() });
      queryClient.invalidateQueries({
        queryKey: orderKeys.detail(variables.id),
      });
      // Invalidate detail page again after a short delay since PDF regeneration runs in the background
      setTimeout(() => {
        queryClient.invalidateQueries({
          queryKey: orderKeys.detail(variables.id),
        });
      }, 5000);
    },
    onError: (error: any) => {
      toast.error(error?.message || "Failed to update order items");
    },
  });
};
