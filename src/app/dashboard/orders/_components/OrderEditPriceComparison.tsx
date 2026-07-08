"use client";

import { formatYen } from "@/utils/common.utils";

interface OrderEditPriceComparisonProps {
  orderSnapshot: any;
  validationResult: any;
  originalTotalAmount: number;
}

export function OrderEditPriceComparison({
  orderSnapshot,
  validationResult,
  originalTotalAmount,
}: OrderEditPriceComparisonProps) {
  const newSnapshot = validationResult?.calculation?.calculationSnapshot;
  const newTotalAmount = validationResult?.calculation?.totalAmount;

  if (!newSnapshot) return null;

  return (
    <div className="bg-emerald-50/40 border border-emerald-100 rounded-2xl p-6 space-y-4 shadow-sm text-black">
      <h4 className="text-xs font-black text-emerald-800 uppercase tracking-wider">
        Price Breakdown Comparison
      </h4>

      <div className="grid grid-cols-3 gap-2 text-[10px] font-bold text-gray-500 border-b border-emerald-100 pb-2">
        <span>Metric</span>
        <span className="text-right">Original</span>
        <span className="text-right">New</span>
      </div>

      <div className="divide-y divide-emerald-100/50 text-xs">
        {/* Subtotal */}
        <div className="grid grid-cols-3 gap-2 py-2.5">
          <span className="text-gray-500 font-medium">Subtotal</span>
          <span className="text-right font-semibold text-gray-700">
            {formatYen(orderSnapshot?.subTotal || 0)}
          </span>
          <span className="text-right font-bold text-gray-900">
            {formatYen(newSnapshot?.subTotal)}
          </span>
        </div>

        {/* Coupon Discount */}
        {((orderSnapshot?.couponDiscount || 0) > 0 ||
          newSnapshot?.couponDiscount > 0) && (
          <div className="grid grid-cols-3 gap-2 py-2.5 text-emerald-600 font-bold">
            <span>Coupon</span>
            <span className="text-right">
              -{formatYen(orderSnapshot?.couponDiscount || 0)}
            </span>
            <span className="text-right">
              -{formatYen(newSnapshot?.couponDiscount)}
            </span>
          </div>
        )}

        {/* Wallet Discount */}
        {((orderSnapshot?.walletDebit || 0) > 0 ||
          newSnapshot?.walletDebit > 0) && (
          <div className="grid grid-cols-3 gap-2 py-2.5 text-blue-600 font-bold">
            <span>Wallet</span>
            <span className="text-right">
              -{formatYen(orderSnapshot?.walletDebit || 0)}
            </span>
            <span className="text-right">
              -{formatYen(newSnapshot?.walletDebit)}
            </span>
          </div>
        )}

        {/* Shipping Fee */}
        {((orderSnapshot?.shippingFee || 0) > 0 ||
          newSnapshot?.shippingFee > 0) && (
          <div className="grid grid-cols-3 gap-2 py-2.5">
            <span className="text-gray-500 font-medium">Shipping</span>
            <span className="text-right font-semibold text-gray-700">
              {formatYen(orderSnapshot?.shippingFee || 0)}
            </span>
            <span className="text-right font-bold text-gray-900">
              {formatYen(newSnapshot?.shippingFee)}
            </span>
          </div>
        )}

        {/* Regional Surcharge */}
        {((orderSnapshot?.otherCharges || 0) > 0 ||
          newSnapshot?.otherCharges > 0) && (
          <div className="grid grid-cols-3 gap-2 py-2.5">
            <span className="text-gray-500 font-medium">Surcharge</span>
            <span className="text-right font-semibold text-gray-700">
              {formatYen(orderSnapshot?.otherCharges || 0)}
            </span>
            <span className="text-right font-bold text-gray-900">
              {formatYen(newSnapshot?.otherCharges)}
            </span>
          </div>
        )}

        {/* Minimum Order Surcharge */}
        {((orderSnapshot?.penaltyAmount || 0) > 0 ||
          newSnapshot?.penaltyAmount > 0) && (
          <div className="grid grid-cols-3 gap-2 py-2.5 text-amber-600 font-bold">
            <span>Min Purchase Penalty</span>
            <span className="text-right">
              {formatYen(orderSnapshot?.penaltyAmount || 0)}
            </span>
            <span className="text-right">
              {formatYen(newSnapshot?.penaltyAmount)}
            </span>
          </div>
        )}

        {/* Consumption Tax */}
        <div className="grid grid-cols-3 gap-2 py-2.5">
          <span className="text-gray-500 font-medium">Tax</span>
          <span className="text-right font-semibold text-gray-700">
            {formatYen(orderSnapshot?.taxTotal || 0)}
          </span>
          <span className="text-right font-bold text-gray-900">
            {formatYen(newSnapshot?.taxTotal)}
          </span>
        </div>

        {/* Total */}
        <div className="grid grid-cols-3 gap-2 pt-4 pb-1 border-t border-emerald-200 items-baseline">
          <span className="text-sm font-bold text-gray-800">Total</span>
          <span className="text-right text-xs font-semibold text-gray-500">
            {formatYen(originalTotalAmount || 0)}
          </span>
          <div className="text-right">
            <span className="text-base font-black text-gray-900 block">
              {formatYen(newTotalAmount)}
            </span>
            {(originalTotalAmount || 0) !== newTotalAmount && (
              <p className="text-[10px] text-gray-500 font-bold mt-0.5 whitespace-nowrap">
                Diff:{" "}
                <span
                  className={
                    newTotalAmount > (originalTotalAmount || 0)
                      ? "text-red-500"
                      : "text-emerald-500"
                  }>
                  {newTotalAmount > (originalTotalAmount || 0) ? "+" : "-"}
                  {formatYen(
                    Math.abs(newTotalAmount - (originalTotalAmount || 0)),
                  )}
                </span>
              </p>
            )}
          </div>
        </div>
      </div>
    </div>
  );
}
