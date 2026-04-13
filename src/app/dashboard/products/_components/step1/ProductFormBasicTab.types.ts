import type {
  ProductFormValues,
  ProductTag,
} from "@/types/product/product.types";

export type SetProductFormValues = React.Dispatch<React.SetStateAction<ProductFormValues>>;

export type ProductFormBasicTabProps = {
  values: ProductFormValues;
  setValues: SetProductFormValues;
  toggleTag: (tag: ProductTag, checked: boolean) => void;
  imagePreviews: string[];
  handleImage: (e: React.ChangeEvent<HTMLInputElement>) => void;
  removeImage: (index: number) => void;
  removeNewFile: (index: number) => void;
};
