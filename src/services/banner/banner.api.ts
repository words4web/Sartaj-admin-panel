import axiosInstance from "@/lib/api/axios";
import { API_ROUTES } from "@/constants/api";
import {
  IBanner,
  CreateBannerPayload,
  UpdateBannerPayload,
  BannerFilters,
} from "@/types/banner/banner.types";

interface BannerListUnwrappedResponse {
  banners: IBanner[];
  total: number;
  page: number;
  limit: number;
}

const buildBannerFormData = (
  data: Partial<CreateBannerPayload>,
): FormData => {
  const formData = new FormData();
  if (data.title !== undefined) formData.append("title", data.title);
  if (data.link !== undefined) formData.append("link", data.link);
  if (data.isActive !== undefined)
    formData.append("isActive", String(data.isActive));
  if (data.image) {
    formData.append("image", data.image);
  }
  return formData;
};

export const bannerApi = {
  getBanners: async (filters?: BannerFilters) => {
    const response = await axiosInstance.get<any, any>(
      API_ROUTES.BANNERS.LIST,
      {
        params: filters,
        _returnWrapper: true,
      } as any,
    );

    return {
      banners: response?.data ?? [],
      total: response?.meta?.total ?? 0,
      page: response?.meta?.page ?? 1,
      limit: response?.meta?.limit ?? 10,
    } satisfies BannerListUnwrappedResponse;
  },

  getBannerById: async (id: string): Promise<IBanner> => {
    return await axiosInstance.get<any, IBanner>(
      API_ROUTES.BANNERS.DETAIL(id),
    );
  },

  createBanner: async (data: CreateBannerPayload): Promise<IBanner> => {
    return await axiosInstance.post<any, IBanner>(
      API_ROUTES.BANNERS.CREATE,
      buildBannerFormData(data),
      { headers: { "Content-Type": "multipart/form-data" } },
    );
  },

  updateBanner: async (
    id: string,
    data: UpdateBannerPayload,
  ): Promise<IBanner> => {
    return await axiosInstance.put<any, IBanner>(
      API_ROUTES.BANNERS.UPDATE(id),
      buildBannerFormData(data),
      { headers: { "Content-Type": "multipart/form-data" } },
    );
  },

  toggleStatus: async (id: string, isActive: boolean): Promise<IBanner> => {
    return await axiosInstance.patch<any, IBanner>(
      API_ROUTES.BANNERS.TOGGLE_STATUS(id),
      { isActive },
    );
  },

  deleteBanner: async (id: string): Promise<void> => {
    await axiosInstance.delete<any, void>(API_ROUTES.BANNERS.DELETE(id));
  },
};
