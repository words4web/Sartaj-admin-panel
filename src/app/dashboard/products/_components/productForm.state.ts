import { EMPTY_TRANSLATION } from "@/components/common/TranslationInput";
import { ProductFormValues, IProduct } from "@/types/product/product.types";
import {
  PRODUCT_TYPE,
  SELLING_UNIT,
  STOCK_STATUS,
} from "@/constants/product.constants";
import { extractId } from "@/utils/common.utils";
import {
  TAX_CATEGORY,
  TAX_TYPE,
  DISCOUNT_TYPE,
} from "@/services/appConfig/appConfig.service";
import dayjs from "dayjs";

export const defaultForm = (): ProductFormValues => ({
  sku: "",
  slug: "",
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
  isGiftItem: false,
  badges: [],
  relatedProducts: [],
  restrictions: {
    age20Plus: false,
  },
  isTaxable: false,
  taxCategory: TAX_CATEGORY.REDUCED,
  taxType: TAX_TYPE.PERCENTAGE,
  taxValue: "0",
  timeDiscount: {
    isEnabled: false,
    startTime: dayjs()?.toISOString(),
    endTime: dayjs().add(24, "hours")?.toISOString(),
    discountType: DISCOUNT_TYPE.PERCENTAGE,
    discountValue: "1",
  },
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
    slug: p?.slug ?? "",
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
    stockQuantity:
      p.stockStatus === STOCK_STATUS.OUT_OF_STOCK
        ? "0"
        : String(Math.max(1, Number(p.stockQuantity ?? 1))),
    sellingUnit: p.sellingUnit ?? SELLING_UNIT.UNIT,
    stockStatus: p.stockStatus,
    images: p.images ?? [],
    newFiles: [],
    isActive: p.isActive !== false,
    isGiftItem: Boolean(p.isGiftItem),
    badges: p.badges ?? [],
    relatedProducts:
      p.relatedProducts?.map((r) =>
        typeof r === "string" ? r : String(r._id),
      ) ?? [],
    relatedProductsLabels: p.relatedProducts?.reduce(
      (acc, r) => {
        if (typeof r !== "string") {
          acc[String(r._id)] = `${r.sku} — ${r.name?.en ?? ""}`;
        }
        return acc;
      },
      {} as Record<string, string>,
    ),
    restrictions: {
      age20Plus: Boolean(p.restrictions?.age20Plus),
    },
    isTaxable: Boolean(p.isTaxable),
    taxCategory: p.taxConfig?.category ?? TAX_CATEGORY.REDUCED,
    taxType: p.taxConfig?.taxType ?? TAX_TYPE.PERCENTAGE,
    taxValue: String(p.taxConfig?.taxValue ?? "0"),
    timeDiscount: {
      isEnabled: p.timeDiscount?.isEnabled ?? false,
      startTime: p.timeDiscount?.startTime
        ? dayjs(p.timeDiscount.startTime)?.toISOString()
        : dayjs()?.toISOString(),
      endTime: p.timeDiscount?.endTime
        ? dayjs(p.timeDiscount.endTime)?.toISOString()
        : dayjs().add(24, "hours")?.toISOString(),
      discountType: p.timeDiscount?.discountType ?? DISCOUNT_TYPE.PERCENTAGE,
      discountValue: String(p.timeDiscount?.discountValue ?? "0"),
    },
  };
}
