"use client";

import { formatYen } from "@/utils/common.utils";
import { PRICE_BREAKDOWN_METRICS } from "@/constants/order.constants";

interface EditHistoryPriceComparisonProps {
  previousSnapshot: any;
  newSnapshot: any;
  previousTotalAmount: number;
  newTotalAmount: number;
}

export function EditHistoryPriceComparison({
  previousSnapshot,
  newSnapshot,
  previousTotalAmount,
  newTotalAmount,
}: EditHistoryPriceComparisonProps) {
  const prevSnap = previousSnapshot as any;
  const nextSnap = newSnapshot as any;

  return (
    <div className="border border-gray-100 rounded-xl p-5 bg-gray-50/20">
      <div className="grid grid-cols-3 gap-2 text-xs font-bold text-gray-400 pb-2 border-b border-gray-100">
        <span>Metric</span>
        <span className="text-right">Before</span>
        <span className="text-right">After</span>
      </div>
      <div className="divide-y divide-gray-50 text-sm">
        {PRICE_BREAKDOWN_METRICS?.filter(
          (row) =>
            (prevSnap[row?.key] || 0) > 0 || (nextSnap[row?.key] || 0) > 0,
        )?.map((row) => {
          const prev = prevSnap[row?.key] || 0;
          const next = nextSnap[row?.key] || 0;
          const changed = prev !== next;
          return (
            <div
              key={row?.key}
              className="grid grid-cols-3 gap-2 py-2 items-center">
              <span className="text-gray-500 font-medium">{row?.label}</span>
              <span className="text-right text-gray-405">
                {row?.negative ? "-" : ""}
                {formatYen(prev)}
              </span>
              <span
                className={`text-right font-bold ${changed ? (next > prev ? "text-red-500" : "text-emerald-600") : "text-gray-700"}`}>
                {row?.negative ? "-" : ""}
                {formatYen(next)}
              </span>
            </div>
          );
        })}
        <div className="grid grid-cols-3 gap-2 pt-3 mt-2 border-t border-gray-100 items-baseline">
          <span className="font-bold text-gray-800 text-sm">Total</span>
          <span className="text-right font-semibold text-gray-500 text-sm">
            {formatYen(previousTotalAmount)}
          </span>
          <span
            className={`text-right font-black text-base ${newTotalAmount > previousTotalAmount ? "text-red-500" : newTotalAmount < previousTotalAmount ? "text-emerald-600" : "text-gray-900"}`}>
            {formatYen(newTotalAmount)}
          </span>
        </div>
      </div>
    </div>
  );
}
