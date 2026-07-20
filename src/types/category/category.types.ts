import { ITranslationMap } from "../api.types";

export interface ICategory {
  _id: string;
  name: ITranslationMap;
  slug: string;
  description?: ITranslationMap;
  image?: string;
  parent?: ICategory | string | null;
  isActive: boolean;
  isDeleted: boolean;
  subCategories?: ICategory[];
  createdAt: string;
  updatedAt: string;
}

export interface CreateCategoryPayload {
  name: ITranslationMap;
  slug: string;
  description?: ITranslationMap;
  image?: File | null;
  isActive?: boolean;
}

export interface UpdateCategoryPayload extends Partial<CreateCategoryPayload> {}

export interface CategoryListResponse {
  categories: ICategory[];
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
  name: ITranslationMap;
  slug: string;
  description?: ITranslationMap;
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
