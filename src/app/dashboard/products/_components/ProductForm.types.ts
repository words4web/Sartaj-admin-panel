import {
  CreateProductPayload,
  UpdateProductPayload,
  ProductFormValues,
} from "@/types/product/product.types";

export type ProductFormProps = {
  initialValues?: Partial<ProductFormValues>;
  isSubmitting?: boolean;
  submitLabel?: string;
  isEdit?: boolean;
  onSubmit: (
    payload: CreateProductPayload | UpdateProductPayload,
  ) => Promise<void>;
  productId?: string;
};
