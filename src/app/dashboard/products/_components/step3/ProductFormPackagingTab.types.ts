import type { ProductFormValues } from "@/types/product/product.types";

export type SetProductFormValues = React.Dispatch<React.SetStateAction<ProductFormValues>>;

export type ProductFormPackagingTabProps = {
  values: ProductFormValues;
  setValues: SetProductFormValues;
};
