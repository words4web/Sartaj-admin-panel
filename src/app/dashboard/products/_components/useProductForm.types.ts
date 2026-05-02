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
  productId?: string;
};

export type ProductNamedRow = { _id: string; name?: { en?: string } };

export type UseProductFormReturn = {
  values: ProductFormValues;
  isUploading: boolean;
  setValues: React.Dispatch<React.SetStateAction<ProductFormValues>>;
  step: number;
  complete: boolean[];
  stepValid: boolean[];
  isFormValid: boolean;
  supers: SuperCategory[];
  hasSubcategories: boolean | null;
  setHasSubcategories: React.Dispatch<React.SetStateAction<boolean | null>>;
  imagePreviews: string[];
  toggleSuperCategory: (superCategoryId: string, checked: boolean) => void;
  setSuperPrice: (superCategoryId: string, price: string) => void;
  toggleTag: (tag: ProductTag, checked: boolean) => void;
  handleImage: (e: React.ChangeEvent<HTMLInputElement>) => void;
  removeImage: (index: number) => void;
  removeNewFile: (index: number) => void;
  goNext: () => void;
  goBack: () => void;
  handleSubmit: (e: React.FormEvent) => Promise<void>;
  productId?: string;
};
