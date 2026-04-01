export interface IManufacturer {
  _id: string;
  name: string;
  image: string;
  isDeleted: boolean;
  createdAt: string;
  updatedAt: string;
}

export interface CreateManufacturerPayload {
  name: string;
  image: File | null;
}

export interface UpdateManufacturerPayload extends Partial<CreateManufacturerPayload> {}

export interface ManufacturerListResponse {
  data: IManufacturer[];
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
  name: string;
  image?: File | null;
  existingImage?: string | null;
};

export type ManufacturerFormProps = {
  initialValues: ManufacturerFormValues;
  isSubmitting?: boolean;
  submitLabel?: string;
  onSubmit: (values: ManufacturerFormValues) => void | Promise<void>;
};
