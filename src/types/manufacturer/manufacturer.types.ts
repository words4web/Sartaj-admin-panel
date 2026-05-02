import { ITranslationMap } from "../api.types";

export interface IManufacturer {
  _id: string;
  name: ITranslationMap;
  image: string;
  isDeleted: boolean;
  createdAt: string;
  updatedAt: string;
}

export interface CreateManufacturerPayload {
  name: ITranslationMap;
  image: File | null;
}

export interface UpdateManufacturerPayload extends Partial<CreateManufacturerPayload> {
  existingImage?: string;
}

export interface ManufacturerListResponse {
  manufacturers: IManufacturer[];
  total: number;
  page: number;
  limit: number;
}

export interface ManufacturerFilters {
  search?: string;
  page?: number;
  limit?: number;
}

export type ManufacturerFormValues = {
  name: ITranslationMap;
  image?: File | null;
  existingImage?: string | null;
};

export type ManufacturerFormProps = {
  initialValues: ManufacturerFormValues;
  isSubmitting?: boolean;
  submitLabel?: string;
  onSubmit: (values: ManufacturerFormValues) => void | Promise<void>;
};
