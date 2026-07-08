"use client";

import { formatYen } from "@/utils/common.utils";

interface EditHistoryItemListProps {
  title: string;
  items: any[];
  variant: "before" | "after";
}

export function EditHistoryItemList({
  title,
  items,
  variant,
}: EditHistoryItemListProps) {
  const isBefore = variant === "before";
  return (
    <div>
      <h5
        className={`font-bold mb-2 border-b pb-1 uppercase tracking-wider text-xs ${
          isBefore
            ? "text-red-600 border-red-50"
            : "text-emerald-600 border-emerald-50"
        }`}>
        {title}
      </h5>
      <ul className="space-y-2 max-h-[240px] overflow-y-auto pr-1">
        {items?.map((item, idx) => {
          const name =
            item?.productSnapshot?.name || item?.product?.name || "Product";
          return (
            <li
              key={idx}
              className={`flex justify-between items-center px-3 py-2 rounded-lg border ${
                isBefore
                  ? "text-gray-600 bg-red-50/20 border-red-50/30"
                  : "text-gray-800 bg-emerald-50/20 border-emerald-50/30"
              }`}>
              <span className="truncate max-w-[350px] font-medium">{name}</span>
              <span
                className={`shrink-0 ${
                  isBefore
                    ? "font-semibold text-gray-700"
                    : "font-bold text-gray-900"
                }`}>
                {formatYen(item?.price)} × {item?.quantity}
              </span>
            </li>
          );
        })}
      </ul>
    </div>
  );
}
