import { useMutation, useQuery, useQueryClient } from "@tanstack/react-query";
import { reviewApi } from "./review.api";
import { ReviewFilters } from "@/types/review/review.types";
import { toast } from "sonner";

export const REVIEW_KEYS = {
  all: ["reviews"] as const,
  lists: () => [...REVIEW_KEYS.all, "list"] as const,
  list: (productId: string, filters: ReviewFilters) =>
    [...REVIEW_KEYS.lists(), productId, filters] as const,
};

export const useReviewList = (productId: string, filters: ReviewFilters = {}) => {
  return useQuery({
    queryKey: REVIEW_KEYS.list(productId, filters),
    queryFn: () => reviewApi.getReviews(productId, filters),
    enabled: !!productId,
  });
};

export const useToggleReviewStatus = (productId: string) => {
  const queryClient = useQueryClient();
  return useMutation({
    mutationFn: (reviewId: string) => reviewApi.toggleReviewStatus(reviewId),
    onSuccess: (updated) => {
      // Invalidate all pages for this product
      queryClient.invalidateQueries({ queryKey: REVIEW_KEYS.lists() });
      toast.success(
        `Review ${(updated as any)?.isActive ? "enabled" : "disabled"} successfully`,
      );
    },
    onError: (error: any) => {
      toast.error(
        error?.response?.data?.message || "Failed to update review status",
      );
    },
  });
};
