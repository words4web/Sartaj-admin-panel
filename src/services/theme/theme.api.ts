import axiosInstance from "@/lib/api/axios";
import { API_ROUTES } from "@/constants/api";
import { ITheme } from "@/types/theme/theme.types";

export const themeApi = {
  getAllThemes: async (): Promise<ITheme[]> => {
    return await axiosInstance.get<any, ITheme[]>(API_ROUTES.THEME.LIST);
  },

  getActiveTheme: async (): Promise<ITheme> => {
    return await axiosInstance.get<any, ITheme>(API_ROUTES.THEME.ACTIVE);
  },

  setActiveTheme: async (name: string): Promise<ITheme> => {
    return await axiosInstance.patch<any, ITheme>(
      API_ROUTES.THEME.ACTIVATE(name),
    );
  },
};
