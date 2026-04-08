export type PriceListItemPayload = {
  productId: string;
  price: number;
};

export interface PriceListItemRow extends PriceListItemPayload {
  sku?: string;
  name?: string | null;
}

export interface PriceList {
  _id: string;
  name: string;
  superCategory: { _id: string; name?: string } | string;
  items?: Array<
    { product: string; price: number } | PriceListItemRow
  >;
  createdAt?: string;
  updatedAt?: string;
}

export interface PriceListFilters {
  search?: string;
  superCategory?: string;
  page?: number;
  limit?: number;
}

export interface PriceListListResponse {
  lists: PriceList[];
  total: number;
  page: number;
  limit: number;
}

export type CreatePriceListPayload = {
  name: string;
  superCategoryId: string;
  items?: PriceListItemPayload[];
};

export type UpdatePriceListPayload = Partial<CreatePriceListPayload>;

export type PriceListFormValues = {
  name: string;
  superCategoryId: string;
  items: PriceListItemRow[];
};
