import axiosInstance from "@/lib/api/axios";
import { API_ROUTES } from "@/constants/api";
import {
  CreatePriceListPayload,
  PriceList,
  PriceListFilters,
  PriceListListResponse,
  UpdatePriceListPayload,
} from "@/types/priceList/priceList.types";

export const priceListApi = {
  getPriceLists: async (
    filters?: PriceListFilters,
  ): Promise<PriceListListResponse> => {
    const response = await axiosInstance.get<any, any>(
      API_ROUTES.PRICE_LIST.LIST,
      {
        params: filters,
        _returnWrapper: true,
      } as any,
    );

    return {
      lists: response?.data ?? [],
      total: response?.meta?.total ?? 0,
      page: response?.meta?.page ?? 1,
      limit: response?.meta?.limit ?? 10,
    };
  },

  getPriceListById: async (id: string): Promise<PriceList> => {
    return axiosInstance.get<any, PriceList>(API_ROUTES.PRICE_LIST.DETAIL(id));
  },

  createPriceList: async (data: CreatePriceListPayload): Promise<PriceList> => {
    return axiosInstance.post<any, PriceList>(
      API_ROUTES.PRICE_LIST.CREATE,
      data,
    );
  },

  updatePriceList: async (
    id: string,
    data: UpdatePriceListPayload,
  ): Promise<PriceList> => {
    return axiosInstance.put<any, PriceList>(
      API_ROUTES.PRICE_LIST.UPDATE(id),
      data,
    );
  },

  deletePriceList: async (id: string): Promise<void> => {
    await axiosInstance.delete<any, void>(API_ROUTES.PRICE_LIST.DELETE(id));
  },
};
