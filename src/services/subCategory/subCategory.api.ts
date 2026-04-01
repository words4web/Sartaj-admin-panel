import axiosInstance from "@/lib/api/axios";
import { API_ROUTES } from "@/constants/api";
import {
  ISubCategory,
  CreateSubCategoryPayload,
  UpdateSubCategoryPayload,
  SubCategoryFilters,
} from "@/types/subCategory/subCategory.types";

interface SubCategoryListUnwrappedResponse {
  subCategories: ISubCategory[];
  total: number;
  page: number;
  limit: number;
}

export const subCategoryApi = {
  getSubCategories: async (filters?: SubCategoryFilters) => {
    const response = await axiosInstance.get<any, any>(
      API_ROUTES.SUBCATEGORIES.LIST,
      { params: filters, _returnWrapper: true } as any,
    );

    return {
      subCategories: response?.data ?? [],
      total: response?.meta?.total ?? 0,
      page: response?.meta?.page ?? 1,
      limit: response?.meta?.limit ?? 10,
    } satisfies SubCategoryListUnwrappedResponse;
  },

  getSubCategoryById: async (id: string): Promise<ISubCategory> => {
    return await axiosInstance.get<any, ISubCategory>(
      API_ROUTES.SUBCATEGORIES.DETAIL(id),
    );
  },

  createSubCategory: async (
    data: CreateSubCategoryPayload,
  ): Promise<ISubCategory> => {
    return await axiosInstance.post<any, ISubCategory>(
      API_ROUTES.SUBCATEGORIES.CREATE,
      data,
    );
  },

  updateSubCategory: async (
    id: string,
    data: UpdateSubCategoryPayload,
  ): Promise<ISubCategory> => {
    return await axiosInstance.put<any, ISubCategory>(
      API_ROUTES.SUBCATEGORIES.UPDATE(id),
      data,
    );
  },

  toggleStatus: async (
    id: string,
    isActive: boolean,
  ): Promise<ISubCategory> => {
    return await axiosInstance.patch<any, ISubCategory>(
      API_ROUTES.SUBCATEGORIES.TOGGLE_STATUS(id),
      { isActive },
    );
  },

  deleteSubCategory: async (id: string): Promise<void> => {
    await axiosInstance.delete<any, void>(API_ROUTES.SUBCATEGORIES.DELETE(id));
  },
};
