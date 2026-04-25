"use client";
import { JapaneseYen, Wallet } from "lucide-react";
import { formatYen, formatPaymentMethod } from "../../../../utils/order.utils";
import { PaymentBreakdownCardProps } from "@/types/order/order.types";

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
            {formatYen(order?.calculationSnapshot?.subTotal)}
          </span>
        </div>

        {/* Dynamic Adjustments */}
        {(order?.priceBreakdown || [])?.map((item, idx) => {
          const isDiscount =
            item?.isNegative ||
            item?.type === "DISCOUNT" ||
            item?.name?.toLowerCase()?.includes("discount");

          return (
            <div
              key={idx}
              className="flex justify-between items-center text-sm">
              <span
                className={`font-medium ${isDiscount ? "text-red-500" : "text-black"}`}>
                {item?.name}
              </span>
              <span
                className={`font-bold ${isDiscount ? "text-red-500" : "text-gray-900"}`}>
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
            {formatYen(order?.totalAmount)}
          </span>
        </div>
      </div>

      <div className="mt-6 pt-5">
        <div className="flex justify-between items-center bg-gray-50 p-4 rounded-xl border border-gray-100/80 gap-4">
          <div className="flex items-center gap-2">
            <Wallet className="w-4 h-4 text-gray-900" />
            <div className="flex flex-col">
              <span className="text-gray-900 text-[10px] font-bold uppercase tracking-wider leading-none">
                Payment
              </span>
              <span className="text-gray-900 text-[10px] font-bold uppercase tracking-wider leading-none mt-0.5">
                Method:
              </span>
            </div>
          </div>
          <div className="flex-1 text-right">
            <span className="font-black text-gray-900 text-sm">
              {formatPaymentMethod(order?.paymentMethod)}
            </span>
          </div>
        </div>
      </div>
    </div>
  );
}
