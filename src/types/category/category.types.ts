export interface ICategory {
  _id: string;
  name: string;
  description?: string;
  image?: string;
  parent?: ICategory | string | null;
  isActive: boolean;
  isDeleted: boolean;
  subCategories?: ICategory[];
  createdAt: string;
  updatedAt: string;
}

export interface CreateCategoryPayload {
  name: string;
  description?: string;
  image?: File | null;
  isActive?: boolean;
}

export interface UpdateCategoryPayload extends Partial<CreateCategoryPayload> {}

export interface CategoryListResponse {
  data: ICategory[];
  total: number;
  page: number;
  limit: number;
}

export interface CategoryFilters {
  search?: string;
  page?: number;
  limit?: number;
}

// FORM PROPS TYPES
export type CategoryFormValues = {
  name: string;
  description?: string;
  image?: File | null;
  existingImage?: string | null;
};

export type CategoryFormProps = {
  initialValues: CategoryFormValues;
  isSubmitting?: boolean;
  submitLabel?: string;
  requireImage?: boolean;
  onSubmit: (values: CategoryFormValues) => void | Promise<void>;
};
