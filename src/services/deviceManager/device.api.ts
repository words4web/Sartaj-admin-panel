import axiosInstance from "@/lib/api/axios";
import { API_ROUTES } from "@/constants/api";
import { SyncDevicePayload } from "@/types/device/device.types";

export const deviceApi = {
  syncToken: async (params: SyncDevicePayload): Promise<void> => {
    return axiosInstance.post(API_ROUTES.NOTIFICATIONS.DEVICES.SYNC, {
      language: "en",
      ...params,
    });
  },

  removeToken: async (fcmToken: string): Promise<void> => {
    return axiosInstance.post(API_ROUTES.NOTIFICATIONS.DEVICES.REMOVE, {
      fcmToken,
    });
  },
};
