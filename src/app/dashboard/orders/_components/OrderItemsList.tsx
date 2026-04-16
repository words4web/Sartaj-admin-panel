"use client";

import { OrderItem } from "@/types/order/order.types";
import { formatYen } from "./order.utils";

interface Props {
  items?: OrderItem[];
}

/** Safely extract a display string from a name that might be a multilingual object */
function resolveItemName(item: OrderItem): string {
  // Prefer the snapshot name (always stored as a plain string by the backend)
  const snapshotName = item.productSnapshot?.name;
  if (snapshotName) {
    if (typeof snapshotName === "string") return snapshotName;
    return (
      snapshotName.en ||
      snapshotName.ja ||
      Object.values(snapshotName)[0] ||
      "Product"
    );
  }
  // Fall back to populated product name
  const productName = item.product?.name;
  if (!productName) return "Product";
  if (typeof productName === "string") return productName;
  return (
    productName.en ||
    productName.ja ||
    Object.values(productName)[0] ||
    "Product"
  );
}

function resolveItemSku(item: OrderItem): string {
  return item.productSnapshot?.sku ?? item.product?.sku ?? "—";
}

export function OrderItemsList({ items }: Props) {
  const safeItems = (items ?? [])?.filter(Boolean);

  return (
    <div className="bg-white border border-gray-100 shadow-[0_2px_10px_-3px_rgba(6,81,237,0.1)] rounded-2xl p-6 transition-all hover:shadow-[0_8px_30px_rgb(0,0,0,0.04)]">
      <div className="mb-5 flex justify-between items-end">
        <h3 className="text-xl font-bold text-gray-900 tracking-tight">
          Order Items
        </h3>
        <span className="text-xs font-bold text-gray-400 uppercase tracking-widest">
          {safeItems?.length} {safeItems?.length === 1 ? "Item" : "Items"}
        </span>
      </div>

      {!safeItems?.length ? (
        <div className="text-center py-10 bg-gray-50/50 rounded-xl border border-dashed border-gray-200">
          <p className="text-gray-500 font-medium">No line items available.</p>
        </div>
      ) : (
        <div className="space-y-4">
          {safeItems?.map((item, idx) => (
            <div
              key={`${item?.product?._id || idx}-${idx}`}
              className="group border border-gray-100 rounded-xl p-4 bg-white hover:bg-blue-50/30 hover:border-blue-100 transition-all shadow-sm hover:shadow-md">
              <div className="flex flex-col sm:flex-row justify-between gap-4">
                {/* Product Info */}
                <div className="flex-1">
                  <p className="font-bold text-gray-900 leading-snug group-hover:text-blue-700 transition-colors">
                    {resolveItemName(item)}
                  </p>
                  <p className="text-xs font-mono text-gray-400 mt-1">
                    SKU: {resolveItemSku(item)}
                  </p>
                </div>

                {/* Pricing Info */}
                <div className="flex-shrink-0 text-left sm:text-right">
                  <p className="text-sm text-gray-500">
                    <span className="font-semibold text-gray-700">
                      {item?.quantity ?? 0}
                    </span>{" "}
                    x {formatYen(item?.price)}
                  </p>
                  <p className="text-xl font-black text-gray-900 mt-0.5 tracking-tight">
                    {formatYen(item?.lineSubtotal)}
                  </p>
                </div>
              </div>

              {/* Tax & Discount Details Footer */}
              {((item?.lineDiscount ?? 0) > 0 || (item?.lineTax ?? 0) > 0) && (
                <div className="mt-4 pt-3 border-t border-gray-100 flex flex-wrap gap-4 text-xs">
                  {(item?.lineDiscount ?? 0) > 0 && (
                    <span className="text-green-600 bg-green-50 px-2 py-1 rounded">
                      Discount: -{formatYen(item?.lineDiscount)}
                    </span>
                  )}
                  {(item?.lineTax ?? 0) > 0 && (
                    <span className="text-gray-600 bg-gray-50 px-2 py-1 rounded">
                      Tax: {formatYen(item?.lineTax)}
                    </span>
                  )}
                </div>
              )}
            </div>
          ))}
        </div>
      )}
    </div>
  );
}
