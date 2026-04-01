import axiosInstance from "@/lib/api/axios";
import { API_ROUTES } from "@/constants/api";
import {
  IManufacturer,
  CreateManufacturerPayload,
  UpdateManufacturerPayload,
  ManufacturerFilters,
} from "@/types/manufacturer/manufacturer.types";

interface ManufacturerListUnwrappedResponse {
  manufacturers: IManufacturer[];
  total: number;
  page: number;
  limit: number;
}

const buildManufacturerFormData = (
  data: Partial<CreateManufacturerPayload>,
): FormData => {
  const formData = new FormData();
  if (data.name !== undefined) formData.append("name", data.name);
  if (data.image) {
    formData.append("image", data.image);
  }
  return formData;
};

export const manufacturerApi = {
  getManufacturers: async (filters?: ManufacturerFilters) => {
    const response = await axiosInstance.get<any, any>(
      API_ROUTES.MANUFACTURERS.LIST,
      {
        params: filters,
        _returnWrapper: true,
      } as any,
    );

    return {
      manufacturers: response?.data ?? [],
      total: response?.meta?.total ?? 0,
      page: response?.meta?.page ?? 1,
      limit: response?.meta?.limit ?? 10,
    } satisfies ManufacturerListUnwrappedResponse;
  },

  getManufacturerById: async (id: string): Promise<IManufacturer> => {
    return await axiosInstance.get<any, IManufacturer>(
      API_ROUTES.MANUFACTURERS.DETAIL(id),
    );
  },

  createManufacturer: async (data: CreateManufacturerPayload): Promise<IManufacturer> => {
    return await axiosInstance.post<any, IManufacturer>(
      API_ROUTES.MANUFACTURERS.CREATE,
      buildManufacturerFormData(data),
      { headers: { "Content-Type": "multipart/form-data" } },
    );
  },

  updateManufacturer: async (
    id: string,
    data: UpdateManufacturerPayload,
  ): Promise<IManufacturer> => {
    return await axiosInstance.put<any, IManufacturer>(
      API_ROUTES.MANUFACTURERS.UPDATE(id),
      buildManufacturerFormData(data),
      { headers: { "Content-Type": "multipart/form-data" } },
    );
  },

  deleteManufacturer: async (id: string): Promise<void> => {
    await axiosInstance.delete<any, void>(API_ROUTES.MANUFACTURERS.DELETE(id));
  },
};
