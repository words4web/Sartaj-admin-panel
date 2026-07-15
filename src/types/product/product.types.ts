import { ITranslationMap } from "@/types/api.types";

import {
  ProductBadge,
  ProductUnit,
  ProductType,
  SellingUnit,
  StockStatus,
  ProductTag,
  ProductCaseType,
} from "@/constants/product.constants";
import {
  TAX_CATEGORY,
  TAX_TYPE,
  DISCOUNT_TYPE,
} from "@/services/appConfig/appConfig.service";

export type {
  ProductBadge,
  ProductUnit,
  ProductType,
  SellingUnit,
  StockStatus,
  ProductTag,
  ProductCaseType,
};

export interface IProductBasePrice {
  superCategoryId: string | { _id: string; name?: string | ITranslationMap };
  price: number;
}

export interface IProduct {
  _id: string;
  sku: string;
  name: ITranslationMap;
  slug?: string;
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
  caseType?: ProductCaseType;
  productType: ProductType;
  tags: ProductTag[];
  stockQuantity: number;
  sellingUnit: SellingUnit;
  stockStatus: StockStatus;
  images: string[];
  isActive: boolean;
  isGiftItem?: boolean;
  badges: ProductBadge[];
  relatedProducts?: (
    | string
    | { _id: string; sku?: string; name?: ITranslationMap }
  )[];
  restrictions: {
    age20Plus: boolean;
  };
  isTaxable: boolean;
  taxConfig?: {
    category?: TAX_CATEGORY;
    taxType: TAX_TYPE;
    taxValue: number;
  };
  timeDiscount?: {
    isEnabled: boolean;
    startTime: string;
    endTime: string;
    discountType: DISCOUNT_TYPE;
    discountValue: number;
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
  slug: string;
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
  caseType: ProductCaseType | "";
  productType: ProductType | "";
  tags: ProductTag[];
  stockQuantity: string;
  sellingUnit: SellingUnit | "";
  stockStatus: StockStatus | "";
  images: string[];
  newFiles: File[];

  isActive: boolean;
  isGiftItem: boolean;
  badges: ProductBadge[];
  relatedProducts: string[];
  relatedProductsLabels?: Record<string, string>;
  restrictions: {
    age20Plus: boolean;
  };
  isTaxable: boolean;
  taxCategory?: TAX_CATEGORY | "";
  taxType: TAX_TYPE | "";
  taxValue: string;
  timeDiscount: {
    isEnabled: boolean;
    startTime: string | Date;
    endTime: string | Date;
    discountType: DISCOUNT_TYPE | "";
    discountValue: string;
  };
}

export interface CreateProductPayload {
  sku: string;
  slug: string;
  name: ITranslationMap;
  description: ITranslationMap;
  category: string;
  subcategory: string;
  manufacturer: string;
  basePrices: { superCategoryId: string; price: number }[];
  unit: ProductUnit;
  netWeightKg: number;
  caseQuantity: number;
  caseType?: ProductCaseType;
  productType: ProductType;
  tags: ProductTag[];
  stockQuantity: number;
  sellingUnit: SellingUnit;
  stockStatus: StockStatus;
  images: string[];
  isActive: boolean;
  isGiftItem?: boolean;
  badges: ProductBadge[];
  relatedProducts: string[];
  restrictions: {
    age20Plus: boolean;
  };
  isTaxable: boolean;
  taxConfig?: {
    category?: TAX_CATEGORY;
    taxType: TAX_TYPE;
    taxValue: number;
  };
  timeDiscount: {
    isEnabled: boolean;
    startTime: string;
    endTime: string;
    discountType: DISCOUNT_TYPE;
    discountValue: number;
  };
}

export type UpdateProductPayload = Partial<CreateProductPayload>;
