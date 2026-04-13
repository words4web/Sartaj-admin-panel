import axiosInstance from "@/lib/api/axios";
import { API_ROUTES } from "@/constants/api";
import {
  IProduct,
  ProductFilters,
  ProductListResponse,
  CreateProductPayload,
  UpdateProductPayload,
} from "@/types/product/product.types";
import axios from "axios";

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
      data,
    );
  },

  updateProduct: async (
    id: string,
    data: UpdateProductPayload,
  ): Promise<IProduct> => {
    return await axiosInstance.put<any, IProduct>(
      API_ROUTES.PRODUCTS.UPDATE(id),
      data,
    );
  },

  getUploadUrls: async (
    files: { originalName: string; contentType: string; size: number }[],
  ): Promise<{
    sessionId: string;
    files: { key: string; uploadUrl: string }[];
  }> => {
    return await axiosInstance.post(API_ROUTES.UPLOAD.GET_URLS, { files });
  },

  confirmUploads: async (
    sessionId: string,
    keys: string[],
  ): Promise<{ images: string[] }> => {
    return await axiosInstance.post(API_ROUTES.UPLOAD.CONFIRM, {
      sessionId,
      keys,
    });
  },

  uploadToS3: async (
    url: string,
    file: File,
    onProgress?: (progress: number) => void,
  ): Promise<void> => {
    await axios.put(url, file, {
      headers: { "Content-Type": file.type },
      onUploadProgress: (progressEvent) => {
        if (onProgress && progressEvent?.total) {
          onProgress(
            Math.round((progressEvent?.loaded * 100) / progressEvent?.total),
          );
        }
      },
    });
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
