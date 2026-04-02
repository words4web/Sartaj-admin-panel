import { useMutation, useQuery, useQueryClient } from "@tanstack/react-query";
import { couponApi } from "./coupon.api";
import { CouponFilters, CreateCouponPayload, UpdateCouponPayload } from "@/types/coupon/coupon.types";
import { toast } from "sonner";

export const COUPON_KEYS = {
  all: ["coupons"] as const,
  lists: () => [...COUPON_KEYS.all, "list"] as const,
  list: (filters: CouponFilters) => [...COUPON_KEYS.lists(), filters] as const,
  details: () => [...COUPON_KEYS.all, "detail"] as const,
  detail: (id: string) => [...COUPON_KEYS.details(), id] as const,
};

export const useCoupons = (filters: CouponFilters = {}) => {
  return useQuery({
    queryKey: COUPON_KEYS.list(filters),
    queryFn: () => couponApi.getCoupons(filters),
  });
};

export const useCoupon = (id: string) => {
  return useQuery({
    queryKey: COUPON_KEYS.detail(id),
    queryFn: () => couponApi.getCouponById(id),
    enabled: !!id,
  });
};

export const useCreateCoupon = () => {
  const queryClient = useQueryClient();
  return useMutation({
    mutationFn: (data: CreateCouponPayload) => couponApi.createCoupon(data),
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: COUPON_KEYS.lists() });
      toast.success("Coupon created successfully");
    },
    onError: (error: any) => {
      toast.error(error?.response?.data?.message || "Failed to create coupon");
    },
  });
};

export const useUpdateCoupon = () => {
  const queryClient = useQueryClient();
  return useMutation({
    mutationFn: ({ id, data }: { id: string; data: UpdateCouponPayload }) =>
      couponApi.updateCoupon(id, data),
    onSuccess: (_, { id }) => {
      queryClient.invalidateQueries({ queryKey: COUPON_KEYS.lists() });
      queryClient.invalidateQueries({ queryKey: COUPON_KEYS.detail(id) });
      toast.success("Coupon updated successfully");
    },
    onError: (error: any) => {
      toast.error(error?.response?.data?.message || "Failed to update coupon");
    },
  });
};

export const useToggleCouponStatus = () => {
  const queryClient = useQueryClient();
  return useMutation({
    mutationFn: ({ id, isActive }: { id: string; isActive: boolean }) =>
      couponApi.toggleStatus(id, isActive),
    onSuccess: (_, { id }) => {
      queryClient.invalidateQueries({ queryKey: COUPON_KEYS.lists() });
      queryClient.invalidateQueries({ queryKey: COUPON_KEYS.detail(id) });
      toast.success("Status updated successfully");
    },
    onError: (error: any) => {
      toast.error(error?.response?.data?.message || "Failed to update status");
    },
  });
};

export const useDeleteCoupon = () => {
  const queryClient = useQueryClient();
  return useMutation({
    mutationFn: (id: string) => couponApi.deleteCoupon(id),
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: COUPON_KEYS.lists() });
      toast.success("Coupon deleted successfully");
    },
    onError: (error: any) => {
      toast.error(error?.response?.data?.message || "Failed to delete coupon");
    },
  });
};
