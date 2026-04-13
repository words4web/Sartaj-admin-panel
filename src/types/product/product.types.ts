import { ITranslationMap } from "@/types/api.types";

import {
  ProductBadge,
  ProductUnit,
  ProductType,
  SellingUnit,
  StockStatus,
  ProductTag,
} from "@/constants/product.constants";

export type {
  ProductBadge,
  ProductUnit,
  ProductType,
  SellingUnit,
  StockStatus,
  ProductTag,
};

export interface IProductBasePrice {
  superCategoryId: string | { _id: string; name?: string | ITranslationMap };
  price: number;
}

export interface IProduct {
  _id: string;
  sku: string;
  name: ITranslationMap;
  description: ITranslationMap;
  category:
    | string
    | { _id: string; name?: ITranslationMap; parent?: string | null };
  subcategory:
    | string
    | { _id: string; name?: ITranslationMap; parent?: string | null };
  manufacturer: string | { _id: string; name?: ITranslationMap };
  basePrices: IProductBasePrice[];
  unit: ProductUnit;
  netWeightKg: number;
  caseQuantity: number;
  productType: ProductType;
  tags: ProductTag[];
  stockQuantity: number;
  sellingUnit: SellingUnit;
  stockStatus: StockStatus;
  images: string[];
  isActive: boolean;
  badges: ProductBadge[];
  restrictions: {
    age20Plus: boolean;
  };
  createdAt?: string;
  updatedAt?: string;
}

export interface ProductFilters {
  search?: string;
  page?: number;
  limit?: number;
}

export interface ProductListResponse {
  products: IProduct[];
  total: number;
  page: number;
  limit: number;
}

export interface ProductFormValues {
  sku: string;
  name: ITranslationMap;
  description: ITranslationMap;
  categoryId: string;
  categoryLabel?: string;
  subcategoryId: string;
  subcategoryLabel?: string;
  manufacturerId: string;
  manufacturerLabel?: string;
  basePrices: { superCategoryId: string; price: string }[];
  unit: ProductUnit | "";
  netWeightKg: string;
  caseQuantity: string;
  productType: ProductType | "";
  tags: ProductTag[];
  stockQuantity: string;
  sellingUnit: SellingUnit | "";
  stockStatus: StockStatus | "";
  images: string[];
  newFiles: File[];

  isActive: boolean;
  badges: ProductBadge[];
  restrictions: {
    age20Plus: boolean;
  };
}

export interface CreateProductPayload {
  sku: string;
  name: ITranslationMap;
  description: ITranslationMap;
  category: string;
  subcategory: string;
  manufacturer: string;
  basePrices: { superCategoryId: string; price: number }[];
  unit: ProductUnit;
  netWeightKg: number;
  caseQuantity: number;
  productType: ProductType;
  tags: ProductTag[];
  stockQuantity: number;
  sellingUnit: SellingUnit;
  stockStatus: StockStatus;
  images: string[];
  isActive: boolean;
  badges: ProductBadge[];
  restrictions: {
    age20Plus: boolean;
  };
}

export type UpdateProductPayload = Partial<CreateProductPayload>;
