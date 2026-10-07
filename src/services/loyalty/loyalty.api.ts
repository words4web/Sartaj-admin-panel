import axiosInstance from "@/lib/api/axios";
import { API_ROUTES } from "@/constants/api";
import {
  LoyaltyMembersListResponse,
  LoyaltyMembersQueryParams,
} from "@/types/loyalty/loyalty.types";

export const loyaltyApi = {
  getMembers: async (
    params?: LoyaltyMembersQueryParams,
  ): Promise<LoyaltyMembersListResponse> => {
    const response = await axiosInstance.get<any, any>(
      API_ROUTES.LOYALTY.MEMBERS,
      {
        params,
      },
    );

    return {
      members: response?.members ?? [],
      total: response?.total ?? 0,
      page: response?.page ?? 1,
      limit: response?.limit ?? 20,
      totalPages: response?.totalPages ?? 0,
    };
  },

  markHamperSent: async (id: string): Promise<any> => {
    return await axiosInstance.patch(API_ROUTES.LOYALTY.UPDATE_HAMPER(id));
  },

  getCustomerLoyalty: async (customerId: string): Promise<any> => {
    const response = await axiosInstance.get(
      API_ROUTES.LOYALTY.CUSTOMER_LOYALTY(customerId),
    );
    return response?.data ?? response;
  },
};
