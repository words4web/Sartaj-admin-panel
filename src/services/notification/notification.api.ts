import axiosInstance from "@/lib/api/axios";
import { API_ROUTES } from "@/constants/api";

import { NotificationListResponse } from "@/types/notification.types";

export const notificationService = {
  getNotifications: async (params: {
    page: number;
    limit: number;
  }): Promise<NotificationListResponse> => {
    return axiosInstance.get(API_ROUTES.NOTIFICATIONS.LIST, {
      params,
      ...({ _returnWrapper: true } as any),
    });
  },

  markAsRead: async (id: string): Promise<any> => {
    return axiosInstance.patch(API_ROUTES.NOTIFICATIONS.READ(id));
  },

  markAllAsRead: async (): Promise<any> => {
    return axiosInstance.patch(API_ROUTES.NOTIFICATIONS.READ_ALL);
  },
};
