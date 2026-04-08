import { SuperCategory } from "@/types/customer/customer.types";
import { PriceListFormValues } from "@/types/priceList/priceList.types";

export type PriceListFormSubmitPayload = {
  name: string;
  superCategoryId: string;
  items: { productId: string; price: number }[];
};

export type PriceListFormProps = {
  superCategories: SuperCategory[];
  initialValues: PriceListFormValues;
  isSubmitting?: boolean;
  submitLabel?: string;
  onSubmit: (payload: PriceListFormSubmitPayload) => void | Promise<void>;
};
