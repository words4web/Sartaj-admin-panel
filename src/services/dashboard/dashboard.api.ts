import axiosInstance from "@/lib/api/axios";
import { API_ROUTES } from "@/constants/api";
import { DashboardStats } from "@/types/dashboard.types";

export const dashboardService = {
  getStats: async (params?: {
    from?: string;
    to?: string;
  }): Promise<DashboardStats> => {
    return axiosInstance.get(API_ROUTES.DASHBOARD.STATS, { params });
  },
};
