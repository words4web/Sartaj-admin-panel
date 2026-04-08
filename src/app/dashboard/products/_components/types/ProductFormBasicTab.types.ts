import type {
  ProductFormValues,
  ProductTag,
} from "@/types/product/product.types";

export type SetProductFormValues = React.Dispatch<React.SetStateAction<ProductFormValues>>;

export type ProductFormBasicTabProps = {
  values: ProductFormValues;
  setValues: SetProductFormValues;
  toggleTag: (tag: ProductTag, checked: boolean) => void;
  imagePreview: string | null;
  onImageChange: (e: React.ChangeEvent<HTMLInputElement>) => void;
};
