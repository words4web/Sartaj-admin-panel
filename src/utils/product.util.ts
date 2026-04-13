import {
  IProduct,
  IProductBasePrice,
} from "@/types/product/product.types";
import { extractId } from "./common.utils";

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
