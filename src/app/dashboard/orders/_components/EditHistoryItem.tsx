"use client";

import { OrderEditHistoryEntry } from "@/types/order/order.types";
import { ArrowRight } from "lucide-react";
import { dateUtils } from "@/utils/common.utils";
import { formatYen } from "@/utils/common.utils";

interface EditHistoryItemProps {
  entry: OrderEditHistoryEntry;
  onClick: () => void;
}

export function EditHistoryItem({ entry, onClick }: EditHistoryItemProps) {
  const diff = entry?.newTotalAmount - entry?.previousTotalAmount;
  return (
    <div className="border border-gray-100 rounded-xl overflow-hidden transition-all bg-gray-50/30 hover:bg-gray-50/50">
      <button
        onClick={onClick}
        className="w-full flex flex-col md:flex-row md:items-center justify-between p-4 text-left transition-colors gap-3 cursor-pointer">
        <div>
          <p className="text-xs text-gray-500 font-bold">
            Edited on {dateUtils.format(entry?.editedAt, "YYYY-MM-DD")} at{" "}
            {dateUtils.formatTime(entry?.editedAt, "hh:mm A")}
          </p>
          <div className="flex items-center gap-2 mt-1.5">
            <span className="text-sm font-semibold text-gray-450 line-through">
              {formatYen(entry?.previousTotalAmount)}
            </span>
            <ArrowRight className="w-3.5 h-3.5 text-gray-400" />
            <span className="text-sm font-extrabold text-gray-950">
              {formatYen(entry?.newTotalAmount)}
            </span>
            {diff !== 0 && (
              <span
                className={`text-xs font-bold px-2 py-0.5 rounded-md ml-1 ${diff > 0 ? "bg-red-50 text-red-600" : "bg-emerald-50 text-emerald-600"}`}>
                {diff > 0 ? "+" : ""}
                {formatYen(diff)}
              </span>
            )}
          </div>
        </div>
        <div className="flex items-center gap-1.5 text-xs text-primary font-black self-end md:self-center hover:underline">
          View Details <ArrowRight className="w-3.5 h-3.5" />
        </div>
      </button>
    </div>
  );
}
