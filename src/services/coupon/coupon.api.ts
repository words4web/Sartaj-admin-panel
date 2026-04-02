import axiosInstance from "@/lib/api/axios";
import { API_ROUTES } from "@/constants/api";
import {
  ICoupon,
  CreateCouponPayload,
  UpdateCouponPayload,
  CouponFilters,
} from "@/types/coupon/coupon.types";

interface CouponListUnwrappedResponse {
  coupons: ICoupon[];
  total: number;
  page: number;
  limit: number;
}

export const couponApi = {
  getCoupons: async (filters?: CouponFilters) => {
    const response = await axiosInstance.get<any, any>(
      API_ROUTES.COUPONS.LIST,
      {
        params: filters,
        _returnWrapper: true,
      } as any,
    );

    return {
      coupons: response?.data?.coupons ?? [],
      total: response?.data?.total ?? 0,
      page: response?.data?.page ?? 1,
      limit: response?.data?.limit ?? 10,
    } satisfies CouponListUnwrappedResponse;
  },

  getCouponById: async (id: string): Promise<ICoupon> => {
    return await axiosInstance.get<any, ICoupon>(
      API_ROUTES.COUPONS.DETAIL(id),
    );
  },

  createCoupon: async (data: CreateCouponPayload): Promise<ICoupon> => {
    return await axiosInstance.post<any, ICoupon>(
      API_ROUTES.COUPONS.CREATE,
      data,
    );
  },

  updateCoupon: async (
    id: string,
    data: UpdateCouponPayload,
  ): Promise<ICoupon> => {
    return await axiosInstance.put<any, ICoupon>(
      API_ROUTES.COUPONS.UPDATE(id),
      data,
    );
  },

  toggleStatus: async (id: string, isActive: boolean): Promise<ICoupon> => {
    return await axiosInstance.patch<any, ICoupon>(
      API_ROUTES.COUPONS.TOGGLE_STATUS(id),
      { isActive },
    );
  },

  deleteCoupon: async (id: string): Promise<void> => {
    await axiosInstance.delete<any, void>(API_ROUTES.COUPONS.DELETE(id));
  },
};
