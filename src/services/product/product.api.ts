import axiosInstance from "@/lib/api/axios";
import { API_ROUTES } from "@/constants/api";
import {
  IProduct,
  ProductFilters,
  ProductListResponse,
  CreateProductPayload,
  UpdateProductPayload,
} from "@/types/product/product.types";
import { buildProductFormData } from "@/utils/product.util";

export const productApi = {
  getProducts: async (
    filters?: ProductFilters,
  ): Promise<ProductListResponse> => {
    const response = await axiosInstance.get<any, any>(
      API_ROUTES.PRODUCTS.LIST,
      {
        params: filters,
        _returnWrapper: true,
      } as any,
    );
    return {
      products: response?.data ?? [],
      total: response?.meta?.total ?? 0,
      page: response?.meta?.page ?? 1,
      limit: response?.meta?.limit ?? 10,
    };
  },

  getProductById: async (id: string): Promise<IProduct> => {
    return await axiosInstance.get<any, IProduct>(
      API_ROUTES.PRODUCTS.DETAIL(id),
    );
  },

  createProduct: async (data: CreateProductPayload): Promise<IProduct> => {
    return await axiosInstance.post<any, IProduct>(
      API_ROUTES.PRODUCTS.CREATE,
      buildProductFormData(data),
      { headers: { "Content-Type": "multipart/form-data" } },
    );
  },

  updateProduct: async (
    id: string,
    data: UpdateProductPayload,
  ): Promise<IProduct> => {
    return await axiosInstance.put<any, IProduct>(
      API_ROUTES.PRODUCTS.UPDATE(id),
      buildProductFormData(data),
      { headers: { "Content-Type": "multipart/form-data" } },
    );
  },

  deleteProduct: async (id: string): Promise<void> => {
    await axiosInstance.delete(API_ROUTES.PRODUCTS.DELETE(id));
  },

  toggleProductStatus: async (id: string): Promise<IProduct> => {
    return await axiosInstance.patch<any, IProduct>(
      API_ROUTES.PRODUCTS.TOGGLE_STATUS(id),
    );
  },
};
