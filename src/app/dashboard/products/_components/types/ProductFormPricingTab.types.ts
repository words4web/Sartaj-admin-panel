import type { SuperCategory } from "@/types/customer/customer.types";
import type { ProductFormValues } from "@/types/product/product.types";

export type ProductFormPricingTabProps = {
  supers: SuperCategory[];
  values: ProductFormValues;
  toggleSuperCategory: (superCategoryId: string, checked: boolean) => void;
  setSuperPrice: (superCategoryId: string, price: string) => void;
};
