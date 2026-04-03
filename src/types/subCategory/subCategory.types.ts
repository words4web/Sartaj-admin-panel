import { ICategory } from "../category/category.types";

export interface ISubCategory {
  _id: string;
  name: string;
  description?: string;
  media?: string;
  parent: ICategory | string; // required for subcategory
  isActive: boolean;
  isDeleted: boolean;
  createdAt: string;
  updatedAt: string;
}

export interface CreateSubCategoryPayload {
  name: string;
  description?: string;
  media?: string;
  parent: string; // ObjectId
  isActive?: boolean;
}

export interface UpdateSubCategoryPayload extends Partial<CreateSubCategoryPayload> {}

export interface SubCategoryListResponse {
  subCategories: ISubCategory[];
  total: number;
  page: number;
  limit: number;
}

export interface SubCategoryFilters {
  search?: string;
  parent?: string;
  page?: number;
  limit?: number;
}

// FORM PROPS TYPES
export type SubCategoryFormValues = {
  name: string;
  description?: string;
  parent: string;
};

export type SubCategoryFormProps = {
  categories: ICategory[];
  initialValues: SubCategoryFormValues;
  isSubmitting?: boolean;
  submitLabel?: string;
  onSubmit: (values: SubCategoryFormValues) => void | Promise<void>;
};

export type subCategoryConfirmAction = {
  type: "delete" | "toggle";
  subCategory: ISubCategory;
} | null;
