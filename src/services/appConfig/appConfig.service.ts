import { API_ROUTES } from "@/constants/api";
import axiosInstance from "@/lib/api/axios";

export interface IAppConfig {
  minOrderValues: {
    superCategoryId: string | any;
    superCategoryName: string;
    value: number;
  }[];
  halalMinOrderValue: number;
  shippingRules: {
    frozen: {
      weightThreshold: number;
      fee: number;
    };
    dry: {
      threshold: number;
      fee: number;
    };
  };
  specialAreas: {
    name: string;
    fee: number;
  }[];
}

export const appConfigService = {
  getConfig: async (): Promise<IAppConfig> => {
    return axiosInstance.get(API_ROUTES.APP_CONFIG.GET);
  },

  updateConfig: async (data: Partial<IAppConfig>): Promise<IAppConfig> => {
    return axiosInstance.patch(API_ROUTES.APP_CONFIG.UPDATE, data);
  },
};
