import { SUPER_CATEGORIES } from "@/lib/constants";

// Japan-specific address
export interface IAddress {
  _id?: string;
  fullName: string;
  postalCode: string;
  prefecture: string;
  city: string;
  streetAddress: string;
  building?: string;
  phone: string;
}

export interface SuperCategory {
  _id: string;
  name: keyof typeof SUPER_CATEGORIES;
  isActive: boolean;
}

interface CustomerPriceListRef {
  _id: string;
  name: string;
  superCategory?: string | { _id: string };
}

export interface Customer {
  _id: string;
  fullName: string;
  email: string;
  mobileNumber: string;
  addresses: IAddress[];
  superCategory: SuperCategory | string;
  priceList?: CustomerPriceListRef | string | null;
  isActive: boolean;
  isDeleted: boolean;
  createdAt: string;
  updatedAt: string;
}

export interface CreateCustomerPayload {
  fullName: string;
  email: string;
  mobileNumber: string;
  addresses: IAddress[];
  superCategory: string;
  priceList?: string | null;
}

export interface UpdateCustomerPayload extends Partial<CreateCustomerPayload> {}

export interface CustomerListResponse {
  data: Customer[];
  total: number;
  page: number;
  limit: number;
}

export interface CustomerFilters {
  search?: string;
  superCategory?: string;
  isActive?: boolean;
  sortBy?: string;
  sortOrder?: "asc" | "desc";
  page?: number;
  limit?: number;
}

export type CustomerFormValues = {
  fullName: string;
  email: string;
  mobileNumber: string;
  superCategory: string;
  priceList: string;
  addresses: IAddress[];
};

// FORM PROPS TYPES

export type ConfirmAction = {
  type: "delete" | "toggle";
  customer: Customer;
} | null;
export type StatusFilter = "all" | "active" | "inactive";

export type CustomerFormProps = {
  superCategories: SuperCategory[];
  initialValues: CustomerFormValues;
  initialPriceListLabel?: string;
  isSubmitting?: boolean;
  submitLabel?: string;
  onSubmit: (values: CustomerFormValues) => void | Promise<void>;
};
