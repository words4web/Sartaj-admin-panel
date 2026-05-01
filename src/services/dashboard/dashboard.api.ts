import axiosInstance from "@/lib/api/axios";
import { API_ROUTES } from "@/constants/api";
import { DashboardStats } from "@/types/dashboard.types";

export const dashboardService = {
  getStats: async (): Promise<DashboardStats> => {
    return axiosInstance.get(API_ROUTES.DASHBOARD.STATS);
  },
};
