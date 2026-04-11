import { EMPTY_TRANSLATION } from "@/components/common/TranslationInput";
import { ProductFormValues, IProduct } from "@/types/product/product.types";
import {
  PRODUCT_TYPE,
  SELLING_UNIT,
  STOCK_STATUS,
} from "@/constants/product.constants";
import { extractId } from "@/utils/common.utils";

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
  productType: PRODUCT_TYPE.DRY,
  tags: [],
  stockQuantity: "1",
  sellingUnit: SELLING_UNIT.UNIT,
  stockStatus: STOCK_STATUS.IN_STOCK,
  image: null,
  existingImage: null,
  isActive: true,
  badges: [],
  restrictions: {
    age20Plus: false,
  },
});

export function mapProductToFormValues(p: IProduct): ProductFormValues {
  const existingBp = (p.basePrices ?? []).map((bp) => ({
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
    productType: p.productType ?? PRODUCT_TYPE.DRY,
    tags: p.tags ?? [],
    stockQuantity: String(p.stockQuantity ?? "1"),
    sellingUnit: p.sellingUnit ?? SELLING_UNIT.UNIT,
    stockStatus: p.stockStatus,
    image: null,
    existingImage: p.image ?? null,
    isActive: p.isActive !== false,
    badges: p.badges ?? [],
    restrictions: {
      age20Plus: Boolean(p.restrictions?.age20Plus),
    },
  };
}
