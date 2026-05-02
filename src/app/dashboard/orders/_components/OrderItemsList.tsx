"use client";

import { OrderItem, OrderItemsListProps } from "@/types/order/order.types";
import { formatYen } from "../../../../utils/order.utils";

/** Safely extract a display string from a name that might be a multilingual object */
function resolveItemName(item: OrderItem): string {
  return item.productSnapshot?.name || item.product?.name || "Product";
}

function resolveItemSku(item: OrderItem): string {
  return item.productSnapshot?.sku ?? item.product?.sku ?? "—";
}

export function OrderItemsList({ items }: OrderItemsListProps) {
  const safeItems = (items ?? [])?.filter(Boolean);

  return (
    <div className="bg-white border border-gray-100 shadow-sm rounded-2xl p-6 transition-all hover:shadow-md">
      <div className="mb-6 border-b border-gray-100 pb-4">
        <h3 className="text-xl font-bold text-gray-900 tracking-tight">
          Order Items ({safeItems?.length}{" "}
          {safeItems?.length === 1 ? "item" : "items"})
        </h3>
      </div>

      {!safeItems?.length ? (
        <div className="text-center py-10 bg-gray-50/50 rounded-xl border border-dashed border-gray-200">
          <p className="text-gray-500 font-medium">No line items available.</p>
        </div>
      ) : (
        <div className="overflow-hidden border border-gray-100 rounded-xl">
          <table className="w-full text-left border-collapse">
            <thead>
              <tr className="bg-gray-50/80 border-b border-gray-100">
                <th className="px-6 py-4 text-[10px] font-bold text-gray-500 uppercase tracking-widest">
                  Product Info
                </th>
                <th className="px-6 py-4 text-[10px] font-bold text-gray-500 uppercase tracking-widest text-center">
                  Qty
                </th>
                <th className="px-6 py-4 text-[10px] font-bold text-gray-500 uppercase tracking-widest text-right">
                  Unit Price
                </th>
                <th className="px-6 py-4 text-[10px] font-bold text-gray-500 uppercase tracking-widest text-right">
                  Line Total
                </th>
              </tr>
            </thead>
            <tbody className="divide-y divide-gray-50">
              {safeItems?.map((item, idx) => (
                <tr
                  key={`${item?.product?._id || idx}-${idx}`}
                  className="hover:bg-gray-50/50 transition-colors">
                  <td className="px-6 py-5">
                    <div className="flex items-center gap-4">
                      <div className="w-12 h-12 flex-shrink-0 bg-gray-50 rounded-lg border border-gray-100 overflow-hidden flex items-center justify-center">
                        {item?.product?.images?.[0] ||
                        item?.productSnapshot?.images?.[0] ? (
                          <img
                            src={
                              item?.product?.images?.[0] ||
                              item?.productSnapshot?.images?.[0]
                            }
                            alt={resolveItemName(item)}
                            className="w-full h-full object-cover"
                          />
                        ) : (
                          <span className="text-gray-400 text-[10px]">
                            No img
                          </span>
                        )}
                      </div>
                      <div>
                        <p className="font-bold text-gray-900 mb-2">
                          {resolveItemName(item)}
                        </p>
                        <div className="flex flex-wrap items-center gap-2">
                          <span className="text-[10px] font-mono font-medium text-gray-500 bg-gray-100 px-2 py-1 rounded">
                            SKU: {resolveItemSku(item)}
                          </span>
                          {item?.productSnapshot?.productType && (
                            <span className="text-[10px] font-bold text-blue-600 bg-blue-50 px-2 py-1 rounded uppercase">
                              {item?.productSnapshot?.productType}
                            </span>
                          )}
                          {item?.productSnapshot?.netWeightKg && (
                            <span className="text-[10px] font-medium text-gray-500 bg-gray-100 px-2 py-1 rounded">
                              {item?.productSnapshot?.netWeightKg} kg
                            </span>
                          )}

                        </div>
                      </div>
                    </div>
                  </td>
                  <td className="px-6 py-5 text-center">
                    <span className="inline-flex items-center justify-center font-bold text-gray-900 gap-1">
                      {item?.quantity ?? 0}
                      <span className="text-[12px] text-gray-400 font-medium">
                        {item?.productSnapshot?.unit || ""}
                      </span>
                    </span>
                  </td>
                  <td className="px-6 py-5 text-right font-medium text-gray-500 text-sm">
                    {formatYen(item?.price)}
                  </td>
                  <td className="px-6 py-5 text-right">
                    <p className="font-black text-primary text-sm">
                      {formatYen(item?.lineSubtotal)}
                    </p>
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      )}
    </div>
  );
}
