import { EMPTY_TRANSLATION } from "@/components/common/TranslationInput";
import { ITranslationMap } from "@/types/api.types";
import {
  CreateProductPayload,
  IProduct,
  IProductBasePrice,
  UpdateProductPayload,
} from "@/types/product/product.types";
import { extractId } from "./common.utils";

const appendIfDefined = (fd: FormData, key: string, value: unknown) => {
  if (value === undefined || value === null) return;
  if (typeof value === "boolean") {
    fd.append(key, value ? "true" : "false");
    return;
  }
  fd.append(key, String(value));
};

export const buildProductFormData = (
  data: Partial<CreateProductPayload | UpdateProductPayload>,
): FormData => {
  const fd = new FormData();
  if (data.name !== undefined) fd.append("name", JSON.stringify(data.name));
  if (data.description !== undefined)
    fd.append("description", JSON.stringify(data.description));
  if (data.basePrices !== undefined)
    fd.append("basePrices", JSON.stringify(data.basePrices));

  if (data.tags !== undefined) fd.append("tags", JSON.stringify(data.tags));
  if (data.badges !== undefined)
    fd.append("badges", JSON.stringify(data.badges));
  if (data.restrictions !== undefined)
    fd.append("restrictions", JSON.stringify(data.restrictions));

  appendIfDefined(fd, "sku", data.sku);
  appendIfDefined(fd, "category", data.category);
  appendIfDefined(fd, "subcategory", data.subcategory);
  appendIfDefined(fd, "manufacturer", data.manufacturer);

  appendIfDefined(fd, "unit", data.unit);
  appendIfDefined(fd, "netWeightKg", data.netWeightKg);
  appendIfDefined(fd, "productType", data.productType);

  appendIfDefined(fd, "caseQuantity", data.caseQuantity);
  appendIfDefined(fd, "stockQuantity", data.stockQuantity);
  appendIfDefined(fd, "sellingUnit", data.sellingUnit);
  appendIfDefined(fd, "stockStatus", data.stockStatus);

  appendIfDefined(fd, "isActive", data.isActive);
  if (data.image) fd.append("image", data.image);
  return fd;
};

export function normalizeTranslation(v: unknown): ITranslationMap {
  if (!v) return { ...EMPTY_TRANSLATION };
  if (typeof v === "string") return { ...EMPTY_TRANSLATION, en: v };
  return { ...EMPTY_TRANSLATION, ...v };
}

export function localizedName(
  ref:
    | IProduct["category"]
    | IProduct["subcategory"]
    | IProduct["manufacturer"]
    | undefined,
): string {
  if (ref == null) return "—";
  if (typeof ref === "string") return ref;
  return ref?.name?.en ?? "—";
}

export function subcategoryDisplay(product: IProduct): string {
  const catId = extractId(product?.category);
  const subId = extractId(product?.subcategory);
  if (!subId || subId === catId) return "No sub category";
  return localizedName(product?.subcategory);
}

export function superCategoryLabel(bp: IProductBasePrice): string {
  const sc = bp.superCategoryId;
  if (sc == null) return "—";
  if (typeof sc === "string") return sc;
  const n = sc?.name;
  if (typeof n === "string") return n;
  if (n && typeof n === "object" && "en" in n) return n?.en ?? sc?._id;
  return sc?._id ?? "—";
}
