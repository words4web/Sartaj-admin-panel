import type { ProductFormValues } from "@/types/product/product.types";

export type SetProductFormValues = React.Dispatch<React.SetStateAction<ProductFormValues>>;
export type ProductCatalogRow = { _id: string; name?: { en?: string } };

export type ProductFormCatalogTabProps = {
  values: ProductFormValues;
  setValues: SetProductFormValues;
  categories: ProductCatalogRow[];
  subcategories: ProductCatalogRow[];
  manufacturers: ProductCatalogRow[];
};
