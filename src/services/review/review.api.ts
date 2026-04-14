import axiosInstance from "@/lib/api/axios";
import { API_ROUTES } from "@/constants/api";
import {
  ReviewListResponse,
  ReviewListMeta,
  ReviewFilters,
  IReview,
} from "@/types/review/review.types";

export interface ReviewListResult {
  data: ReviewListResponse;
  meta: ReviewListMeta;
}

export const reviewApi = {
  getReviews: async (
    productId: string,
    filters?: ReviewFilters,
  ): Promise<ReviewListResult> => {
    const response = await axiosInstance.get<any, any>(
      API_ROUTES.REVIEWS.LIST(productId),
      {
        params: filters,
        _returnWrapper: true,
      } as any,
    );
    return {
      data: response?.data ?? {
        reviews: [],
        averageRating: 0,
        totalReviews: 0,
        ratingDistribution: { 1: 0, 2: 0, 3: 0, 4: 0, 5: 0 },
        product: null,
      },
      meta: {
        total: response?.meta?.total ?? 0,
        page: response?.meta?.page ?? 1,
        limit: response?.meta?.limit ?? 10,
      },
    };
  },

  toggleReviewStatus: async (reviewId: string): Promise<IReview> => {
    return await axiosInstance.patch<any, IReview>(
      API_ROUTES.REVIEWS.TOGGLE_STATUS(reviewId),
    );
  },
};
