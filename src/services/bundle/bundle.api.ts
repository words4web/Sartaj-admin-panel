import axiosInstance from "@/lib/api/axios";
import { API_ROUTES } from "@/constants/api";
import { IBundle, CreateBundlePayload } from "@/types/bundle/bundle.types";

export const bundleApi = {
  getBundles: async (): Promise<IBundle[]> => {
    return await axiosInstance.get<any, IBundle[]>(API_ROUTES.BUNDLES.LIST);
  },

  getBundleById: async (id: string): Promise<IBundle> => {
    return await axiosInstance.get<any, IBundle>(API_ROUTES.BUNDLES.DETAIL(id));
  },

  createBundle: async (data: CreateBundlePayload): Promise<IBundle> => {
    return await axiosInstance.post<any, IBundle>(
      API_ROUTES.BUNDLES.CREATE,
      data,
    );
  },

  updateBundle: async (
    id: string,
    data: CreateBundlePayload,
  ): Promise<IBundle> => {
    return await axiosInstance.put<any, IBundle>(
      API_ROUTES.BUNDLES.UPDATE(id),
      data,
    );
  },

  deleteBundle: async (id: string): Promise<void> => {
    await axiosInstance.delete<any, void>(API_ROUTES.BUNDLES.DELETE(id));
  },
};
