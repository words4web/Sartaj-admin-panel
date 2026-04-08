import {
  ProductFormValues,
  CreateProductPayload,
  UpdateProductPayload,
  ProductTag,
} from "@/types/product/product.types";
import { SuperCategory } from "@/types/customer/customer.types";

export type UseProductFormProps = {
  initialValues?: Partial<ProductFormValues>;
  isEdit?: boolean;
  totalSteps: number;
  onSubmit: (
    payload: CreateProductPayload | UpdateProductPayload,
  ) => Promise<void>;
};

export type ProductNamedRow = { _id: string; name?: { en?: string } };

export type UseProductFormReturn = {
  values: ProductFormValues;
  setValues: React.Dispatch<React.SetStateAction<ProductFormValues>>;
  step: number;
  complete: boolean[];
  stepValid: boolean[];
  isFormValid: boolean;
  supers: SuperCategory[];
  categories: ProductNamedRow[];
  subcategories: ProductNamedRow[];
  manufacturers: ProductNamedRow[];
  imagePreview: string | null;
  toggleSuperCategory: (superCategoryId: string, checked: boolean) => void;
  setSuperPrice: (superCategoryId: string, price: string) => void;
  toggleTag: (tag: ProductTag, checked: boolean) => void;
  handleImage: (e: React.ChangeEvent<HTMLInputElement>) => void;
  goNext: () => void;
  goBack: () => void;
  handleSubmit: (e: React.FormEvent) => Promise<void>;
};
