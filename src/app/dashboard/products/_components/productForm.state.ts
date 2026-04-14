import { EMPTY_TRANSLATION } from "@/components/common/TranslationInput";
import { ProductFormValues, IProduct } from "@/types/product/product.types";
import {
  PRODUCT_TYPE,
  SELLING_UNIT,
  STOCK_STATUS,
} from "@/constants/product.constants";
import { extractId } from "@/utils/common.utils";
import { TAX_CATEGORY, TAX_TYPE } from "@/services/appConfig/appConfig.service";

export const defaultForm = (): ProductFormValues => ({
  sku: "",
  name: { ...EMPTY_TRANSLATION },
  description: { ...EMPTY_TRANSLATION },
  categoryId: "",
  subcategoryId: "",
  manufacturerId: "",
  basePrices: [],
  unit: "",
  netWeightKg: "",
  caseQuantity: "1",
  caseType: "",
  productType: PRODUCT_TYPE.DRY,
  tags: [],
  stockQuantity: "1",
  sellingUnit: SELLING_UNIT.UNIT,
  stockStatus: STOCK_STATUS.IN_STOCK,
  images: [],
  newFiles: [],
  isActive: true,
  badges: [],
  restrictions: {
    age20Plus: false,
  },
  isTaxable: false,
  taxCategory: TAX_CATEGORY.REDUCED,
  taxType: TAX_TYPE.PERCENTAGE,
  taxValue: "0",
});

export function mapProductToFormValues(p: IProduct): ProductFormValues {
  const existingBp = (p.basePrices ?? [])?.map((bp) => ({
    superCategoryId: extractId(bp?.superCategoryId),
    price: String(bp?.price ?? ""),
  }));
  const catId = extractId(p?.category);
  const subId = extractId(p?.subcategory);
  return {
    sku: p?.sku ?? "",
    name: { ...EMPTY_TRANSLATION, ...(p?.name ?? {}) },
    description: { ...EMPTY_TRANSLATION, ...(p?.description ?? {}) },
    categoryId: catId,
    categoryLabel: (p?.category as any)?.name?.en || undefined,
    subcategoryId: subId,
    subcategoryLabel: (p?.subcategory as any)?.name?.en || undefined,
    manufacturerId: extractId(p?.manufacturer),
    manufacturerLabel: (p?.manufacturer as any)?.name?.en || undefined,
    basePrices: existingBp,
    unit: p.unit ?? "",
    netWeightKg: String(p.netWeightKg ?? ""),
    caseQuantity: String(p.caseQuantity ?? "1"),
    caseType: p.caseType ?? "",
    productType: p.productType ?? PRODUCT_TYPE.DRY,
    tags: p.tags ?? [],
    stockQuantity: String(p.stockQuantity ?? "1"),
    sellingUnit: p.sellingUnit ?? SELLING_UNIT.UNIT,
    stockStatus: p.stockStatus,
    images: p.images ?? [],
    newFiles: [],
    isActive: p.isActive !== false,
    badges: p.badges ?? [],
    restrictions: {
      age20Plus: Boolean(p.restrictions?.age20Plus),
    },
    isTaxable: Boolean(p.isTaxable),
    taxCategory: p.taxConfig?.category ?? TAX_CATEGORY.REDUCED,
    taxType: p.taxConfig?.taxType ?? TAX_TYPE.PERCENTAGE,
    taxValue: String(p.taxConfig?.taxValue ?? "0"),
  };
}
