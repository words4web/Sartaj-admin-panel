"use client";
import { JapaneseYen } from "lucide-react";
import {
  PaymentBreakdownCardProps,
  PriceBreakdownType,
} from "@/types/order/order.types";
import { formatYen } from "@/utils/common.utils";

export function PaymentBreakdownCard({ order }: PaymentBreakdownCardProps) {
  return (
    <div className="bg-white border border-gray-100 shadow-sm rounded-2xl p-6 transition-all hover:shadow-md flex flex-col h-full">
      <div className="flex items-center gap-3 mb-6">
        <div className="w-10 h-10 rounded-full bg-primary/10 text-primary flex items-center justify-center">
          <JapaneseYen className="w-5 h-5" />
        </div>
        <h3 className="text-lg font-bold text-gray-900">Payment Breakdown</h3>
      </div>

      <div className="flex-grow space-y-4">
        {/* Item Subtotal (Raw) */}
        <div className="flex justify-between items-center text-sm">
          <span className="font-medium text-black">Subtotal</span>
          <span className="font-bold text-gray-900">
            {formatYen(Number(order?.calculationSnapshot?.subTotal))}
          </span>
        </div>

        {/* Dynamic Adjustments */}
        {(order?.priceBreakdown || [])?.map((item, idx) => {
          const isDiscount =
            item?.isNegative ||
            item?.type === PriceBreakdownType.DISCOUNT ||
            item?.type === PriceBreakdownType.COUPON ||
            item?.type === PriceBreakdownType.WALLET ||
            item?.name?.toLowerCase()?.includes("discount");

          return (
            <div key={idx} className="flex justify-between items-start text-sm">
              <div className="flex flex-col gap-0.5">
                <span
                  className={`font-medium ${isDiscount ? "text-emerald-600" : "text-black"}`}>
                  {item?.name}
                </span>
                {isDiscount && order?.coupon?.code && (
                  <span className="text-emerald-500 font-medium leading-none">
                    Code: {order?.coupon?.code}
                  </span>
                )}
              </div>
              <span
                className={`font-bold ${isDiscount ? "text-emerald-600" : "text-gray-900"}`}>
                {isDiscount && !item?.amount?.toString()?.startsWith("-")
                  ? "-"
                  : ""}
                {formatYen(Math.abs(item?.amount))}
              </span>
            </div>
          );
        })}

        {/* Grand Total */}
        <div className="flex justify-between items-center pt-4 mt-4 border-t border-gray-100">
          <span className="font-bold text-gray-900 text-base">
            Total Amount
          </span>
          <span className="font-black text-2xl text-primary tracking-tight">
            {formatYen(Number(order?.totalAmount))}
          </span>
        </div>
      </div>
    </div>
  );
}
