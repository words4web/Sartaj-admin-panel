import { API_ROUTES } from "@/constants/api";
import axiosInstance from "@/lib/api/axios";

export enum TAX_CATEGORY {
  REDUCED = "REDUCED", // e.g. food (8%)
  STANDARD = "STANDARD", // e.g. alcohol, non-food (10%)
  CUSTOM = "CUSTOM", // edge-case override
}

export enum TAX_TYPE {
  PERCENTAGE = "PERCENTAGE",
  FIXED = "FIXED",
}

export interface ITaxConfig {
  category: TAX_CATEGORY;
  value: number;
}

export interface IWalletConfig {
  rewardPercentage: number;
}

export interface IAppConfig {
  wallet?: IWalletConfig;
  minOrderValues: {
    superCategoryId: string | any;
    superCategoryName: string;
    value: number;
    penaltyCharge: number;
  }[];
  shippingRules: {
    frozen: {
      weightThreshold: number;
      fee: number;
    };
  };
  specialAreas: {
    name: string;
    fee: number;
  }[];
  taxes: ITaxConfig[];
}

export const appConfigService = {
  getConfig: async (): Promise<IAppConfig> => {
    return axiosInstance.get(API_ROUTES.APP_CONFIG.GET);
  },

  updateConfig: async (data: Partial<IAppConfig>): Promise<IAppConfig> => {
    return axiosInstance.patch(API_ROUTES.APP_CONFIG.UPDATE, data);
  },
};
