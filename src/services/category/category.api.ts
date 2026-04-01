import axiosInstance from "@/lib/api/axios";
import { API_ROUTES } from "@/constants/api";
import {
  ICategory,
  CreateCategoryPayload,
  UpdateCategoryPayload,
  CategoryFilters,
} from "@/types/category/category.types";

interface CategoryListUnwrappedResponse {
  categories: ICategory[];
  total: number;
  page: number;
  limit: number;
}

const buildCategoryFormData = (
  data: Partial<CreateCategoryPayload>,
): FormData => {
  const formData = new FormData();
  if (data.name !== undefined) formData.append("name", data.name);
  if (data.description !== undefined)
    formData.append("description", data.description);
  if (data.isActive !== undefined)
    formData.append("isActive", String(data.isActive));
  if (data.image) {
    formData.append("image", data.image);
  }
  return formData;
};

export const categoryApi = {
  getCategories: async (filters?: CategoryFilters) => {
    const response = await axiosInstance.get<any, any>(
      API_ROUTES.CATEGORIES.LIST,
      {
        params: filters,
        _returnWrapper: true,
      } as any,
    );

    // When `_returnWrapper` is true the axios interceptor returns the backend wrapper:
    // { success, message, data, meta }
    return {
      categories: response?.data ?? [],
      total: response?.meta?.total ?? 0,
      page: response?.meta?.page ?? 1,
      limit: response?.meta?.limit ?? 10,
    } satisfies CategoryListUnwrappedResponse;
  },

  getCategoryById: async (id: string): Promise<ICategory> => {
    return await axiosInstance.get<any, ICategory>(
      API_ROUTES.CATEGORIES.DETAIL(id),
    );
  },

  getSubcategoriesByCategory: async (
    categoryId: string,
  ): Promise<ICategory[]> => {
    return await axiosInstance.get<any, ICategory[]>(
      API_ROUTES.CATEGORIES.SUBCATEGORIES(categoryId),
    );
  },

  createCategory: async (data: CreateCategoryPayload): Promise<ICategory> => {
    return await axiosInstance.post<any, ICategory>(
      API_ROUTES.CATEGORIES.CREATE,
      buildCategoryFormData(data),
      { headers: { "Content-Type": "multipart/form-data" } },
    );
  },

  updateCategory: async (
    id: string,
    data: UpdateCategoryPayload,
  ): Promise<ICategory> => {
    return await axiosInstance.put<any, ICategory>(
      API_ROUTES.CATEGORIES.UPDATE(id),
      buildCategoryFormData(data),
      { headers: { "Content-Type": "multipart/form-data" } },
    );
  },

  toggleStatus: async (id: string, isActive: boolean): Promise<ICategory> => {
    return await axiosInstance.patch<any, ICategory>(
      API_ROUTES.CATEGORIES.TOGGLE_STATUS(id),
      { isActive },
    );
  },

  deleteCategory: async (id: string): Promise<void> => {
    await axiosInstance.delete<any, void>(API_ROUTES.CATEGORIES.DELETE(id));
  },
};
