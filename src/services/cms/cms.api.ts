import axiosInstance from "@/lib/api/axios";
import { API_ROUTES } from "@/constants/api";
import {
  ICMS,
  CreateCMSPayload,
  UpdateCMSPayload,
  CMSFilters,
} from "@/types/cms/cms.types";

export const cmsApi = {
  getCmsList: async (filters?: CMSFilters) => {
    // Need pagination meta, so request the full backend wrapper.
    const response = await axiosInstance.get<any, any>(API_ROUTES.CMS.LIST, {
      params: filters,
      _returnWrapper: true,
    } as any);

    return {
      cms: response?.data ?? [],
      total: response?.meta?.total ?? 0,
      page: response?.meta?.page ?? 1,
      limit: response?.meta?.limit ?? 10,
    };
  },

  getCmsById: async (id: string): Promise<ICMS> => {
    return await axiosInstance.get<any, ICMS>(API_ROUTES.CMS.DETAIL(id));
  },

  createCms: async (data: CreateCMSPayload): Promise<ICMS> => {
    return await axiosInstance.post<any, ICMS>(API_ROUTES.CMS.CREATE, data);
  },

  updateCms: async (id: string, data: UpdateCMSPayload): Promise<ICMS> => {
    return await axiosInstance.put<any, ICMS>(API_ROUTES.CMS.UPDATE(id), data);
  },

  deleteCms: async (id: string): Promise<void> => {
    await axiosInstance.delete<any, void>(API_ROUTES.CMS.DELETE(id));
  },
};
