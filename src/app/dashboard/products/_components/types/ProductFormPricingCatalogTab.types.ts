import type { SuperCategory } from "@/types/customer/customer.types";
import type { ProductFormValues } from "@/types/product/product.types";

export type SetProductFormValues = React.Dispatch<React.SetStateAction<ProductFormValues>>;
export type ProductNamedRow = { _id: string; name?: { en?: string } };

export type ProductFormPricingCatalogTabProps = {
  supers: SuperCategory[];
  values: ProductFormValues;
  setValues: SetProductFormValues;
  categories: ProductNamedRow[];
  subcategories: ProductNamedRow[];
  manufacturers: ProductNamedRow[];
  toggleSuperCategory: (superCategoryId: string, checked: boolean) => void;
  setSuperPrice: (superCategoryId: string, price: string) => void;
};
