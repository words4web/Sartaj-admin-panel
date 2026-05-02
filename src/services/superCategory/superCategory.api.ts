import axiosInstance from "@/lib/api/axios";
import { API_ROUTES } from "@/constants/api";
import { SuperCategory } from "@/types/customer/customer.types";

export const superCategoryApi = {
  getSuperCategories: async (): Promise<SuperCategory[]> => {
    return axiosInstance.get(API_ROUTES.SUPER_CATEGORIES.LIST);
  },
};
