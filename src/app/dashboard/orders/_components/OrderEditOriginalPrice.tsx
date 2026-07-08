"use client";

import { formatYen } from "@/utils/common.utils";

interface OrderEditOriginalPriceProps {
  orderSnapshot: any;
  totalAmount: number;
}

export function OrderEditOriginalPrice({
  orderSnapshot,
  totalAmount,
}: OrderEditOriginalPriceProps) {
  if (!orderSnapshot) return null;

  return (
    <div className="bg-gray-50/50 border border-gray-150 rounded-2xl p-6 space-y-4 shadow-sm">
      <h4 className="text-xs font-black text-gray-700 uppercase tracking-wider">
        Original Order Details
      </h4>
      <div className="divide-y divide-gray-100 text-xs">
        <div className="flex justify-between py-2.5">
          <span className="text-gray-500 font-medium">Subtotal</span>
          <span className="font-semibold text-gray-900">
            {formatYen(orderSnapshot.subTotal || 0)}
          </span>
        </div>
        {(orderSnapshot?.couponDiscount || 0) > 0 && (
          <div className="flex justify-between py-2.5 text-emerald-600 font-bold">
            <span>Coupon Discount</span>
            <span>-{formatYen(orderSnapshot?.couponDiscount)}</span>
          </div>
        )}
        {(orderSnapshot?.walletDebit || 0) > 0 && (
          <div className="flex justify-between py-2.5 text-blue-600 font-bold">
            <span>Wallet Discount</span>
            <span>-{formatYen(orderSnapshot?.walletDebit)}</span>
          </div>
        )}
        {(orderSnapshot?.shippingFee || 0) > 0 && (
          <div className="flex justify-between py-2.5">
            <span className="text-gray-500 font-medium">Shipping Fee</span>
            <span className="font-semibold text-gray-900">
              {formatYen(orderSnapshot?.shippingFee)}
            </span>
          </div>
        )}
        {(orderSnapshot?.otherCharges || 0) > 0 && (
          <div className="flex justify-between py-2.5">
            <span className="text-gray-500 font-medium">
              Regional Surcharge
            </span>
            <span className="font-semibold text-gray-900">
              {formatYen(orderSnapshot?.otherCharges)}
            </span>
          </div>
        )}
        {(orderSnapshot?.penaltyAmount || 0) > 0 && (
          <div className="flex justify-between py-2.5 text-amber-600 font-bold">
            <span>Min Purchase Penalty</span>
            <span>{formatYen(orderSnapshot?.penaltyAmount)}</span>
          </div>
        )}
        <div className="flex justify-between py-2.5">
          <span className="text-gray-500 font-medium">Consumption Tax</span>
          <span className="font-semibold text-gray-900">
            {formatYen(orderSnapshot?.taxTotal || 0)}
          </span>
        </div>
        <div className="flex justify-between pt-4 pb-1 border-t border-gray-200">
          <span className="text-sm font-bold text-gray-800">Total Amount</span>
          <span className="text-base font-black text-gray-900">
            {formatYen(totalAmount || 0)}
          </span>
        </div>
      </div>
    </div>
  );
}
